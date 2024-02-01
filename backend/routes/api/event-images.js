const express = require("express");
const router = express.Router();

const { restoreUser, requireAuth } = require("../../utils/auth");

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

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;

  const deleteEventImage = await EventImage.findByPk(req.params.imageId);
  if (!deleteEventImage) {
    return res.status(404).json({ message: "Event Image couldn't be found" });
  }
  const associatedEvent = await EventImage.findByPk(req.params.imageId, {
    include: { model: Event },
  });
  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: associatedEvent.Event.groupId },
  });

  const organizerCheck = await Group.findOne({
    where: { id: associatedEvent.Event.groupId },
  });
  if (
    (memberCheck && memberCheck.status === "co-host") ||
    (organizerCheck && organizerCheck.organizerId === user.id)
  ) {
    await deleteEventImage.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    res.status(403).json({
      message:
        "Current User must be the organizer of the group or a member of the group with a status of 'co-host'",
    });
  }
});

module.exports = router;
