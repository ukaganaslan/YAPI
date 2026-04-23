# HealthAI Platform

## 🚀 Overview

Full-stack web application designed for healthcare collaboration, enabling professionals to share projects, request meetings, and manage partnerships.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js (Express)
* **Database:** MongoDB
* **Containerization:** Docker (Docker Compose)

---

## 🐳 Run with Docker

```bash
docker compose up --build
```

---

## 🌐 Access

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

---

## 🔐 Features

* User authentication using JWT
* Role-based access control (Admin / User)
* Post creation and management
* Meeting request system
* Admin functionality (API-level access)

---

## 📂 Project Structure

```
backend/        # Express backend
src/            # React frontend
docker-compose.yml
Dockerfile
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```
PORT=5000
MONGO_URI=mongodb://mongo:27017/healthai
JWT_SECRET=your_secret_here
```

---

## 📌 Notes

* MongoDB runs inside Docker container (no local installation required)
* Admin panel is implemented at API level (no UI)
* Project is fully containerized for easy deployment

---
