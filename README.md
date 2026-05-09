# HealthAI Platform 🚀

HealthAI is a full-stack web application designed to bridge the gap between healthcare professionals and engineers. It provides a specialized environment for sharing medical research ideas, requesting collaborations, and managing health-tech partnerships securely.

---

## 🌟 Key Features

* **Authentication & Authorization**: Secure JWT-based login system with role-based access (Healthcare Professional, Engineer, Admin).
* **Project Management**: Users can post research ideas, specifying required expertise, project stage, and commitment level.
* **Smart Location Selection**: Built-in country and city dropdown mapping to ensure standardized location data.
* **Meeting & Application System**: Users can apply to projects via "Meeting Requests", proposing time slots and accepting NDAs.
* **Real-time Notifications**: In-app notification bell that alerts project owners of new meeting requests instantly.
* **Private Messaging**: Secure, project-scoped chat system. Only the project owner and accepted applicants can message each other.
* **Admin Dashboard**: Comprehensive UI for administrators to monitor system statistics, suspend users, delete inappropriate posts, and export audit logs.
* **Modern UI/UX**: Fully responsive, beautiful interface featuring glassmorphism, dynamic gradients, and smooth micro-animations.

---

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite), React Router, TailwindCSS + Custom CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Infrastructure:** Docker & Docker Compose

---

## 🐳 Running Locally (Docker)

The easiest way to run the project is using Docker. You don't need to install Node.js or MongoDB locally.

1. Clone the repository
2. Ensure Docker Desktop is running.
3. Start the application:
```bash
docker-compose up -d --build
```

---

## 🌐 Accessing the Application

Once the Docker containers are running, you can access the services here:

* **Frontend (Web App):** http://localhost:5173
* **Backend API:** http://localhost:5000

### 👑 Admin Credentials
If you need to access the Admin Panel, you can use the pre-generated admin account:
* **Email:** admin@healthai.com
* **Password:** admin123

---

## ⚙️ Environment Configuration

If you wish to run the app outside of Docker, ensure you create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthai
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: When running via Docker, these are automatically handled by `docker-compose.yml`)*

---

## 📂 Project Structure

```text
├── backend/            # Express.js REST API
│   ├── middleware/     # Auth, rate limiting, logging
│   ├── models/         # Mongoose schemas (User, Post, Message, Log)
│   ├── routes/         # API endpoints
│   ├── scripts/        # Database seeding scripts (Admin creation)
│   └── server.js       # Backend entry point
├── src/                # React.js Frontend
│   ├── components/     # Reusable UI components (Navbar, etc.)
│   ├── pages/          # Full page views (Dashboard, Messages, Admin, etc.)
│   ├── utils/          # API helpers and location data
│   └── App.jsx         # Main React router
├── docker-compose.yml  # Docker orchestration
└── Dockerfile          # Frontend Dockerfile
```
