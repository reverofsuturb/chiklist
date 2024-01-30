const express = require("express");
const router = express.Router();

const requireAuth = require("../../utils/auth");

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

router.get("/", async (req, res) => {
  const getAllEvents = await Event.findAll({
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "startDate",
      "endDate",
    ],
    include: [
      { model: Attendance },
      { model: EventImage, attributes: [["preview", "previewImage"]] },
      { model: Group, attributes: ["id", "name", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state"] },
    ],
  });

  res.json(getAllEvents);
});

// Get all Attendees of an Event specified by its id

router.get("/:eventId/attendees", async (req, res) => {
  const getAttendees = await Attendance.findAll({
    where: { eventId: req.params.eventId },
    attributes: ["status"],
    include: { model: User, attributes: ["firstName", "lastName"] },
  });

  res.json(getAttendees);
});

//Get details of an Event specified by its id

router.get("/:eventId", async (req, res) => {
  const getEventById = await Event.findByPk(req.params.eventId, {
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "startDate",
      "endDate",
    ],
    include: [
      { model: Attendance },
      { model: EventImage, attributes: [["preview", "previewImage"]] },
      { model: Group, attributes: ["id", "name", "city", "state"] },
      { model: Venue, attributes: ["id", "city", "state"] },
    ],
  });

  res.json(getEventById);
});

//Request to Attend an Event based on the Event's id

router.post("/:eventId/attendance", async (req, res) => {
  const { user } = req;
  const requestAttendance = await Attendance.create({
    eventId: req.params.eventId,
    userId: user.id,
    status: "pending",
  });

  res.json(requestAttendance);
});

//Add an Image to an Event based on the Event's id

router.post("/:eventId/images", async (req, res) => {
  const { url, preview } = req.body;
  const createEventImageById = await EventImage.create({
    eventId: req.params.eventId,
    url,
    preview,
  });

  res.json(createEventImageById);
});

//Change the status of an attendance for an event specified by id

router.put("/:eventId/attendance", async (req, res) => {
  const { userId, status } = req.body;
  const changeAttendStatus = await Attendance.findOne({
    where: { eventId: req.params.eventId, userId },
  });
  status ? (changeAttendStatus.status = status) : changeAttendStatus.status;
  changeAttendStatus.save();
  res.json(changeAttendStatus);
});

//Edit an Event specified by its id

router.put("/:eventId", async (req, res) => {
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

  venueId ? (editEvent.venueId = venueId) : editEvent.venueId;
  name ? (editEvent.name = name) : editEvent.name;
  type ? (editEvent.type = type) : editEvent.type;
  capacity ? (editEvent.capacity = capacity) : editEvent.capacity;
  price ? (editEvent.price = price) : editEvent.price;
  description ? (editEvent.description = description) : editEvent.description;
  startDate ? (editEvent.startDate = startDate) : editEvent.startDate;
  endDate ? (editEvent.endDate = endDate) : editEvent.endDate;

  await editEvent.save();

  res.json(editEvent);
});

//Delete attendance to an event specified by id

router.delete("/:eventId/attendance/:userId", async (req, res) => {
  const deleteAttendance = await Attendance.findOne({
    where: { eventId: req.params.eventId, userId: req.params.userId },
  });
  await deleteAttendance.destroy();
  res.json({ message: "Successfully deleted attendance from event" });
});

//Delete an Event specified by its id

router.delete("/:eventId", async (req, res) => {
  const deleteEvent = await Event.findByPk(req.params.eventId);
  await deleteEvent.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
