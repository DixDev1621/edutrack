# 🎓 EduTrack — Modern Student Management System

A full-stack, responsive web application for managing student admissions, academic records, and profiles. Built with **React + Vite** on the frontend, **Node.js + Express** on the backend, and **SQLite** for zero-configuration local database storage.

Prepared and pre-configured for free-tier cloud deployment:
- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com)

---

## ✨ Features

### 🖥️ Frontend (React + Vite)
- **Modern Dashboard UI:** Live statistics for total, active, inactive, and graduated students, plus average GPA and department counts.
- **Student Registration & Editing:** Form with real-time validation, required field checks, email format verification, and GPA range checks.
- **Search & Filter:** Instant search by name, roll number, or email. Filter by department or enrollment status.
- **Multi-Field Sorting:** Sort students by newest, name (A–Z), roll number, or GPA.
- **Dual View Modes:** Toggle between a rich **Table View** and responsive **Card Grid View**.
- **Student Profile Modal:** View complete student profiles including admission date, date of birth, contact info, and timestamps.
- **Delete Confirmation:** Modal dialog to prevent accidental deletion.
- **Live Health Indicator:** Real-time ping to the backend `/api/health` endpoint with status pill indicator.
- **Sample Data Reset:** One-click button to populate or restore pre-configured student sample records.
- **Toast Notifications:** Feedback on student creation, update, and deletion actions.

### ⚙️ Backend (Node.js + Express + SQLite)
- **RESTful Endpoints:** Full CRUD operations for student entities.
- **SQLite Database:** Automatically creates database file and schema on startup (`backend/database/students.db`).
- **Data Integrity & Validation:** Unique constraints for Roll Number and Email, custom input validation middleware, and HTTP status codes (200, 201, 400, 404, 409, 500).
- **Health Check Endpoint:** `/api/health` reports server uptime, database connection state, record counts, and memory usage.
- **CORS Configured:** Handles local Vite dev proxy and cross-origin requests from deployed Vercel apps.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, HTML5, CSS3, JavaScript (ES6+), Lucide Icons |
| **Backend** | Node.js, Express 5, CORS, Morgan, Dotenv |
| **Database** | SQLite3 (`sqlite` & `sqlite3` driver) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```text
Demo-project/
├── backend/
│   ├── database/                 # SQLite storage (auto-generated)
│   │   └── students.db
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # SQLite init, schema & demo seeder
│   │   ├── controllers/
│   │   │   └── studentController.js # CRUD, stats, seed controller logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js   # Global error & 404 handlers
│   │   │   └── validator.js      # Input validation & normalization
│   │   ├── routes/
│   │   │   ├── healthRoutes.js   # /api/health endpoint
│   │   │   └── studentRoutes.js  # /api/students endpoints
│   │   └── app.js                # Express app setup & CORS configuration
│   ├── server.js                 # Server entry point
│   ├── .env.example              # Sample environment variables
│   ├── render.yaml               # Render free-tier deployment blueprint
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Cap icon favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchFilterBar.jsx
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── StudentCard.jsx
│   │   │   ├── StudentDetailModal.jsx
│   │   │   ├── StudentModal.jsx   # Create & Edit modal
│   │   │   ├── StudentTable.jsx
│   │   │   └── Toast.jsx
│   │   ├── services/
│   │   │   └── api.js            # Fetch service communicating with backend
│   │   ├── styles/
│   │   │   └── index.css         # Modern design system & styles
│   │   ├── utils/
│   │   │   └── helpers.js        # Formatting & avatar helpers
│   │   ├── App.jsx               # Main React dashboard component
│   │   └── main.jsx              # React DOM mounting
│   ├── index.html
│   ├── vite.config.js            # Vite configuration with API proxy
│   ├── vercel.json               # Vercel SPA routing rewrites
│   ├── .env.example
│   └── package.json
│
├── package.json                  # Root runner scripts
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Option 1: Quick Start (Two Separate Terminals)

#### 1. Start the Backend Server
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```
The backend will be running at: **`http://localhost:5000`**  
Verify health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

#### 2. Start the Frontend Application
Open a new terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

### Option 2: Root Helper Commands
From the project root folder (`Demo-project`):
```bash
# 1. Install all dependencies across backend and frontend
npm run install:all

# 2. In Terminal 1 - start backend
npm run dev:backend

# 3. In Terminal 2 - start frontend
npm run dev:frontend
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & SQLite metrics | None |
| `GET` | `/api/students/stats` | Dashboard statistics & department counts | None |
| `GET` | `/api/students` | Get list of all students | `search`, `department`, `status`, `sortBy`, `order` |
| `GET` | `/api/students/:id` | Get single student by ID | None |
| `POST` | `/api/students` | Register a new student | JSON payload (see below) |
| `PUT` | `/api/students/:id` | Update an existing student | JSON payload (see below) |
| `DELETE` | `/api/students/:id` | Remove a student record | None |
| `POST` | `/api/students/seed` | Reset & reseed default sample students | None |

### Sample JSON Payload (Create / Update Student)
```json
{
  "name": "Alexander Hayes",
  "rollNumber": "CS2026-101",
  "email": "alex.hayes@university.edu",
  "phone": "+1 (555) 234-5678",
  "department": "Computer Science",
  "semester": "Semester 2",
  "gpa": 3.85,
  "gender": "Male",
  "dateOfBirth": "2004-06-15",
  "admissionDate": "2024-08-20",
  "status": "Active",
  "address": "42 Campus Vista, Innovation City"
}
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```
- `PORT`: Port the Express server listens on (default: `5000`). Render automatically provides its own `PORT`.
- `CLIENT_ORIGIN`: Allowed origins for CORS. Set to `*` or your Vercel URL in production (e.g., `https://your-frontend.vercel.app`).

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
- For local development with Vite proxy, you can leave this as `http://localhost:5000/api`.
- When deploying to Vercel, set `VITE_API_URL` to your live Render backend URL:
  `https://your-backend-name.onrender.com/api`

---

## 🐙 Push Project to GitHub

Follow these steps to upload your repository to GitHub:

```bash
# 1. Initialize git repository in the project root
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: complete full-stack student management system"

# 4. Rename default branch to main
git branch -M main

# 5. Add your remote GitHub repository URL (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🌐 Free-Tier Cloud Deployment Guide

### Part 1: Deploy Backend to Render (Free Web Service)

> [!IMPORTANT]
> **GLIBC / Native Addon Fix:** Render runs a Debian/Ubuntu container where prebuilt native binaries might conflict with system GLIBC versions (e.g. `GLIBC_2.38 not found` error under experimental Node 26). Pinning **Node 22.x** and building SQLite3 from source with `npm rebuild sqlite3 --build-from-source` compiles the native addon against Render's system GLIBC, ensuring 100% stability.

1. Create a free account at [Render](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the deployment details:
   - **Name:** `student-management-backend` (or your choice)
   - **Region:** Closest to your users (e.g., Oregon, Frankfurt)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm rebuild sqlite3 --build-from-source`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `NODE_VERSION` = `22.x` *(Ensures stable Node.js 22 LTS is used)*
   - `NODE_ENV` = `production`
   - `PORT` = `10000` *(Or leave Render to supply PORT automatically; backend binds to `0.0.0.0`)*
   - `CLIENT_ORIGIN` = `*` (or your Vercel domain once deployed)
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL:
   `https://student-management-backend.onrender.com`
8. Verify it works by opening in browser:
   `https://student-management-backend.onrender.com/api/health`

---

### Part 2: Deploy Frontend to Vercel (Free Hobby Tier)

1. Create a free account at [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Expand the **Environment Variables** section and add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://student-management-backend.onrender.com/api` *(Your Render backend URL with `/api` suffix)*
6. Click **Deploy**.
7. In ~30 seconds, Vercel will provide your live URL:
   `https://your-project-name.vercel.app`

---

## 🧪 Testing and Verification Checklist

- [x] Backend responds on `GET /api/health` with `status: "ok"`
- [x] Frontend successfully loads students table and stats cards
- [x] Register a student via the modal form and confirm record is created
- [x] Instant search filters by student name and roll number
- [x] Edit student information and verify changes reflect in UI
- [x] Delete confirmation modal correctly removes a student
- [x] Toggle between **Table View** and **Cards Grid View**
- [x] Responsive layout tested on desktop and mobile screens
- [x] Production build passes (`npm run build`) without errors

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
