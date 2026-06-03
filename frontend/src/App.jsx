import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const [showDashboard, setShowDashboard] = useState(false);

  const [health, setHealth] = useState({});
  const [funnel, setFunnel] = useState({});
  const [anomalies, setAnomalies] = useState([]);

  const loadDashboard = async () => {
    try {
      const healthRes = await axios.get(
        "http://localhost:3000/health"
      );

      const funnelRes = await axios.get(
        "http://localhost:3000/stores/STORE_BLR_002/funnel"
      );

      const anomalyRes = await axios.get(
        "http://localhost:3000/stores/STORE_BLR_002/anomalies"
      );

      setHealth(healthRes.data);
      setFunnel(funnelRes.data);
      setAnomalies(
        anomalyRes.data.anomalies || []
      );

      setShowDashboard(true);

    } catch (err) {
      console.log(err);
    }
  };

  const uploadVideo = async () => {
    if (!video) {
      alert("Please select a video");
      return;
    }

    try {
      setProcessing(true);
      setMessage("");

      const formData = new FormData();
      formData.append("video", video);

      const response = await axios.post(
        "http://localhost:3000/upload-video",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
          timeout: 0,
        }
      );

      setMessage(
        response.data.message ||
        "Video processed successfully"
      );

      await loadDashboard();

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.error ||
        "Upload failed"
      );

    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container">

      <div className="header">
        <h1>
          🏪 Store Intelligence Dashboard
        </h1>

        <p>
          Video Analytics using YOLOv8
        </p>
      </div>

      <div className="card">

        <h2>
          📹 Upload CCTV Video
        </h2>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => {

            const file =
              e.target.files[0];

            if (!file) return;

            setVideo(file);

            setPreview(
              URL.createObjectURL(file)
            );
          }}
        />

        <button
          onClick={uploadVideo}
          disabled={processing}
        >
          {
            processing
            ? "Processing Video..."
            : "Upload & Process"
          }
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

      </div>

      {preview && (
        <div className="card">

          <h2>
            🎥 Video Preview
          </h2>

          <video
            controls
            src={preview}
            className="video"
          />

        </div>
      )}

      {showDashboard && (

        <div className="card">

          <h2>
            📊 Analytics Dashboard
          </h2>

          <div className="dashboard-grid">

            <div className="metric-box">
              <h3>Total Events</h3>
              <h1>
                {health.total_events || 0}
              </h1>
            </div>

            <div className="metric-box">
              <h3>Entries</h3>
              <h1>
                {funnel.entry || 0}
              </h1>
            </div>

            <div className="metric-box">
              <h3>Zone Visits</h3>
              <h1>
                {funnel.zone_visit || 0}
              </h1>
            </div>

            <div className="metric-box">
              <h3>Purchases</h3>
              <h1>
                {funnel.purchase || 0}
              </h1>
            </div>

          </div>

          <div className="card">

            <h2>
              Funnel Analytics
            </h2>

            <p>
              Entry:
              {funnel.entry || 0}
            </p>

            <p>
              Zone Visit:
              {funnel.zone_visit || 0}
            </p>

            <p>
              Billing:
              {funnel.billing || 0}
            </p>

            <p>
              Purchase:
              {funnel.purchase || 0}
            </p>

            <p>
              Conversion:
              {funnel.conversion || 0}%
            </p>

          </div>

          <div className="card">

            <h2>
              Active Anomalies
            </h2>

            {
              anomalies.length === 0
              ? (
                <p>
                  No anomalies detected
                </p>
              )
              : (
                anomalies.map(
                  (item,index) => (
                    <div
                      key={index}
                      className="message"
                    >
                      <strong>
                        {item.type}
                      </strong>

                      <br />

                      {
                        item.suggested_action
                      }
                    </div>
                  )
                )
              )
            }

          </div>

        </div>

      )}

      {processing && (

        <div className="overlay">

          <div className="spinner"></div>

          <h2>
            Processing Video...
          </h2>

          <p>
            Running YOLO Detection
          </p>

        </div>

      )}

    </div>
  );
}

export default App;