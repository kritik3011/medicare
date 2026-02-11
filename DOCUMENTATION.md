# MediCare - Deep Technical Documentation & Interview Blueprint

MediCare is a state-of-the-art **Doctor Appointment Booking Ecosystem** built using the MERN stack. It provides a robust, scalable solution for healthcare providers to manage appointments and for patients to access medical services seamlessly.

---

## 🏛️ 1. System Architecture

The project follows a **Decoupled Architecture** with three primary interfaces interacting with a centralized Node.js/Express backend:

1.  **Patient Portal (Frontend)**: Real-time discovery, booking, and payment processing.
2.  **Admin Panel**: Global management of healthcare providers and platform analytics.
3.  **Doctor Portal**: individualized workspace for managing consultations and professional availability.
4.  **Backend Services**: RESTful API managing business logic, data persistence, and third-party integrations (Cloudinary, Stripe, Razorpay).

---

## �️ 2. Technology Deep-Dive

### Frontend (React.js)

- **Vite**: used for blazing-fast builds and Optimized HMR (Hot Module Replacement).
- **Tailwind CSS**: Utility-first CSS for a highly responsive and custom UI.
- **React Context API**: Centralized state management for authentication tokens and user/doctor/admin global states.
- **React-Router-Dom**: Client-side routing with protected route logic.

### Backend (Node.js & Express)

- **MVC Pattern**: Organized into Models, Views (API responses), and Controllers.
- **JWT Authentication**: Stateless session management via signed tokens.
- **Bcrypt**: industry-standard salted hashing for password protection.
- **Multer & Cloudinary**: handling multi-part form data and cloud-based image storage.

### Database (MongoDB)

- **NoSQL Flexibility**: Using MongoDB for high-performance read/write operations and schema flexibility.
- **Mongoose ODM**: Structured object modeling and validation.

---

## � 3. In-Depth API Specification

### A. User (Patient) Endpoints

| Method | Endpoint                       | Description                        | Auth Required |
| :----- | :----------------------------- | :--------------------------------- | :------------ |
| POST   | `/api/user/register`           | user account creation              | No            |
| POST   | `/api/user/login`              | User authentication                | No            |
| POST   | `/api/user/forgot-password`    | account recovery                   | No            |
| GET    | `/api/user/get-profile`        | Fetch authenticated user data      | Yes (User)    |
| POST   | `/api/user/update-profile`     | Multi-part form for profile update | Yes (User)    |
| POST   | `/api/user/book-appointment`   | Core booking logic                 | Yes (User)    |
| GET    | `/api/user/appointments`       | List user appointment history      | Yes (User)    |
| POST   | `/api/user/cancel-appointment` | Soft delete/cancellation           | Yes (User)    |
| POST   | `/api/user/payment-stripe`     | Create Stripe checkout session     | Yes (User)    |
| POST   | `/api/user/verifyStripe`       | confirm Stripe transaction         | Yes (User)    |

### B. Admin Endpoints

| Method | Endpoint                         | Description                        | Auth Required |
| :----- | :------------------------------- | :--------------------------------- | :------------ |
| POST   | `/api/admin/add-doctor`          | Register new MD with credentials   | Yes (Admin)   |
| GET    | `/api/admin/all-doctors`         | retrieve global doctor list        | Yes (Admin)   |
| GET    | `/api/admin/dashboard`           | aggregate data for dashboard cards | Yes (Admin)   |
| POST   | `/api/admin/change-availability` | Admin-level availability override  | Yes (Admin)   |

### C. Doctor Endpoints

| Method | Endpoint                           | Description                      | Auth Required |
| :----- | :--------------------------------- | :------------------------------- | :------------ |
| GET    | `/api/doctor/appointments`         | consult schedule for specific ID | Yes (Doctor)  |
| POST   | `/api/doctor/complete-appointment` | mark consult as finished         | Yes (Doctor)  |
| POST   | `/api/doctor/update-profile`       | Update fees, description, etc.   | Yes (Doctor)  |

---

## ⚙️ 4. Complex Logic Walkthrough

### 🕒 Slot Management Logic

The most critical part of the system is preventing double-bookings.

1.  Each doctor has a `slots_booked` object in their document.
2.  When a booking request arrives, the backend retrieves the `slots_booked` object.
3.  It checks if `slotDate` exists as a key. If yes, it checks if `slotTime` is in the array.
4.  **Transaction Safety**: If the slot is free, the time is pushed into the array, and the entire document is updated.
5.  On cancellation, the time is filtered out of the array to free up the slot.

### 💳 Dual Payment Integration

MediCare supports both **Stripe** (International) and **Razorpay** (Local).

- **Stripe Flow**: session creation → redirect to Stripe → callback to `/verify` → Backend database update.
- **Razorpay Flow**: Order creation → frontend SDK payment → callback to `/verify` → Signature verification → Database update.

---

## 📊 5. Advanced Database Schema

### Appointment Schema (`appointmentModel.js`)

```javascript
{
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
}
```

---

## 🧠 6. Interview "Pro" Questions & Strategy

### Q1: How did you handle CORS and security headers?

**Strategic Answer**: "I implemented the `cors` middleware in Express to whitelist specific origins (frontend and admin URLs). For security, I used environment variables for sensitive keys and ensured that sensitive fields like `password` are excluded from API responses using Mongoose's `.select('-password')`."

### Q2: How would you scale this to handle 100,000 bookings a day?

**Strategic Answer**: "Currently, the `slots_booked` is an object within the Doctor document. For massive scale, I would move slots into a separate collection to avoid hitting MongoDB's 16MB document size limit. I'd also implement **Redis Caching** for doctor availability to reduce database load."

### Q3: Why use Context API instead of Redux?

**Strategic Answer**: "For this specific project, the state requirements (Auth tokens, basic profile data) were manageable without the boilerplate of Redux. Context API integrated with `useReducer` or `useState` provided a clean, 'React-way' to handle global state without external library overhead."

### Q4: Explain the Middleware pattern in your app.

**Strategic Answer**: "Middleware is used for 'Cross-Cutting Concerns'. I created `authAdmin`, `authUser`, and `authDoctor` middlewares. These intercept the request, extract the JWT from headers, verify it against the secret, and attach the user ID to `req.body` before passing control to the final controller function. This ensures DRY (Don't Repeat Yourself) code for authorization."

### Q5: How do you handle file uploads?

**Strategic Answer**: "I use `multer` as a temporary storage engine (disk storage). Once the file is received by the backend, it's uploaded to **Cloudinary** using their Admin SDK. The secure URL returned by Cloudinary is stored in MongoDB. This offloads static asset serving to a CDN, improving application performance."

---

## 🚀 7. Step-by-Step setup (The "Quick Start")

1.  **Repository Setup**: `git clone` and `npm install` in all three directories (`frontend`, `admin`, `backend`).
2.  **Environment Sync**: Setup `.env` files. (CRITICAL: Ensure `JWT_SECRET` is strong).
3.  **Database Connection**: Use MongoDB Atlas for a cloud-hosted sandbox.
4.  **Cloudinary Setup**: Create an account and get API credentials for profile picture uploads.
5.  **Run**: `npm run server` for backend and `npm run dev` for the frontend apps.
