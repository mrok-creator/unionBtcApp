# BTC Currency App

This is a monorepo application for handling BTC currency-related functionalities. It consists of two main applications: `service-app` and `worker-app`.

# Service Application Logic

## Features
- **Email Subscription:**
    - Manages email subscriptions, allowing users to subscribe and unsubscribe.
    - Utilizes a Prisma database to store email data.
- **Metrics Handling:**
    - Tracks various metrics such as subscribed and unsubscribed emails, sent emails, email errors, and exchange rates.
    - Utilizes Prometheus for metric collection.
    - Exposes an endpoint for Prometheus to scrape metrics.
- **Metrics Service:**
    - Handles Prometheus metrics counters and gauges.
    - Sends metrics to Prometheus for monitoring.

## Code Structure
The service application is organized into modules, including `SubscriptionService` and `MetricsService`.
Each module encapsulates related functionalities.

# Worker Application Logic

## Features
- **Metric Scraping:**
    - The worker application is responsible for scraping metrics data from Prometheus.
    - Uses a worker controller to handle incoming requests and invoke the worker service.
- **Metric Storage:**
    - Metrics scraped from Prometheus are stored in a database table (e.g., Prisma Metrics model).

## Code Structure
The worker application is organized into a controller and a service.
The controller handles incoming HTTP requests, while the service performs metric scraping and storage.

## For starting app:
1. Build docker images with generating db client call
    ```bash
    npm run build:docker
2. Start an app with 
    ```bash
    npm run start:app
3. To stop app
   ```bash
   npm run stop:app