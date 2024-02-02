const express = require("express");
const router = express.Router();
const { restoreUser, requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");

const {
  validateEvent,
  validateSearch,
  validateAttendance,
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

//Get all Events

router.get("/", validateSearch, async (req, res) => {
  let { page, size, name, type, startDate } = req.query;

  page ? (page = parseInt(page)) : (page = 1);
  size ? (size = parseInt(size)) : (size = 20);
  if (isNaN(page)) {
    page = 1;
  }
  if (isNaN(size)) {
    size = 20;
  }
  let pagination = {
    limit: size,
    offset: size * (page - 1),
  };

  let where = {};
  name ? (where.name = { [Op.substring]: name }) : where.name;
  type ? (where.type = { [Op.substring]: type }) : where.type;
  startDate
    ? (where.startDate = { [Op.substring]: startDate })
    : where.startDate;

  const numAttending = await Attendance.findAll({
    order: [["eventId", "ASC"]],
  });
  console.log(numAttending);
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
    where,
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "startDate",
      "endDate",
    ],

    ...pagination,
  });

  const response = [];
  getAllEvents.forEach((event) => response.push(event.toJSON()));

  let num = [];

  numAttending.forEach((attendee) => num.push([attendee.toJSON()]));
  console.log(num);

  let i = 0;
  while (i < response.length) {
    response[i].numAttending = num[i].length;
    if (getAllEventImages[i].url) {
      response[i].previewImage = getAllEventImages[i].url;
    }
    response[i].Group = getAllEventsGroupVenue[i].Group;
    if (getAllEventsGroupVenue[i].Venue) {
      response[i].Venue = getAllEventsGroupVenue[i].Venue;
    }
    i++;
  }

  res.json({ Events: response });
});

// Get all Attendees of an Event specified by its id

router.get("/:eventId/attendees", async (req, res) => {
  const { user } = req;
  const eventCheck = await Event.findByPk(req.params.eventId);
  if (!eventCheck) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const attendanceCheck = await Attendance.findOne({
    where: { userId: user.id, eventId: eventCheck.id },
  });
  const organizerCheck = await Group.findOne({
    where: { organizerId: user.id },
  });

  if (
    (attendanceCheck && attendanceCheck.status === "co-host") ||
    (organizerCheck && organizerCheck.organizerId === user.id)
  ) {
    const getAttendancesByEventId = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        where: { eventId: eventCheck.id },
        attributes: ["status"],
      },
    });
    res.json({ Attendees: getAttendancesByEventId });
  } else {
    const getAttendancesByEventId = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        where: {
          eventId: eventCheck.id,
          status: ["attending", "waitlist"],
        },
        attributes: ["status"],
      },
    });
    res.json({ Attendees: getAttendancesByEventId });
  }
});

//Get details of an Event specified by its id

router.get("/:eventId", async (req, res) => {
  const getEventById = await Event.findByPk(req.params.eventId, {
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "description",
      "type",
      "capacity",
      "price",
      "startDate",
      "endDate",
    ],
  });
  if (!getEventById) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }
  const numAttending = await Attendance.findAll({
    where: { eventId: req.params.eventId },
  });
  const getEventImageById = await EventImage.findOne({
    where: { eventId: req.params.eventId },
    attributes: ["id", "url", "preview"],
  });
  const getEventsGroupVenueById = await Event.findByPk(req.params.eventId, {
    include: [
      { model: Group, attributes: ["id", "name", "private", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state", "lat", "lng"] },
    ],
  });

  const response = getEventById.toJSON();

  response.numAttending = numAttending.length;
  response.Group = getEventsGroupVenueById.Group;
  if (getEventsGroupVenueById.Venue) {
    response.Venue = getEventsGroupVenueById.Venue;
  }
  if (getEventImageById) {
    response.EventImages = getEventImageById;
  }

  res.json(response);
});

//Request to Attend an Event based on the Event's id

router.post("/:eventId/attendance", requireAuth, async (req, res) => {
  const { user } = req;

  const eventCheck = await Event.findByPk(req.params.eventId);
  if (!eventCheck) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: eventCheck.groupId },
  });
  if (!memberCheck || memberCheck.status === "pending") {
    return res
      .status(403)
      .json({ message: "Current User must be a member of the group" });
  }
  const attendanceCheck = await Attendance.findOne({
    where: { userId: user.id, eventId: eventCheck.id },
  });

  if (attendanceCheck) {
    if (attendanceCheck.status === "pending") {
      return res
        .status(400)
        .json({ message: "Attendance has already been requested" });
    }
    if (attendanceCheck.status === "waitlist") {
      return res
        .status(400)
        .json({ message: "User is on the waitlist for this event" });
    }
    if (attendanceCheck.status === "attending") {
      return res
        .status(400)
        .json({ message: "User is already an attendee of the event" });
    }
  }

  const requestAttendance = await Attendance.create({
    eventId: eventCheck.id,
    userId: user.id,
    status: "pending",
  });

  res.json({
    userId: requestAttendance.userId,
    status: requestAttendance.status,
  });
});

//Add an Image to an Event based on the Event's id

router.post("/:eventId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { url, preview } = req.body;

  const checkEvent = await Event.findByPk(req.params.eventId);
  if (!checkEvent) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const attendeesCheck = await Attendance.findOne({
    where: { userId: user.id, eventId: checkEvent.id },
  });
  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: checkEvent.groupId },
  });
  const organizerCheck = await Group.findOne({
    where: { organizerId: user.id },
  });

  if (
    (attendeesCheck && attendeesCheck.status === "waitlist") ||
    (attendeesCheck && attendeesCheck.status === "attending") ||
    (memberCheck && memberCheck.status === "co-host") ||
    (organizerCheck && organizerCheck.organizerId === user.id)
  ) {
    const createEventImageById = await EventImage.create({
      eventId: req.params.eventId,
      url,
      preview,
    });

    res.json({
      id: createEventImageById.id,
      url: createEventImageById.url,
      preview: createEventImageById.preview,
    });
  } else {
    res.status(403).json({
      message:
        "Current User must be an attendee, host, or co-host of the event",
    });
  }
});

//Change the status of an attendance for an event specified by id

router.put(
  "/:eventId/attendance",
  [requireAuth, validateAttendance],
  async (req, res) => {
    const { user } = req;
    const { userId, status } = req.body;

    const userCheck = await User.findByPk(userId);
    if (!userCheck) {
      return res.status(404).json({ message: "User couldn't be found" });
    }
    const eventCheck = await Event.findByPk(req.params.eventId);
    if (!eventCheck) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const groupCheck = await Group.findByPk(eventCheck.groupId);

    const attendanceCheck = await Attendance.findOne({
      where: { userId: userId, eventId: eventCheck.id }, attributes: ['id', 'eventId', 'userId', 'status']
    });

    if (!attendanceCheck) {
      return res.status(404).json({
        message: "Attendance between the user and the event doesn't exist",
      });
    }

    const userMembership = await Membership.findOne({
      where: { userId: user.id, groupId: eventCheck.groupId },
    });

    if (status && status === "pending") {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          status: "Cannot change an attendance status to pending",
        },
      });
    }
    if (
      (status && status === "waitlist") ||
      (status && status === "attending")
    ) {
      if (
        (userMembership && userMembership.status === "co-host") ||
        user.id === groupCheck.organizerId
      ) {
        status ? (attendanceCheck.status = status) : attendanceCheck.status;
        await attendanceCheck.save();
        return res.json({
          id: attendanceCheck.id,
          eventId: attendanceCheck.eventId,
          userId: attendanceCheck.userId,
          status: attendanceCheck.status,
        });
      } else {
        res.status(403).json({
          message:
            "Current User must already be the organizer or have a member to the group with the status of 'co-host'",
        });
      }
    }
  }
);

//Edit an Event specified by its id

router.put("/:eventId", [requireAuth, validateEvent], async (req, res) => {
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

  const editEvent = await Event.findByPk(req.params.eventId);
  if (!editEvent) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }
  const venueCheck = await Venue.findByPk(venueId);
  if (!venueCheck) {
    return res.status(404).json({ message: "Venue couldn't be found" });
  }

  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: editEvent.groupId },
  });

  const organizerCheck = await Group.findOne({
    where: { organizerId: user.id },
  });

  if (
    (memberCheck && memberCheck.status === "co-host") ||
    (organizerCheck && organizerCheck.organizerId === user.id)
  ) {
    venueId ? (editEvent.venueId = venueId) : editEvent.venueId;
    name ? (editEvent.name = name) : editEvent.name;
    type ? (editEvent.type = type) : editEvent.type;
    capacity ? (editEvent.capacity = capacity) : editEvent.capacity;
    price ? (editEvent.price = price) : editEvent.price;
    description ? (editEvent.description = description) : editEvent.description;
    startDate ? (editEvent.startDate = startDate) : editEvent.startDate;
    endDate ? (editEvent.endDate = endDate) : editEvent.endDate;

    await editEvent.save();

    res.json({
      id: editEvent.id,
      groupId: editEvent.groupId,
      venueId: editEvent.venueId,
      name: editEvent.name,
      type: editEvent.type,
      capacity: editEvent.capacity,
      price: editEvent.price,
      description: editEvent.description,
      startDate: editEvent.startDate,
      endDate: editEvent.endDate,
    });
  } else {
    res.status(403).json({
      message:
        "Current User must be an attendee, host, or co-host of the event",
    });
  }
});

//Delete attendance to an event specified by id

router.delete("/:eventId/attendance/:userId", requireAuth, async (req, res) => {
  const { user } = req;
  const eventCheck = await Event.findByPk(req.params.eventId);
  if (!eventCheck) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }
  const userCheck = await User.findByPk(req.params.userId);
  if (!userCheck) {
    return res.status(404).json({ message: "User couldn't be found" });
  }
  const deleteAttendance = await Attendance.findOne({
    where: { eventId: req.params.eventId, userId: req.params.userId },
  });
  if (!deleteAttendance) {
    return res
      .status(404)
      .json({ message: "Attendance does not exist for this user" });
  }

  const eventFind = await Event.findOne({
    where: { id: deleteAttendance.eventId },
  });

  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: eventFind.groupId },
  });

  const organizerCheck = await Group.findOne({
    where: { id: eventFind.groupId },
  });

  if (
    (memberCheck &&
      memberCheck.status === "member" &&
      memberCheck.userId === deleteAttendance.userId) ||
    (organizerCheck && organizerCheck.organizerId === user.id)
  ) {
    await deleteAttendance.destroy();
    res.json({ message: "Successfully deleted attendance from event" });
  } else {
    res.status(403).json({
      message:
        "Current User must be the organizer of the group, a member of the group with a status of 'co-host', or a member of the group",
    });
  }
});

//Delete an Event specified by its id

router.delete("/:eventId", requireAuth, async (req, res) => {
  const { user } = req;
  const deleteEvent = await Event.findByPk(req.params.eventId);
  if (!deleteEvent) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: deleteEvent.groupId },
  });

  const organizerCheck = await Group.findOne({
    where: { organizerId: user.id },
  });

  if (
    (memberCheck && memberCheck.status === "co-host") ||
    (organizerCheck && organizerCheck.organizerId === user.id)
  ) {
    await deleteEvent.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    res.status(403).json({
      message:
        "Current User must be the organizer of the group or a member of the group with a status of 'co-host'",
    });
  }
});

module.exports = router;
