const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/:storeId/funnel", async (req, res) => {

    try {

        const storeId =
            req.params.storeId;

        const entry =
            await Event.distinct(
                "visitor_id",
                {
                    store_id: storeId,
                    event_type:
                    "ENTRY"
                }
            );

        const zone =
            await Event.distinct(
                "visitor_id",
                {
                    store_id: storeId,
                    event_type:
                    "ZONE_ENTER"
                }
            );

        const billing =
            await Event.distinct(
                "visitor_id",
                {
                    store_id: storeId,
                    event_type:
                    "BILLING_QUEUE_JOIN"
                }
            );

        const purchase =
            await Event.distinct(
                "visitor_id",
                {
                    store_id: storeId,
                    event_type:
                    "PURCHASE"
                }
            );

        res.json({

            entry:
                entry.length,

            zone_visit:
                zone.length,

            billing:
                billing.length,

            purchase:
                purchase.length,

            conversion:
                entry.length === 0
                ? 0
                : (
                    purchase.length /
                    entry.length *
                    100
                ).toFixed(2)
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;