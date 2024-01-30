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

//Get all Groups

router.get("/", async (req, res) => {
  const where = {};
  const numMembers = await Membership.count({
    group: "groupId",
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
      // [[numMembers, 'numMembers']]
    ],
    include: { model: GroupImage, attributes: [["preview", "previewImage"]] },
  });

  res.json(getAllGroups);
});

//Get all Groups joined or organized by the Current User

router.get("/current", async (req, res) => {
  const { user } = req;
  console.log(user);
  const getCurrentUserGroups = await Group.findAll({
    where: { organizerId: user.id },
    // include: { model: Membership}
  });

  res.json(getCurrentUserGroups);
});

//Get all Events of a Group specified by its id

router.get("/:groupId/events", async (req, res) => {
  const getEventsByGroupId = await Event.findAll({
    where: { groupId: req.params.groupId },
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
  res.json({ getEventsByGroupId });
});

//Get All Venues for a Group specified by its id

router.get("/:groupId/venues", async (req, res) => {
  const getVenueByGroupId = await Venue.findAll({
    where: { groupId: req.params.groupId },
  });
  res.json(getVenueByGroupId);
});

//Get details of a Group from an id

router.get("/:groupId", async (req, res) => {
  const getGroupById = await Group.findByPk(req.params.groupId, {
    include: [{ model: GroupImage }, { model: Membership }, { model: Venue }],
  });
  res.json(getGroupById);
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

router.post("/:groupId/images", async (req, res) => {
  const { url, preview } = req.body;
  const createGroupImage = await GroupImage.create({
    groupId: req.params.groupId,
    url,
    preview,
  });
  res.json(createGroupImage);
});

//Create a new Venue for a Group specified by its id

router.post("/:groupId/venues", async (req, res) => {
  const { address, city, state, lat, lng } = req.body;
  const createVenuebyGroupId = await Venue.create({
    groupId: req.params.groupId,
    address,
    city,
    state,
    lat,
    lng,
  });

  res.json(createVenuebyGroupId);
});

//Create a Group

router.post("/", async (req, res) => {
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

  res.json(createGroup);
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

router.put("/:groupId", async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const editGroup = await Group.findByPk(req.params.groupId);

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

router.delete("/:groupId", async (req, res) => {
  const deleteGroup = await Group.findByPk(req.params.groupId);
  await deleteGroup.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
