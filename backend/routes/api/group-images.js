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

//Delete an Image for a Group

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;

  const deleteGroupImage = await GroupImage.findByPk(req.params.imageId);
  if (!deleteGroupImage) {
    return res.status(404).json({ message: "Group Image couldn't be found" });
  }
  const associatedGroup = await GroupImage.findByPk(req.params.imageId, {
    include: { model: Group },
  });
  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: associatedGroup.Group.id },
  });

  if (
    (memberCheck && memberCheck.status === "co-host") ||
    associatedGroup.Group.organizerId === user.id
  ) {
    await deleteGroupImage.destroy();
    res.json({ message: "Successfully deleted" });
  } else {
    res.status(403).json({
      message:
        "Current User must be the organizer of the group or a member of the group with a status of 'co-host'",
    });
  }
});

module.exports = router;
