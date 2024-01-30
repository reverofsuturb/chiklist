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
  Attendance
} = require("../../db/models");


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

router.get("/current", async (req, res) => {
  const { user } = req;
  console.log(user);
  const getCurrentUserGroups = await Group.findAll({
    where: { organizerId: user.id },
    // include: { model: Membership}
  });

  res.json(getCurrentUserGroups);
});

router.get("/:groupId/venues", async (req, res) => {
  const getVenueByGroupId = await Venue.findAll({
    where: { groupId: req.params.groupId },
  });
  res.json(getVenueByGroupId);
});

router.get("/:groupId", async (req, res) => {
  const getGroupById = await Group.findByPk(req.params.groupId, {
    include: [{ model: GroupImage }, { model: Membership }, { model: Venue }],
  });
  res.json(getGroupById);
});

router.post("/:groupId/images", async (req, res) => {
  const { url, preview } = req.body;
  const createGroupImage = await GroupImage.create({
    groupId: req.params.groupId,
    url,
    preview,
  });
  res.json(createGroupImage);
});

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

router.delete("/:groupId", async (req, res) => {
  const deleteGroup = await Group.findByPk(req.params.groupId);
  await deleteGroup.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
