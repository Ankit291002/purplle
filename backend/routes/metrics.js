const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/:storeId/metrics", async (req, res) => {
  try {
    const { storeId } = req.params;

    // Unique visitors
    const visitors = await Event.distinct("visitor_id", {
      store_id: storeId,
      is_staff: false,
    });

    // Purchases
    const purchases = await Event.distinct("visitor_id", {
      store_id: storeId,
      event_type: "PURCHASE",
    });

    // Dwell events
    const dwellEvents = await Event.find({
      store_id: storeId,
      dwell_ms: { $gt: 0 },
    });

    let avgDwell = 0;

    if (dwellEvents.length > 0) {
      const totalDwell = dwellEvents.reduce(
        (sum, event) => sum + (event.dwell_ms || 0),
        0
      );

      avgDwell = Math.round(totalDwell / dwellEvents.length);
    }

    // Queue Events
    const queueDepth = await Event.countDocuments({
      store_id: storeId,
      event_type: "BILLING_QUEUE_JOIN",
    });

    // Abandonment
    const abandoned = await Event.countDocuments({
      store_id: storeId,
      event_type: "BILLING_QUEUE_ABANDON",
    });

    const abandonmentRate =
      queueDepth === 0
        ? 0
        : ((abandoned / queueDepth) * 100).toFixed(2);

    // Conversion
    const conversionRate =
      visitors.length === 0
        ? 0
        : ((purchases.length / visitors.length) * 100).toFixed(2);

    // Zone Wise Analytics
    const zoneStats = await Event.aggregate([
      {
        $match: {
          store_id: storeId,
          zone_id: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$zone_id",
          visits: { $sum: 1 },
          avg_dwell: { $avg: "$dwell_ms" },
        },
      },
    ]);

    res.status(200).json({
      store_id: storeId,

      metrics: {
        unique_visitors: visitors.length,

        purchases: purchases.length,

        conversion_rate: Number(conversionRate),

        avg_dwell_time_ms: avgDwell,

        current_queue_depth: queueDepth,

        abandonment_rate: Number(abandonmentRate),
      },

      zones: zoneStats,

      generated_at: new Date(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;