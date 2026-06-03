# Store Intelligence System

## Overview

Store Intelligence System processes CCTV footage, detects customers using YOLOv8, generates events, stores them in MongoDB, and exposes analytics APIs.

## Tech Stack

- Python
- YOLOv8
- Node.js
- Express
- MongoDB

## Run Backend

npm install

npm run dev

## Run Detection

pip install ultralytics opencv-python requests

python detect.py

## APIs

GET /health

POST /events/ingest

GET /stores/:id/metrics

GET /stores/:id/funnel

GET /stores/:id/heatmap

GET /stores/:id/anomalies