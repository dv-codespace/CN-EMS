const express = require("express");
const router = express.Router();

const {
    createEvent,
    getAllEvents,
    registerEvent,
    getUserRegistrations
} = require("../controllers/event.controller");

const authOrganizer = require("../middleware/authOrganizer");
const authUser = require("../middleware/authUser");

router.post("/events", authOrganizer, createEvent);

router.get("/events", authUser, getAllEvents);

router.get("/events/registrations", authUser, getUserRegistrations);

router.post("/events/register", authUser, registerEvent);
module.exports = router;