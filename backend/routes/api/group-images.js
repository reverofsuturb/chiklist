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

//Delete an Image for a Group

router.delete("/:imageId", async (req, res) => {
  const deleteGroupImage = await GroupImage.findByPk(req.params.imageId);
  await deleteGroupImage.destroy();
  res.json({ message: "Successfully deleted" });
});

module.exports = router;
