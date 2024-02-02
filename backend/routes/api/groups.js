const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");

const {
  handleValidationErrors,
  validateEvent,
  validateGroup,
  validateVenue,
  validateMembership,
} = require("../../utils/validation");

const {
  Group,
  Event,
  GroupImage,
  Membership,
  User,
  Venue,
  EventImage,
  Attendance,
} = require("../../db/models");

//Get all Groups

router.get("/", async (req, res) => {
  let numMembers = await Membership.findAll({
    order: [["groupId", "ASC"]],
  });
  const getAllGroupImages = await GroupImage.findAll({
    order: [["groupId", "ASC"]],
  });

  const getAllGroups = await Group.findAll({
    attributes: [
      "id",
      "organizerId",
      "name",
      "about",
      "type",
      "private",
      "city",
      "state",
      "createdAt",
      "updatedAt",
    ],
  });

  const response = [];

  getAllGroups.forEach((group) => response.push(group.toJSON()));

  let num = [];

  numMembers.forEach((member) => num.push([member.toJSON()]));

  let i = 0;

  while (i < response.length) {
    response[i].numMembers = num[i].length;
    response[i].previewImage = getAllGroupImages[i].url;
    i++;
  }

  res.json({ Groups: response });
});

//Get all Groups joined or organized by the Current User

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  let numMembers = await Membership.findAll({
    order: [["groupId", "ASC"]],
  });
  const getAllUserGroupImages = await GroupImage.findAll({
    include: { model: Group, where: { organizerId: user.id } },
    order: [["groupId", "ASC"]],
  });

  const getAllUserGroups = await Group.findAll({
    where: { organizerId: user.id },
    attributes: [
      "id",
      "organizerId",
      "name",
      "about",
      "type",
      "private",
      "city",
      "state",
      "createdAt",
      "updatedAt",
    ],
  });

  const response = [];

  getAllUserGroups.forEach((group) => response.push(group.toJSON()));

  let num = [];

  numMembers.forEach((member) => num.push([member.toJSON()]));

  let i = 0;

  while (i < response.length) {
    response[i].numMembers = num[i].length;
    response[i].previewImage = getAllUserGroupImages[i].url;
    i++;
  }

  res.json({ Groups: response });
});

//Get all Events of a Group specified by its id

router.get("/:groupId/events", async (req, res) => {
  const getGroupById = await Group.findByPk(req.params.groupId);
  if (!getGroupById) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  const numAttending = await Attendance.findAll({
    order: [["eventId", "ASC"]],
  });
  const getAllEventImages = await EventImage.findAll({
    order: [["eventId", "ASC"]],
  });
  const getAllEventsGroupVenue = await Event.findAll({
    include: [
      { model: Group, attributes: ["id", "name", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state"] },
    ],
  });
  const getAllEvents = await Event.findAll({
    where: { groupId: getGroupById.id },
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "startDate",
      "endDate",
    ],
  });

  const response = [];
  getAllEvents.forEach((event) => response.push(event.toJSON()));

  let num = [];

  numAttending.forEach((attendee) => num.push([attendee.toJSON()]));

  let i = 0;
  while (i < response.length) {
    response[i].numAttending = num[i].length;
    response[i].previewImage = getAllEventImages[i].url;
    response[i].Group = getAllEventsGroupVenue[i].Group;
    response[i].Venue = getAllEventsGroupVenue[i].Venue;
    i++;
  }

  res.json({ Events: response });
});

//Get All Venues for a Group specified by its id

router.get("/:groupId/venues", requireAuth, async (req, res) => {
  const { user } = req;
  const getGroupById = await Group.findByPk(req.params.groupId);

  if (!getGroupById) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: getGroupById.id },
  });
  const organizerCheck = await Group.findOne({
    where: { organizerId: user.id },
  });

  if (
    (memberCheck && memberCheck.status === "co-host") ||
    (organizerCheck && organizerCheck.organizerId === getGroupById.organizerId)
  ) {
    const getVenueByGroupId = await getGroupById.getVenues();
    const response = [];
    getVenueByGroupId.forEach((venue) => response.push(venue.toJSON()));
    res.json({ Venues: response });
  } else {
    res.status(403).json({
      message:
        "Current User must be the organizer of the group or a member of the group with a status of 'co-host'",
    });
  }
});

//Get details of a Group from an id

router.get("/:groupId", async (req, res) => {
  const getGroupById = await Group.findByPk(req.params.groupId);

  if (!getGroupById) {
    res.status(404).json({ message: "Group couldn't be found" });
  }

  const numMembers = await Membership.count({
    where: { groupId: req.params.groupId },
  });
  const getGroupImagesByGroupId = await GroupImage.findAll({
    where: { groupId: req.params.groupId },
    attributes: ["id", "url", "preview"],
  });
  const getOrganizer = await User.findOne({
    where: { id: getGroupById.organizerId },
    attributes: ["id", "firstName", "lastName"],
  });
  const getVenuesByGroupId = await Venue.findAll({
    where: { groupId: req.params.groupId },
    attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
  });
  const group = getGroupById.toJSON();

  res.json({
    ...group,
    numMembers,
    GroupImages: getGroupImagesByGroupId,
    Organizer: getOrganizer,
    Venues: getVenuesByGroupId,
  });
});

//Get all Members of a Group specified by its id

router.get("/:groupId/members", async (req, res) => {
  const { user } = req;

  const groupCheck = await Group.findByPk(req.params.groupId);
  if (!groupCheck) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const organizerCheck = await Group.findOne({
    where: { organizerId: user.id },
  });

  if (organizerCheck && organizerCheck.organizerId === groupCheck.organizerId) {
    const getMembersByGroupId = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        where: { groupId: groupCheck.id },
        attributes: ["status"],
      },
    });
    res.json(getMembersByGroupId);
  } else {
    const getMembersByGroupId = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        where: {
          groupId: groupCheck.id,
          status: ["co-host", "member", "organizer"],
        },
        attributes: ["status"],
      },
    });
    res.json(getMembersByGroupId);
  }
});

//Create an Event for a Group specified by its id

router.post(
  "/:groupId/events",
  [requireAuth, validateEvent],
  async (req, res) => {
    const { user } = req;
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;
    const venueCheck = await Venue.findByPk(venueId);
    if (!venueCheck) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }
    const groupCheck = await Group.findByPk(req.params.groupId);
    if (!groupCheck) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    const memberCheck = await Membership.findOne({
      where: { userId: user.id, groupId: groupCheck.id },
    });
    const organizerCheck = await Group.findOne({
      where: { organizerId: user.id },
    });

    console.log(organizerCheck);
    console.log(memberCheck);
    if (
      (memberCheck && memberCheck.status === "co-host") ||
      (organizerCheck && organizerCheck.organizerId === groupCheck.organizerId)
    ) {
      const createEventByGroupId = await Event.create({
        venueId,
        groupId: req.params.groupId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });
      const createAttendance = await Attendance.create({
        eventId: createEventByGroupId.id,
        userId: user.id,
        status: "attending",
      });

      res.json({
        id: createEventByGroupId.id,
        groupId: createEventByGroupId.groupId,
        venueId: createEventByGroupId.venueId,
        name: createEventByGroupId.name,
        type: createEventByGroupId.type,
        capacity: createEventByGroupId.capacity,
        price: createEventByGroupId.price,
        description: createEventByGroupId.description,
        startDate: createEventByGroupId.startDate,
        endDate: createEventByGroupId.endDate,
      });
    } else {
      res.status(403).json({
        message:
          "Current User must be the organizer of the group or a member of the group with a status of 'co-host'",
      });
    }
  }
);

//Add an Image to a Group based on the Group's id

router.post("/:groupId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { url, preview } = req.body;

  const checkGroup = await Group.findByPk(req.params.groupId);
  if (!checkGroup) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  if (checkGroup.organizerId !== user.id) {
    return res
      .status(403)
      .json({ message: "Current User must be the organizer for the group" });
  }

  const createGroupImage = await checkGroup.createGroupImage({
    url,
    preview,
  });

  res.json({
    id: createGroupImage.id,
    url: createGroupImage.url,
    preview: createGroupImage.preview,
  });
});

//Request a Membership for a Group based on the Group's id

router.post("/:groupId/membership", requireAuth, async (req, res) => {
  const { user } = req;

  const checkGroup = await Group.findByPk(req.params.groupId);
  if (!checkGroup) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: checkGroup.id },
  });
  if (memberCheck) {
    if (memberCheck.status === "pending") {
      return res
        .status(400)
        .json({ message: "Membership has already been requested" });
    }
    if (
      memberCheck.status === "member" ||
      memberCheck.status === "organizer" ||
      memberCheck.status === "co-host"
    ) {
      return res
        .status(400)
        .json({ message: "User is already a member of the group" });
    }
  }

  const requestMembership = await Membership.create({
    groupId: req.params.groupId,
    userId: user.id,
    status: "pending",
  });

  res.json({
    memberId: requestMembership.userId,
    status: requestMembership.status,
  });
});

//Create a new Venue for a Group specified by its id

router.post(
  "/:groupId/venues",
  [requireAuth, validateVenue],
  async (req, res) => {
    const { user } = req;
    const { address, city, state, lat, lng } = req.body;
    const getGroupById = await Group.findByPk(req.params.groupId);
    if (!getGroupById) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    const memberCheck = await Membership.findOne({
      where: { userId: user.id, groupId: getGroupById.id },
    });
    const organizerCheck = await Group.findOne({
      where: { organizerId: user.id },
    });

    console.log(organizerCheck);
    console.log(memberCheck);
    if (
      (memberCheck && memberCheck.status === "co-host") ||
      (organizerCheck &&
        organizerCheck.organizerId === getGroupById.organizerId)
    ) {
      const createVenueByGroupId = await getGroupById.createVenue({
        address,
        city,
        state,
        lat,
        lng,
      });
      res.json({
        id: createVenueByGroupId.id,
        address: createVenueByGroupId.address,
        city: createVenueByGroupId.city,
        state: createVenueByGroupId.state,
        lat: createVenueByGroupId.lat,
        lang: createVenueByGroupId.lng,
      });
    } else {
      res.status(403).json({
        message:
          "Current User must be the organizer of the group or a member of the group with a status of 'co-host'",
      });
    }
  }
);

//Create a Group

router.post("/", [requireAuth, validateGroup], async (req, res) => {
  const { user } = req;
  const { name, about, type, private, city, state } = req.body;
  const createGroup = await Group.create({
    name,
    organizerId: user.id,
    about,
    type,
    private,
    city,
    state,
  });

  const createMember = await Membership.create({
    userId: user.id,
    groupId: createGroup.id,
    status: "organizer",
  });

  res.status(201).json(createGroup);
});

//Change the status of a membership for a group specified by id

router.put(
  "/:groupId/membership",
  [requireAuth, validateMembership],
  async (req, res) => {
    const { user } = req;
    const { memberId, status } = req.body;
    const userCheck = await User.findByPk(memberId);
    if (!userCheck) {
      return res.status(404).json({ message: "User couldn't be found" });
    }
    const groupCheck = await Group.findByPk(req.params.groupId);
    if (!groupCheck) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }
    const memberCheck = await Membership.findOne({
      where: { groupId: groupCheck.id, userId: userCheck.id },
    });
    if (!memberCheck) {
      return res.status(404).json({
        message: "Membership between the user and the group doesn't exist",
      });
    }
    const userMembership = await Membership.findOne({
      where: { userId: user.id, groupId: groupCheck.id },
    });

    if (status && status === "pending") {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          status: "Cannot change a membership status to pending",
        },
      });
    }
    if (status && status === "member") {
      if (
        (userMembership && userMembership.status === "co-host") ||
        user.id === groupCheck.organizerId
      ) {
        status ? (memberCheck.status = status) : memberCheck.status;
        await memberCheck.save();
        return res.json({
          id: memberCheck.id,
          groupId: memberCheck.groupId,
          memberId: memberCheck.userId,
          status: memberCheck.status,
        });
      } else {
        return res.status(403).json({
          message:
            "Current User must already be the organizer or have a membership to the group with the status of 'co-host'",
        });
      }
    }
    if (status && status === "co-host") {
      if (user.id === groupCheck.organizerId) {
        status ? (memberCheck.status = status) : memberCheck.status;
        await memberCheck.save();
        return res.json({
          id: memberCheck.id,
          groupId: memberCheck.groupId,
          memberId: memberCheck.userId,
          status: memberCheck.status,
        });
      } else {
        return res
          .status(403)
          .json({ message: "Current User must already be the organizer" });
      }
    }
    if (status && status === "organizer") {
      if (user.id === groupCheck.organizerId) {
        status ? (memberCheck.status = status) : memberCheck.status;
        await memberCheck.save();
        return res.json({
          id: memberCheck.id,
          groupId: memberCheck.groupId,
          memberId: memberCheck.userId,
          status: memberCheck.status,
        });
      } else {
        return res
          .status(403)
          .json({ message: "Current User must already be the organizer" });
      }
    }
  }
);

//Edit a Group

router.put("/:groupId", [requireAuth, validateGroup], async (req, res) => {
  const { user } = req;
  const { name, about, type, private, city, state } = req.body;

  const editGroup = await Group.findByPk(req.params.groupId);

  if (!editGroup) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  if (editGroup.organizerId !== user.id) {
    return res
      .status(403)
      .json({ message: "Current User must be the organizer for the group" });
  }

  name ? (editGroup.name = name) : editGroup.name;
  about ? (editGroup.about = about) : editGroup.about;
  type ? (editGroup.type = type) : editGroup.type;
  private ? (editGroup.private = private) : editGroup.private;
  city ? (editGroup.city = city) : editGroup.city;
  state ? (editGroup.state = state) : editGroup.state;

  await editGroup.save();
  res.json(editGroup);
});

//Delete membership to a group specified by id

router.delete(
  "/:groupId/membership/:memberId",
  requireAuth,
  async (req, res) => {
    const { user } = req;

    const userCheck = await User.findByPk(req.params.memberId);
    if (!userCheck) {
      return res.status(404).json({ message: "User couldn't be found" });
    }
    const groupCheck = await Group.findByPk(req.params.groupId);
    if (!groupCheck) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    const deleteMember = await Membership.findOne({
      where: { groupId: req.params.groupId, userId: req.params.memberId },
    });
    if (!deleteMember) {
      return res
        .status(404)
        .json({ message: "Membership does not exist for this User" });
    }

    const userMembership = await Membership.findOne({
      where: { userId: user.id, groupId: groupCheck.id },
    });
    if (
      userMembership.userId === deleteMember.userId ||
      user.id === groupCheck.organizerId
    ) {
      await deleteMember.destroy();
      res.json({ message: "Successfully deleted membership from group" });
    } else {
      return res.status(403).json({
        message:
          "Current User must be the host of the group, or the user whose membership is being deleted",
      });
    }
  }
);

//Delete a Group

router.delete("/:groupId", requireAuth, async (req, res) => {
  const { user } = req;
  const deleteGroup = await Group.findByPk(req.params.groupId);
  if (!deleteGroup) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  if (deleteGroup.organizerId === user.id) {
    await deleteGroup.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    return res
      .status(403)
      .json({ message: "Current User must be the organizer for the group" });
  }
});

module.exports = router;
