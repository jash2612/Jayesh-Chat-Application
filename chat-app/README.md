# MERN Chat Application

A real-time chat application built with MongoDB, Express.js, React, and Node.js, using Socket.IO for real-time communication.

## Project Structure
- `client/`: React frontend
- `server/`: Node.js/Express backend

## Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- GitHub account
- Vercel account

## Setup
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd chat-app
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   Update `.env` with your MongoDB URI and JWT secret.

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   cp .env.example .env
   ```
   Update `.env` with your API and Socket.IO URLs.

4. **Run Locally**:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm run dev`

## Deployment
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Create two Vercel projects: one for `client/` and one for `server/`.
   - Import the repository and select the respective directories.
   - Add environment variables in Vercel dashboard.
   - Deploy both projects.

## License
MIT
