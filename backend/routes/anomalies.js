const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/:storeId/anomalies", async (req, res) => {

    try {

        const { storeId } = req.params;

        const anomalies = [];

        const visitors = await Event.distinct(
            "visitor_id",
            {
                store_id: storeId,
                is_staff: false
            }
        );

        if (visitors.length < 10) {

            anomalies.push({
                type: "LOW_TRAFFIC",
                severity: "WARN",
                suggested_action:
                    "Increase customer engagement"
            });

        }

        const queueEvents =
            await Event.countDocuments({
                store_id: storeId,
                event_type:
                    "BILLING_QUEUE_JOIN"
            });

        if (queueEvents > 20) {

            anomalies.push({
                type: "QUEUE_SPIKE",
                severity: "CRITICAL",
                suggested_action:
                    "Open additional billing counters"
            });

        }

        res.json({
            store_id: storeId,
            anomalies
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;