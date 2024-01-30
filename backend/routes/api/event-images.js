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

//Delete an Image for an Event

router.delete("/:imageId", async (req, res) => {
  const deleteEventImage = await EventImage.findByPk(req.params.imageId);
  await deleteEventImage.destroy();
  res.json({ message: "Successfully deleted" });
});


module.exports = router;
