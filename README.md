# 🚗 Fleeter — Production-Grade Vehicle Booking Platform

<div align="center">

![Fleeter Banner](https://img.shields.io/badge/Fleeter-Vehicle%20Booking%20Platform-black?style=for-the-badge&logo=vercel)

**A full-stack, real-time ride-hailing platform built for the modern web.**  
Think Uber. Think Ola. Built from scratch — with production-level architecture.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF?style=flat-square&logo=razorpay)](https://razorpay.com/)
[![Auth.js](https://img.shields.io/badge/Auth.js-Secure%20Auth-purple?style=flat-square)](https://authjs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#) · [Documentation](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Real-Time System](#-real-time-system-socketio)
- [Payment Flow](#-payment-flow-razorpay)
- [Video KYC Flow](#-video-kyc-flow-zegocloud)
- [Authentication](#-authentication-authjs)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Fleeter** is a full-stack vehicle booking platform that replicates the core experience of apps like Uber and Ola — but built transparently, from the ground up, using modern web technologies. It is designed as a **production-level system**, not a tutorial toy — featuring real-time GPS tracking, driver verification via Video KYC, secure online payments, and a dual-dashboard experience for both users and drivers.

Whether you're learning scalable system design, building a startup MVP, or studying how ride-hailing products work under the hood — Fleeter is your reference implementation.

> **"Not just another clone. A production-ready architecture you can actually ship."**

---

## ✨ Features

### 👤 For Riders
- 🔍 Search pickup & drop locations with autocomplete (Google Maps / Mapbox)
- 🚗 Choose vehicle category (Bike, Auto, Sedan, SUV, etc.)
- 📍 Live driver location tracking on an interactive map
- ⏱️ Real-time ETA updates as the driver moves
- 💳 Pay securely online via Razorpay (UPI, Cards, Wallets)
- 📜 Full ride history with receipts
- ⭐ Rate and review drivers post-ride
- 🔔 Push/in-app notifications for ride status changes

### 🚘 For Drivers
- 📋 Driver onboarding with Video KYC verification (powered by ZEGOCLOUD)
- 🟢 Go Online / Go Offline toggle
- 🗺️ Live incoming ride request notifications with map preview
- ✅ Accept or decline ride requests in real time
- 📍 Navigation to pickup and drop locations
- 💰 Earnings dashboard with daily/weekly breakdown
- 📄 Trip history and payout summary

### 🛡️ Platform / Admin
- 👁️ Centralized driver KYC review system
- 📊 Admin analytics dashboard
- 🔐 Secure, role-based access control (Rider / Driver / Admin)
- 🧾 Automated fare calculation based on distance + time
- 🌐 Scalable, AI-ready architecture for adding smart features

---

## 🧠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | SSR, routing, React Server Components |
| **Styling** | Tailwind CSS | Utility-first responsive styling |
| **Animations** | Framer Motion | Page transitions, smooth UI effects |
| **Database** | MongoDB Atlas | Flexible NoSQL document storage |
| **ORM/ODM** | Mongoose | Schema modeling for MongoDB |
| **Real-Time** | Socket.io | Bidirectional live communication |
| **Auth** | Auth.js (NextAuth v5) | Secure session-based authentication |
| **Payments** | Razorpay | UPI, card & wallet payment gateway |
| **Video KYC** | ZEGOCLOUD | Live video verification for drivers |
| **Maps** | Google Maps API / Mapbox | Location search, routing, live tracking |
| **Storage** | Cloudinary / AWS S3 | Driver document & profile image storage |
| **Deployment** | Vercel + Railway | Frontend & WebSocket server hosting |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        FLEETER PLATFORM                          │
├─────────────────────┬────────────────────┬───────────────────────┤
│   RIDER CLIENT      │   DRIVER CLIENT    │    ADMIN DASHBOARD    │
│   (Next.js App)     │   (Next.js App)    │    (Next.js App)      │
└────────┬────────────┴────────┬───────────┴──────────┬────────────┘
         │                     │                       │
         ▼                     ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API LAYER (Route Handlers)           │
│         Auth Middleware │ Role Guards │ Input Validation         │
└──────────────┬──────────────────────────────────────────────────┘
               │
       ┌───────┴──────────────────────────────────┐
       ▼                                          ▼
┌─────────────┐                        ┌─────────────────────┐
│  MongoDB    │                        │  Socket.io Server   │
│  Atlas      │                        │  (Real-time Events) │
│  (Data)     │                        │  Ride Requests      │
└─────────────┘                        │  Location Updates   │
                                       └─────────────────────┘
       │
       ├─── Razorpay (Payments)
       ├─── ZEGOCLOUD (Video KYC)
       ├─── Google Maps API (Geocoding / Routing)
       └─── Cloudinary (Media Storage)
```

### Data Flow — Booking a Ride
```
User requests ride
    │
    ▼
Next.js API validates request + calculates fare
    │
    ▼
Socket.io broadcasts to nearby available drivers
    │
    ▼
Driver accepts → Socket.io updates rider in real time
    │
    ▼
Rider sees driver moving on map (live location updates every 3s)
    │
    ▼
Ride completes → Razorpay payment initiated
    │
    ▼
Receipt generated + stored in MongoDB
```

---

## 📁 Project Structure

```
fleeter/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── (rider)/                  # Rider-facing pages
│   │   ├── dashboard/
│   │   ├── book/
│   │   ├── track/[rideId]/
│   │   └── history/
│   ├── (driver)/                 # Driver-facing pages
│   │   ├── dashboard/
│   │   ├── kyc/
│   │   ├── rides/
│   │   └── earnings/
│   ├── (admin)/                  # Admin panel
│   │   ├── dashboard/
│   │   ├── drivers/
│   │   └── analytics/
│   └── api/                      # API Route Handlers
│       ├── auth/[...nextauth]/
│       ├── rides/
│       ├── drivers/
│       ├── payments/
│       └── kyc/
│
├── components/                   # Shared UI components
│   ├── map/
│   │   ├── LiveMap.tsx
│   │   ├── DriverMarker.tsx
│   │   └── RouteOverlay.tsx
│   ├── booking/
│   │   ├── LocationSearch.tsx
│   │   ├── VehicleSelector.tsx
│   │   └── FareEstimate.tsx
│   ├── driver/
│   │   ├── RideRequest.tsx
│   │   └── EarningsCard.tsx
│   └── ui/                       # Base UI primitives
│
├── lib/                          # Core utilities
│   ├── db.ts                     # MongoDB connection
│   ├── socket.ts                 # Socket.io client setup
│   ├── auth.ts                   # Auth.js config
│   ├── razorpay.ts               # Payment helpers
│   └── zegocloud.ts              # Video KYC helpers
│
├── models/                       # Mongoose schemas
│   ├── User.ts
│   ├── Driver.ts
│   ├── Ride.ts
│   ├── Payment.ts
│   └── Review.ts
│
├── server/                       # Socket.io server (standalone)
│   ├── index.ts
│   ├── handlers/
│   │   ├── rideHandler.ts
│   │   └── locationHandler.ts
│   └── rooms.ts
│
├── hooks/                        # Custom React hooks
│   ├── useSocket.ts
│   ├── useLocation.ts
│   └── useRide.ts
│
├── store/                        # Client state (Zustand / Context)
│   ├── rideStore.ts
│   └── driverStore.ts
│
├── types/                        # TypeScript type definitions
│   └── index.ts
│
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- **MongoDB** (Atlas cluster or local instance)
- A **Razorpay** account (test mode is fine)
- A **ZEGOCLOUD** account for Video KYC
- A **Google Maps API** key with Maps JS, Geocoding & Directions APIs enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fleeter.git
   cd fleeter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in all required values (see Environment Variables section)
   ```

4. **Start the development server**
   ```bash
   # Start Next.js app
   npm run dev

   # In a separate terminal, start the Socket.io server
   npm run server
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root of the project:

```env
# ─── App ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_here

# ─── Database ──────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fleeter

# ─── Auth Providers (optional: Google / GitHub OAuth) ──────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ─── Razorpay ──────────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx

# ─── ZEGOCLOUD (Video KYC) ────────────────────────────────────
NEXT_PUBLIC_ZEGO_APP_ID=your_zego_app_id
NEXT_PUBLIC_ZEGO_SERVER_SECRET=your_zego_server_secret

# ─── Google Maps ───────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# ─── Socket.io Server ──────────────────────────────────────────
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# ─── Cloudinary (Media Storage) ────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚡ Real-Time System (Socket.io)

### Events — Rider Side

| Event | Direction | Payload |
|---|---|---|
| `ride:request` | Emit | `{ pickupCoords, dropCoords, vehicleType }` |
| `ride:accepted` | Listen | `{ driver, eta }` |
| `driver:location` | Listen | `{ lat, lng }` |
| `ride:started` | Listen | `{ rideId }` |
| `ride:completed` | Listen | `{ fare }` |

### Events — Driver Side

| Event | Direction | Payload |
|---|---|---|
| `driver:online` | Emit | `{ driverId, location }` |
| `ride:incoming` | Listen | `{ rideId, pickup, drop, fare }` |
| `ride:accept` | Emit | `{ rideId }` |
| `driver:location` | Emit | `{ rideId, lat, lng }` |
| `ride:complete` | Emit | `{ rideId }` |

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```
Set all environment variables in the Vercel dashboard.

### Socket.io Server (Railway / Render)
```bash
# Dockerfile included for containerized deployment
docker build -t fleeter-socket .
docker run -p 3001:3001 fleeter-socket
```

### Database
- Use **MongoDB Atlas** for managed cloud hosting
- Enable **geospatial indexing** on `Driver.currentLocation` for efficient nearby-driver queries:
```javascript
db.drivers.createIndex({ currentLocation: '2dsphere' });
```


## 🤝 Contributing

Contributions are welcome and encouraged! Here's how to get started:

1. **Fork** this repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

Please follow the existing code style, write meaningful commit messages, and add tests where applicable. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/) — The React framework for production
- [Socket.io](https://socket.io/) — Real-time bidirectional event-based communication
- [ZEGOCLOUD](https://www.zegocloud.com/) — Video SDK for driver KYC
- [Razorpay](https://razorpay.com/) — India's leading payment gateway
- [Auth.js](https://authjs.dev/) — Authentication for the web
- [Framer Motion](https://www.framer.com/motion/) — Production-ready animation library
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud-hosted MongoDB

---

<div align="center">

Built with ❤️ by **[Your Name]**

⭐ Star this repo if you found it helpful!

</div>
