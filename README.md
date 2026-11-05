
# VELoop Rewards — Full-Stack User Profile & Admin Management System

## Project Overview
A full-stack MERN application for managing user profiles, rewards, wallets, referrals, withdrawals, and administrative operations.

## Technology Stack

### Frontend
- React.js
- Vite
- Bootstrap
- CSS Modules
- Lucide React
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Deployment
- Vercel (Frontend)
- Render / Railway (Backend)
- MongoDB Atlas (Database)

## Core Modules

### User Profile
- User information
- Rewards wallet (VEs, SVEs, Gems, Tokens, XP)
- Levels and achievements
- Referrals and withdrawals
- Activity history

### Admin Panel
- Admin authentication
- User management
- Wallet and reward management
- Withdrawal and referral management
- Audit logs and security

## Project Status
Planning and initial setup.

## Developer
Dheeraj Sharma

## Authentication implementation (feature branch)
The `feature/authentication` branch adds a Node.js/Express authentication API and React login/registration screens. Passwords are bcrypt-hashed; signed short-lived JWTs are stored in HttpOnly cookies; protected routes verify the session and enforce admin roles.

See [backend authentication setup](backend/README.md) for environment variables, API endpoints, local run instructions, and production security notes. Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env` before running locally.
