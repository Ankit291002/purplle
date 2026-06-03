const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/events");
const metricRoutes = require("./routes/metrics");

const app = express();

app.use(cors());

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/events", eventRoutes);
app.use("/stores", metricRoutes);

const Event = require("./models/Event");

app.get("/health", async (req, res) => {

    try {

        const totalEvents =
            await Event.countDocuments();

        res.status(200).json({
            status: "healthy",
            database: "connected",
            total_events: totalEvents,
            timestamp: new Date()
        });

    } catch (err) {

        res.status(500).json({
            status: "unhealthy",
            error: err.message
        });

    }

});
const funnelRoutes =
require("./routes/funnel");
 

app.use("/stores",
funnelRoutes);

const anomalyRoutes =
require("./routes/anomalies");

app.use("/stores",
anomalyRoutes);

const logger =
require("./middleware/logger");

app.use(logger);

const uploadRoutes =
require("./routes/upload");

app.use("/", uploadRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});