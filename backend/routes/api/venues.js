const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const {
  handleValidationErrors,
  validateVenue,
} = require("../../utils/validation");

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

//Edit a Venue specified by its id

router.put("/:venueId", [requireAuth, validateVenue], async (req, res) => {
  const { user } = req;
  const { address, city, state, lat, lng } = req.body;
  const editVenue = await Venue.findOne({ where: { id: req.params.venueId } });

  if (!editVenue) {
    return res.json({ message: "Venue couldn't be found" });
  }
  const memberCheck = await Membership.findOne({
    where: { userId: user.id, groupId: editVenue.groupId },
  });
  const organizerCheck = await Group.findOne({
    where: { organizerId: user.id },
  });

  console.log(organizerCheck);
  console.log(memberCheck);
  if (
    (memberCheck && memberCheck.status === "co-host") ||
    (organizerCheck && organizerCheck.organizerId === editVenue.groupId)
  ) {
    address ? (editVenue.address = address) : editVenue.address;
    city ? (editVenue.city = city) : editVenue.city;
    state ? (editVenue.state = state) : editVenue.state;
    lat ? (editVenue.lat = lat) : editVenue.lat;
    lng ? (editVenue.lng = lng) : editVenue.lng;

    await editVenue.save();

    res.json(editVenue);
  } else {
    res.json({
      message:
        "Current User must be the organizer of the group or a member of the group with a status of 'co-host'",
    });
  }
});

module.exports = router;
