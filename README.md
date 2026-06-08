# HealthConnect - Doctor Appointment Booking Platform

A full-stack web platform for patients to find and book doctors, and for doctors to manage appointments and consultations.

## Tech Stack

- **Frontend:** Next.js (React) with Tailwind CSS (mobile-first)
- **Backend:** Next.js API Routes (Node.js/Express)
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT-based cookie authentication for doctors

## Features

### Patient Side
- Browse and search doctors by specialization and location
- View doctor profiles with 7-day slot availability
- Book appointments with health summary (blood group, medical conditions, medications)
- Receive unique Booking ID on confirmation
- Mobile-friendly responsive design

### Doctor Side
- Secure login with JWT authentication
- Today's appointments dashboard with patient details
- View patient health summary before consultation
- Add diagnosis notes and prescriptions after consultation
- Block/unblock slots for leave or holidays

### Double-Booking Prevention
Backend-level atomic `findOneAndUpdate` ensures concurrent requests for the same slot never result in double-booking. See [docs/THOUGHT_PROCESS.md](docs/THOUGHT_PROCESS.md) for details.

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd healthcare-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Test Credentials (after seeding)

| Doctor | Email | Password |
|--------|-------|----------|
| Dr. Arun Sharma | arun@example.com | doctor123 |
| Dr. Priya Patel | priya@example.com | doctor123 |
| Dr. Rajesh Kumar | rajesh@example.com | doctor123 |
| Dr. Sneha Gupta | sneha@example.com | doctor123 |
| Dr. Vikram Singh | vikram@example.com | doctor123 |
| Dr. Ananya Reddy | ananya@example.com | doctor123 |
| Dr. Mohan Das | mohan@example.com | doctor123 |
| Dr. Deepa Iyer | deepa@example.com | doctor123 |

## Data Model

See [docs/DATA_MODEL.md](docs/DATA_MODEL.md) for the complete data model diagram.

## Thought Process

See [docs/THOUGHT_PROCESS.md](docs/THOUGHT_PROCESS.md) for:
- How double-booking prevention works at the backend
- One improvement with more time
- One feature intentionally left out


## License

MIT
