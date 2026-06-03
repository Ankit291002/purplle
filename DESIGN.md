# Architecture

## Detection Layer

YOLOv8 detects people from CCTV footage.

## Event Layer

Detection results are transformed into structured events.

## Storage Layer

Events are stored in MongoDB.

## API Layer

Express APIs expose metrics and analytics.

## AI Assisted Decisions

ChatGPT was used to evaluate architecture alternatives and generate boilerplate code. All generated code was reviewed and modified manually.