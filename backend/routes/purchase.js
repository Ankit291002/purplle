const express = require("express");
const router = express.Router();

const Event = require("../models/Event");

router.post("/purchase", async (req, res) => {

    try {

        const {
            store_id,
            visitor_id,
            amount
        } = req.body;

        const purchaseEvent =
            await Event.create({

                event_id:
                    Date.now().toString(),

                store_id,

                visitor_id,

                event_type:
                    "PURCHASE",

                timestamp:
                    new Date(),

                confidence: 1,

                metadata: {
                    amount
                }
            });

        res.status(201).json(
            purchaseEvent
        );

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;