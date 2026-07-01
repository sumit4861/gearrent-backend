# ⚙️ GearRent — Peer-to-Peer Gear Rental Marketplace

A full-stack web application where gear owners list their equipment for rent and renters can browse, book, and review gear — built using the MERN stack with AI-powered listing descriptions.

🔗 **Live Demo:** [gear-rent.vercel.app](https://gearrent-frontend.vercel.app)  
📦 **Backend Repo:** [github.com/sumit4861/gearrent-backend](https://github.com/sumit4861/gearrent-backend)  
💻 **Frontend Repo:** [github.com/sumit4861/gearrent-frontend](https://github.com/sumit4861/gearrent-frontend)

---

## 📸 Features

- 🔐 JWT-based authentication (register, login, protected routes)
- 🛠️ Gear listings with multi-image upload via Cloudinary
- 📅 Date-range booking with **server-side conflict detection** (no double bookings)
- ✅ Owner approval/rejection/completion flow for bookings
- ⭐ Review system with star ratings (only after completed bookings)
- 🤖 AI-powered listing description generator using Groq (llama3)
- 📊 Owner & renter dashboards with full booking management
- 📱 Fully responsive — mobile, tablet, and laptop

---

## 🏗️ Architecture

```
Frontend (React + Vite)          Backend (Node.js + Express)
        |                                    |
   React Router                        REST API
   Axios + JWT                              |
   AuthContext                    ┌─────────┼─────────┐
        |                         |         |         |
   Pages:                      MongoDB  Cloudinary  Groq AI
   - Home                      (Atlas)   (Images)  (Descriptions)
   - GearDetail
   - AddListing
   - Dashboard
```

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Image Upload | Cloudinary, Multer |
| AI | Groq API (llama3-8b-8192) |
| Deployment | Render (backend), Vercel (frontend) |

---

## 🗄️ Data Models

### User
```
_id, name, email, password, avatar, location, createdAt
```

### Gear
```
_id, owner → User, title, description, category, condition,
pricePerDay, deposit, images[], location, isAvailable
```

### Booking
```
_id, gear → Gear, renter → User, startDate, endDate,
totalDays, totalPrice, deposit, status (pending|approved|rejected|completed)
```

### Review
```
_id, gear → Gear, reviewer → User, booking → Booking, rating, comment
```

---

## 🔑 Key Design Decisions

**1. Server-side conflict detection**  
Booking conflicts are checked on the backend using a MongoDB date-overlap query before any booking is confirmed. This prevents race conditions where two renters book the same gear simultaneously — something a client-side check alone cannot guarantee.

**2. Cascade delete**  
When a gear listing is deleted, all associated bookings and reviews are automatically removed to prevent orphaned documents in the database.

**3. Role-based booking flow**  
The booking lifecycle is owner-driven: renters request → owners approve/reject → owners mark as completed. This gives gear owners full control and mirrors how real peer-to-peer platforms work.

**4. AI descriptions via Groq (not stored)**  
The AI description generator calls Groq on demand and returns the result to the frontend without storing it. The owner can edit it before submitting — keeping the AI as a helper, not a replacement.

**5. SQLite vs PostgreSQL**  
Used MongoDB over SQL because gear listings have variable attributes per category (a cycle has different specs than a camera). A document model fits this better than a rigid relational schema.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Groq API key

### Backend Setup

```bash
git clone https://github.com/sumit4861/gearrent-backend
cd gearrent-backend
npm install
```

Create `.env`:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
git clone https://github.com/sumit4861/gearrent-frontend
cd gearrent-frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get logged in user |

### Gear
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gear` | Get all listings (with filters) |
| GET | `/gear/:id` | Get single listing |
| POST | `/gear` | Create listing (auth) |
| PUT | `/gear/:id` | Update listing (owner only) |
| DELETE | `/gear/:id` | Delete listing (owner only) |
| POST | `/gear/generate-description` | AI description generator |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create booking request |
| GET | `/bookings/my` | Get renter's bookings |
| GET | `/bookings/owner` | Get owner's booking requests |
| GET | `/bookings/blocked/:gearId` | Get blocked dates for a gear |
| PATCH | `/bookings/:id/approve` | Approve booking |
| PATCH | `/bookings/:id/reject` | Reject booking |
| PATCH | `/bookings/:id/complete` | Mark as completed |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews` | Create review (completed bookings only) |
| GET | `/reviews/:gearId` | Get reviews for a gear |

---

## 🔮 Future Improvements (v2)

- Real-time in-app chat between owner and renter (Socket.io)
- Payment integration (Razorpay)
- Edit listing page
- Push notifications for booking status updates
- Map view for gear near you (Mapbox)

---

## 👨‍💻 Author

**Sumit** — [github.com/sumit4861](https://github.com/sumit4861)