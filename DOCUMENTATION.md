# MediCare - Full Documentation & Interview Guide

MediCare is a comprehensive **Doctor Appointment Booking Platform** that connects patients with specialized doctors. It features a triple-entry system: a **Patient Portal**, an **Admin Panel**, and a **Doctor Portal**.

---

## 🚀 1. Technology Stack (The "How it was built")

- **Frontend**: React.js (Vite)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt for password hashing
- **Image Storage**: Cloudinary
- **Payment Gateways**: Razorpay & Stripe
- **Notifications**: React-Toastify
- **AI Integration**: Chatbot for patient assistance

---

## 🛠️ 2. Core Modules & Features

### A. Patient Frontend

1.  **Home Page**: Professional hero section, specialized categories (General Physician, Gynecologist, etc.), and top doctors list.
2.  **Doctor Search**: Filter doctors by specialty.
3.  **Booking System**: Select available time slots for specific doctors.
4.  **User Profile**: Upload profile pictures (held on Cloudinary) and manage personal details.
5.  **My Appointments**: Track booking history, cancel appointments, and process payments using Stripe or Razorpay.
6.  **AI Chatbot**: Instant support for user queries.

### B. Admin Panel

1.  **Add/Manage Doctors**: Admins can register new doctors with details like degree, experience, and fees.
2.  **Dashboard**: High-level view of total doctors, appointments, and recent bookings.
3.  **Appointment Management**: View and monitor all platform-wide bookings.

### C. Doctor Panel

1.  **Doctor Dashboard**: View total earnings, appointment count, and latest patients.
2.  **Appointment Management**: Doctors can mark appointments as "Completed" or cancel them.
3.  **Profile Management**: Update professional bio, fees, and availability.

---

## 📂 3. Project Structure (Simplified)

```text
MediCare/
├── backend/            # Express Server
│   ├── models/         # Database Schemas (User, Doctor, Appointment)
│   ├── routes/         # API Endpoints (Admin, User, Doctor)
│   ├── controllers/    # Business Logic for each route
│   └── middleware/     # Auth & Error handling
├── frontend/           # Patient React App
│   ├── src/components/ # Reusable UI pieces (Navbar, Footer)
│   ├── src/pages/      # Major screens (Home, Appointments, Login)
│   └── src/context/    # Global State management
└── admin/              # Admin & Doctor React App
```

---

## 📊 4. Database Schema Overview

- **User**: `name, email, password, image, address, gender, dob, phone`
- **Doctor**: `name, email, password, image, speciality, degree, experience, about, fees, address, slots_booked`
- **Appointment**: `userId, docId, slotDate, slotTime, userData, docData, amount, date, cancelled, payment, isCompleted`

---

## 💡 5. Interview Preparation (Important Questions)

### Q1: Why did you choose the MERN stack for this project?

**Answer**: MERN (MongoDB, Express, React, Node) allows for a unified JavaScript ecosystem. It provides high scalability (MongoDB's NoSQL nature), a fast development cycle, and a highly responsive UI (React).

### Q2: How did you handle Authentication and Security?

**Answer**: I used **JWT (JSON Web Tokens)** for stateless authentication. Passwords are never stored for security; instead, I use **Bcrypt** to hash them before saving to MongoDB. Specific routes (like Admin/Doctor dashboards) are protected by **Middleware** that verifies the token's validity and role permissions.

### Q3: Explain how the Appointment Booking logic works.

**Answer**: When a user selects a slot:

1. The backend checks the `slots_booked` object in the Doctor's document.
2. If the slot is free, an appointment is created, and the slot is marked as "booked" in the database.
3. This prevents double-booking.

### Q4: How do you handle images in this project?

**Answer**: Storing images directly in a database makes it slow. I used **Multer** (middleware) to handle file uploads and sent them to **Cloudinary**. Cloudinary provides a URL, which I then store in MongoDB. This ensures fast loading and efficient storage.

### Q5: What was the most challenging part of this project?

**Answer**: Mention the **Real-time slot management** or **Payment Integration**.
_Example_: "Integrating two payment gateways (Stripe/Razorpay) while ensuring the appointment status updates correctly in the database was challenging but taught me a lot about webhook and API consistency."

### Q6: How did you manage global state in React?

**Answer**: I used the **Context API**. It allowed me to share data like the `token`, `userData`, and `currencySymbol` across different components without 'prop-drilling'.

---

## 🚀 6. How to Run Locally

### 1. Clone the repository

`git clone [your-repo-link]`

### 2. Backend Setup

1. `cd backend`
2. `npm install`
3. Create a `.env` file with: `MONGODB_URI`, `CLOUDINARY_NAME`, `JWT_SECRET`, etc.
4. `npm run server`

### 3. Frontend / Admin Setup

1. `cd frontend` (or `cd admin`)
2. `npm install`
3. Create a `.env` file with: `VITE_BACKEND_URL`
4. `npm run dev`

---

## ☁️ 7. Deployment Strategy

- **Backend**: Hosted on **Render** (Node.js service).
- **Frontend & Admin**: Hosted on **Vercel**.
- **Database**: **MongoDB Atlas**.
