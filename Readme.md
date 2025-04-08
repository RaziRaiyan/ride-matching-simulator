# 🚗 Ride Matching Simulator with Redis Pub/Sub

This project demonstrates how a ride-matching application scales from a traditional solution to an event-driven architecture using Redis Pub/Sub.

---

## 🧩 Problem Evolution

### **1. Traditional Approach (Small Scale)**

Initially, we solved the ride-matching problem using synchronous REST APIs and simple database queries, suitable for:

-   A very small startup scenario
-   2-3 drivers and 5-10 riders

**Workflow:**

-   Rider requests rides via direct API calls.
-   Matching is done using direct database queries.
-   Real-time communication handled through synchronous APIs.

### **2. Moving to Event-Driven (Moderate Scale)**

When scaling up to ~1000 drivers and ~10,000 riders, the traditional approach showed clear limitations in scalability, reliability, and latency. To solve this, we transitioned to an event-driven model using Redis Pub/Sub.

**Event-driven Workflow:**

-   Rider and driver apps publish events (`ride-request`, `location-update`) to Redis.
-   Matching and Notification services subscribe to these events, allowing asynchronous and decoupled communication.

---

## 🚀 How to Run the Simulation

**Prerequisites:**

-   Node.js (v16+)
-   Yarn or NPM
-   Redis (Docker recommended)

**Setup Redis (Docker):**

```bash
docker run -d -p 6379:6379 redis
```

**Install Dependencies:**

```bash
npm install
```

### Method 1: Run All Services Concurrently

Run this command to launch all services simultaneously:

```bash
npm run start
```

This command runs:

-   Rider Simulator
-   Driver Simulator
-   Ride Matching Service
-   Notification Service

### Method 2: Run Services Separately (for debugging)

Run each service individually in separate terminals:

-   Rider Simulator:

```bash
npm run start-rider-app
```

-   Driver Simulator:

```bash
npm run start-driver-app
```

-   Ride Matching Service:

```bash
npm run start-ride-matching-service
```

-   Notification Service:

```bash
npm run start-notification-service
```

---

## ⚠️ Limitations of Current Redis Pub/Sub Solution

-   **No Durability:** Events published without active subscribers are lost.
-   **No Ordering Guarantees:** Messages might not arrive in the order they're published.
-   **No Message Replay:** Once messages are published, they can't be replayed.
-   **Scaling Bottlenecks:** Redis becomes a single point of failure and performance bottleneck as traffic increases.

Example scenario:

-   If rider simulation starts before the matching service, ride requests will be permanently lost.

---

## 🛠️ Tools to Address Limitations

To resolve these limitations, a more robust and reliable message broker like **Apache Kafka** can be employed. Kafka provides:

-   **Message Durability:** Ensures events aren't lost even if subscribers are temporarily offline.
-   **Ordering Guarantees:** Guarantees messages are consumed in the order they were produced.
-   **Event Replay:** Supports replaying past events, crucial for fault-tolerance and debugging.
-   **Horizontal Scalability:** Easily scales horizontally to handle higher volumes of events and consumers.

---

## 📂 Project Structure

```
|-- driver-app
|    |-- app.js
|    |-- simulator.js
|-- notification-service
|    |-- server.js
|-- ride-matching-service
|    |-- server.js
|-- rider-app
|    |-- app.js
|    |-- simulator.js
|-- package.json
```

---

**Happy Coding! 🚀**
