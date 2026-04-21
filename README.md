#  Rate-Limited API Service (NestJS + Redis)

##  Overview

This project implements a **rate-limited API service** using **NestJS** and **Redis**.
It ensures that each user can make a maximum of **5 requests per minute**, even under concurrent traffic.

---

##  Features

*  Rate-limited endpoint (`POST /user/request`)
*  Per-user request tracking
*  Redis-based atomic operations (handles concurrency)
*  Real-time stats (`GET /user/stats`)
*  Swagger API documentation
*  Retry mechanism (`retry_after`)
*  Scalable design using Redis

---

##  Tech Stack

* Backend: NestJS
* Cache/Rate Limiting: Redis (ioredis)
* API Docs: Swagger

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rate-limited-api.git
cd rate-limited-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Redis (locally)

```bash
docker run -p 6379:6379 redis
```

### 4. Run the application

```bash
npm run start:dev
```

### 5. Open Swagger

```bash
http://localhost:3000/api
```

---

##  API Endpoints

### 🔹 POST `/user/request`

**Description:** Send a request with rate limiting (max 5/min per user)

#### Request Body

```json
{
  "user_id": "user-123",
  "payload": { "message": "hello" }
}
```

#### Success Response

```json
{
  "success": true,
  "remaining": 3,
  "data": { "message": "hello" }
}
```

#### Rate Limit Exceeded

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "retry_after": 42
}
```

---

### 🔹 GET `/user/stats`

**Description:** Returns per-user request statistics

#### Response

```json
{
  "user-123": {
    "requests_last_minute": 3,
    "window_expires_in_seconds": 40
  }
}
```

---

##  Design Decisions

### 🔹 Rate Limiting Strategy

* Used **Redis `INCR` + `EXPIRE`**
* Ensures:

  * Atomic operations
  * Correct behavior under concurrent requests

### 🔹 Concurrency Handling

* Redis `INCR` is atomic → prevents race conditions
* TTL is applied on each request → ensures consistency

### 🔹 Stats Tracking

* Active users tracked using Redis Set (`rate_limit_users`)
* Inactive users cleaned automatically

---

##  Future Improvements

### 🔹 1. Database Integration (Supabase)

* Store user request history in **Supabase**
* Enable:

  * Analytics
  * Historical tracking
  * Audit logs

---

### 🔹 2. CI/CD Pipeline

* Automate build, test, and deployment
* Tools:

  * GitHub Actions
  * Docker pipelines
* Ensure faster and safer releases

---

### 🔹 3. Queue-Based Request Handling

* Use queue system (e.g., BullMQ)
* Instead of rejecting:

  * Queue excessive requests
  * Process them later
* Improves user experience under heavy load

---

### 🔹 4. Token-Based Rate Limiting

* Introduce API tokens per user
* Add **TTL for tokens**
* Prevent:

  * Unauthorized access
  * Unnecessary/spam requests

---

### 🔹 5. Advanced Rate Limiting (Sliding Window)

* Replace fixed window with:

  * Redis ZSET (sliding window)
* Benefits:

  * More accurate control
  * Prevent burst traffic issues

---

### 🔹 6. Request Flow Optimization

* Add middleware/guards for rate limiting
* Role-based limits (Admin vs User)
* Dynamic limits based on subscription plans
* Distributed rate limiting across microservices

---

##  Testing

You can test APIs via:

* Swagger UI
* Postman
* Curl

---

##  Project Structure

```
src/
  user/
    user.controller.ts
    user.service.ts
  redis/
    redis.service.ts
main.ts
```

---

##  Conclusion

This project demonstrates:

* Scalable rate limiting using Redis
* Handling concurrent requests safely
* Clean backend architecture with NestJS

---

##  Author

Developed as part of backend assignment By Priyanshu sharma
Focused on scalability, concurrency, and production readiness
