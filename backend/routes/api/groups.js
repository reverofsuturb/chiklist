const express = require('express');
const router = express.Router();

const {Group, Event} = require("../../db/models");

router.get("/", async (req, res) => {
  const groups = await Event.findAll({ include: Group })
  res.json(groups)
})

module.exports = router;
