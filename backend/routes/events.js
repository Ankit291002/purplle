const express = require("express");
const router = express.Router();

const Event = require("../models/Event");

router.post("/ingest", async (req, res) => {

    try {

        const events = req.body;

        console.log(
            "Events Received:",
            events.length
        );

        const result =
            await Event.insertMany(
                events,
                {
                    ordered: false
                }
            );

        console.log(
            "Inserted:",
            result.length
        );

        res.json({
            success: true,
            inserted: result.length
        });

    } catch (err) {

        console.log(
            "INSERT ERROR:"
        );

        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

module.exports = router;