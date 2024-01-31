const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");

const {
  handleValidationErrors,
  validateGroup,
  validateVenue,
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
  const numMembers = await Membership.count({
    group: [["groupId"], ["id"]],
  });
  const getAllGroupImages = await GroupImage.findAll({
    group: [["groupId"], ["id"]],
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
    group: "id",
  });

  const response = [];

  getAllGroups.forEach((group) => response.push(group.toJSON()));

  let i = 0;

  while (i < response.length) {
    response[i].numMembers = numMembers[i].count;
    response[i].previewImage = getAllGroupImages[i].url;
    i++;
  }

  res.json({ Groups: response });
});

//Get all Groups joined or organized by the Current User

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const numMembers = await Membership.count({
    where: { userId: user.id },
    group: "groupId",
  });
  const getAllUserGroupImages = await GroupImage.findAll({
    include: { model: Group, where: { organizerId: user.id } },
    group: [["groupId"], ["GroupImage.id"]],
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
    group: "id",
  });

  const response = [];

  getAllUserGroups.forEach((group) => response.push(group.toJSON()));

  let i = 0;

  while (i < response.length) {
    response[i].numMembers = numMembers[i].count;
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
  const numAttending = await Attendance.count({
    group: "eventId",
  });
  const getAllEventImages = await EventImage.findAll({ group: "eventId" });
  const getAllEventsGroupVenue = await Event.findAll({
    include: [
      { model: Group, attributes: ["id", "name", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state"] },
    ],
    group: "event.id",
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

  let i = 0;
  while (i < response.length) {
    response[i].numAttending = numAttending[i].count;
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
  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: req.params.groupId },
  });
  if (!getGroupById) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  if (
    memberCheck
      ? memberCheck.status == "co-host"
      : false || getGroupById.organizerId == user.id
  ) {
    const getVenueByGroupId = await getGroupById.getVenues();
    const response = [];
    getVenueByGroupId.forEach((venue) => response.push(venue.toJSON()));
    res.json({ Venues: response });
  } else {
    res.json({
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
  const getMembersByGroupId = await Membership.findAll({
    where: { groupId: req.params.groupId },
    attributes: ["status"],
    include: { model: User, attributes: ["firstName", "lastName"] },
  });
  res.json(getMembersByGroupId);
});

//Create an Event for a Group specified by its id

router.post("/:groupId/events", async (req, res) => {
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

  res.json(createEventByGroupId);
});

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

  res.json(createGroupImage);
});

//Request a Membership for a Group based on the Group's id

router.post("/:groupId/membership", async (req, res) => {
  const { user } = req;
  const requestMembership = await Membership.create({
    groupId: req.params.groupId,
    userId: user.id,
    status: "pending",
  });

  res.json(requestMembership);
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
      return res.json({ message: "Group couldn't be found" });
    }
    const memberCheck = await Membership.findOne({
      where: { userId: user.id, groupId: req.params.groupId },
    });
    if (
      memberCheck
        ? memberCheck.status == "co-host"
        : false || getGroupById.organizerId == user.id
    ) {
      const createVenueByGroupId = await getGroupById.createVenue({
        address,
        city,
        state,
        lat,
        lng,
      });
      res.json(createVenueByGroupId);
    } else {
      res.json({
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

  res.status(201).json(createGroup);
});

//Change the status of a membership for a group specified by id

router.put("/:groupId/membership", async (req, res) => {
  const { memberId, status } = req.body;
  const changeMemberStatus = await Membership.findOne({
    where: { groupId: req.params.groupId, userId: memberId },
  });

  status ? (changeMemberStatus.status = status) : changeMemberStatus.status;
  await changeMemberStatus.save();
  res.json(changeMemberStatus);
});

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

router.delete("/:groupId/membership/:memberId", async (req, res) => {
  const deleteMember = await Membership.findOne({
    where: { groupId: req.params.groupId, userId: req.params.memberId },
  });

  await deleteMember.destroy();
  res.json({ message: "Successfully deleted membership from group" });
});

//Delete a Group

router.delete("/:groupId", requireAuth, async (req, res) => {
  const { user } = req;
  const deleteGroup = await Group.findByPk(req.params.groupId);
  if (!deleteGroup) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  if (deleteGroup.organizerId !== user.id) {
    return res
      .status(403)
      .json({ message: "Current User must be the organizer for the group" });
  }
  await deleteGroup.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
