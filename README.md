# SevaSangam — Cooperative Gig Services Platform

A full-stack web platform organizing household & community gig services (plumbing, electrical, cleaning, carpentry, painting, appliance repair) under a democratic **cooperative model** — guaranteeing **fair wages for skilled artisans (90% take-home pay)**, transparent commission structures, and quality service for households.

---

## 🌟 Key Features

### 1. 🤝 90/10 Cooperative Wage Model
- Caps administrative platform dues at 10%, ensuring workers retain **90% of every rupee earned**.
- Live transparent wage breakdown shown on every booking receipt and worker ledger.

### 2. 👥 Three Tailored Roles & Portals
- **Customer Portal**: Search & filter trade services, select verified artisans, schedule time slots, track real-time job status, and submit star reviews.
- **Worker Portal**: Manage profile & trade skills, toggle on/off-duty availability, accept/decline incoming leads, update job progress (`Accepted` $\rightarrow$ `In-Progress` $\rightarrow$ `Completed`), and view take-home earnings.
- **Cooperative Admin Portal**: Real-time platform gross merchandise value (GMV), net worker payouts, community commission pool, dynamic commission percentage slider/editor, and master audit ledger.

### 3. 🚀 Zero-Configuration Startup
- Automatically runs with embedded in-memory MongoDB (`mongodb-memory-server`) if no remote URI is configured, while fully supporting production MongoDB Atlas connection strings via `.env`.
- Auto-seeds realistic initial data (admin, skilled workers across trades, customers, sample services, and historical reviews) upon first run.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), BCrypt.js
- **Database**: MongoDB / Embedded Mongoose

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)

### 1. Install All Dependencies
From the repository root:
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Start the Backend API (Port 5000)
```bash
cd server
npm start
```
*Backend runs on `http://localhost:5000` with auto-seeded demo data.*

### 3. Start the Frontend App (Port 5173)
```bash
cd client
npm run dev
```
*Frontend opens at `http://localhost:5173`.*

---

## 🔑 Preconfigured Demo Accounts

Use these one-click credentials on the **Sign In** page for instant evaluation:

| Role | Email | Password | Details |
|------|-------|----------|---------|
| 👑 **Co-op Admin** | `admin@sevasangam.org` | `password123` | Platform Governance & Earnings Dashboard |
| 🔧 **Worker (Plumber)** | `ramesh.plumber@example.com` | `password123` | Ramesh Kumar (8 yrs exp, 4.9 ★) |
| ⚡ **Worker (Electrician)** | `priya.electrician@example.com` | `password123` | Priya Sharma (6 yrs exp, 4.9 ★) |
| 👤 **Customer** | `rahul@example.com` | `password123` | Rahul Sharma (Indore) |

---

## 🧪 Running Automated E2E Tests
To run the automated 11-step integration test suite:
```bash
cd server
node test_e2e.js
```
