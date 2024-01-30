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

//Edit a Venue specified by its id

router.put("/:venueId", async (req, res) => {
  const { address, city, state, lat, lng } = req.body;
  const editVenue = await Venue.findOne({ where: { id: req.params.venueId } });

  address ? (editVenue.address = address) : editVenue.address;
  city ? (editVenue.city = city) : editVenue.city;
  state ? (editVenue.state = state) : editVenue.state;
  lat ? (editVenue.lat = lat) : editVenue.lat;
  lng ? (editVenue.lng = lng) : editVenue.lng;

  await editVenue.save();

  res.json(editVenue);
});



module.exports = router;
