const express = require("express");
const router = express.Router();

const Event = require("../models/Event");

router.get("/:storeId/heatmap", async (req, res) => {

    try {

        const data =
            await Event.aggregate([
                {
                    $match: {
                        store_id:
                        req.params.storeId
                    }
                },

                {
                    $group: {
                        _id: "$zone_id",

                        visits: {
                            $sum: 1
                        },

                        avg_dwell: {
                            $avg:
                            "$dwell_ms"
                        }
                    }
                }
            ]);

        res.json({
            store:
                req.params.storeId,
            heatmap: data
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;