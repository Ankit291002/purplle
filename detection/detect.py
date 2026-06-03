from ultralytics import YOLO
import cv2
import uuid
import requests
from datetime import datetime, timezone
import sys


API_URL = "http://localhost:3000/events/ingest"

# Load YOLO model
model = YOLO("yolov8n.pt")


video_path = sys.argv[1] if len(sys.argv) > 1 else "store.mp4"

print("Processing:", video_path)

cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Cannot open video")
    exit()

events_batch = []

frame_count = 0

print("Processing video...")

while True:

    ret, frame = cap.read()

    if not ret:
        break

    frame_count += 1

    # Process every 30th frame
    if frame_count % 30 != 0:
        continue

    results = model(frame, verbose=False)

    person_count = 0

    for result in results:

        for box in result.boxes:

            cls = int(box.cls[0])

            # Person class
            if cls == 0:

                person_count += 1

                confidence = float(box.conf[0])

                event = {
                    "event_id": str(uuid.uuid4()),
                    "store_id": "STORE_BLR_002",
                    "camera_id": "CAM_ENTRY_01",

                    # Temporary visitor id
                    "visitor_id": f"VIS_{frame_count}_{person_count}",

                    "event_type": "ENTRY",

                    "timestamp": datetime.now(
                        timezone.utc
                    ).isoformat(),

                    "zone_id": None,
                    "dwell_ms": 0,

                    "is_staff": False,

                    "confidence": confidence,

                    "metadata": {
                        "frame_number": frame_count
                    }
                }

                events_batch.append(event)

    print(
        f"Frame {frame_count} | Persons: {person_count}"
    )

cap.release()

print(
    f"\nTotal Events Generated: {len(events_batch)}"
)

# Send all events together
try:

    print("Sending events to API...")

    response = requests.post(
        API_URL,
        json=events_batch,
        timeout=30
    )

    print(
        "Response:",
        response.status_code
    )

    print(
        response.text
    )

except Exception as e:

    print("API Error:", e)

print("Finished")