# NextStep — Student Career & Financial Wellness Platform

> **"Build Your Career. Own Your Future."**

NextStep is a unified career planning and personal finance platform designed for college students, fresh graduates, and early-career professionals. It helps users plan career goals, track job applications, manage budgets, and monitor financial progress — all in one place.

---

## ✨ Features

### Career Tools
- **Career Planner** — Create goals, set milestones, track skills, assign learning tasks
- **Job Application Tracker** — Track applications by status (Saved → Applied → Interview → Offer)
- **Sample Career Paths** — Suggested roadmaps for Frontend Dev, Backend Dev, Data Analyst, UX Designer, Cybersecurity

### Finance Tools
- **Finance Tracker** — Record income and expenses with categories (INR ₹ default)
- **Budget Planner** — Set monthly category budgets with real vs. actual comparisons
- **Savings Goals** — Create goals, log contributions, track progress

### Dashboard
- **Overview Dashboard** — Personalized stats, charts, recent transactions, upcoming tasks
- **Expense Breakdown** — Recharts pie chart by category
- **Monthly Trends** — Income vs expense bar chart

### Platform
- Secure email/password auth with bcrypt + JWT HTTP-only cookies
- Protected routes and session restoration on page refresh
- Contact form saved to MongoDB
- Responsive: mobile, tablet, desktop

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| UI Components | shadcn/ui-compatible Radix UI primitives |
| Icons | Lucide React |
| Charts | Recharts |
| Notifications | React Hot Toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | bcryptjs + jsonwebtoken + HTTP-only cookies |
| Validation | express-validator (server), inline (client) |
| Security | helmet, cors, express-rate-limit |

---

## 📁 Folder Structure

```
nextstep/
├── client/                    # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer, AppSidebar, layouts
│   │   │   └── ui/            # Button, Input, Card, Modal, Badge, etc.
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── lib/
│   │   │   ├── api.js         # Axios instance
│   │   │   └── utils.js       # Currency formatter, date helpers
│   │   ├── pages/
│   │   │   ├── public/        # HomePage, AboutPage, FeaturesPage, etc.
│   │   │   ├── auth/          # LoginPage, RegisterPage
│   │   │   └── app/           # OverviewPage, CareerPlannerPage, etc.
│   │   ├── App.jsx            # Routes + ProtectedRoute + PublicOnlyRoute
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Express + MongoDB backend
│   ├── middleware/
│   │   ├── auth.js            # JWT cookie verification
│   │   ├── errorHandler.js    # Centralized error handler
│   │   └── validate.js        # express-validator runner
│   ├── models/
│   │   ├── User.js
│   │   ├── CareerGoal.js
│   │   ├── JobApplication.js
│   │   ├── Transaction.js
│   │   ├── Budget.js
│   │   ├── SavingsGoal.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── careerGoals.js
│   │   ├── jobApplications.js
│   │   ├── transactions.js
│   │   ├── budgets.js
│   │   ├── savingsGoals.js
│   │   ├── contact.js
│   │   └── dashboard.js
│   ├── index.js               # App entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Prerequisites

- **Node.js** v18 or later ([nodejs.org](https://nodejs.org))
- **npm** v9 or later (comes with Node.js)
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nextstep
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your values (see Environment Variables below).

### 3. Set up the frontend

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `client/.env` if your backend runs on a different port.

---

## 🔐 Environment Variables

### server/.env

```env
# MongoDB connection URI
MONGO_URI=mongodb://localhost:27017/nextstep

# JWT secret — MUST be at least 32 characters. Use a random string.
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars-here

# Server environment
NODE_ENV=development

# Port for the Express server
PORT=5000

# Exact origin of the frontend (no trailing slash)
ALLOWED_ORIGIN=http://localhost:5173
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### client/.env

```env
# Backend API base URL (no trailing slash)
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Development Commands

### Start the backend (from `server/` directory)

```bash
cd server
npm run dev        # nodemon — auto-restart on changes
```

The API will be available at `http://localhost:5000`.
Health check: `http://localhost:5000/health`

### Start the frontend (from `client/` directory)

```bash
cd client
npm run dev        # Vite dev server with hot reload
```

The app will be available at `http://localhost:5173`.

### Run both simultaneously

Open two terminals — one for `server/` and one for `client/`.

Or install `concurrently` at the root and use:
```bash
npm run dev
```

---

## 🧪 Tests

The test suite uses Jest and Supertest.

```bash
cd server
npm test
```

Test coverage:
- Registration and login
- Invalid credentials / validation errors
- Protected API access without token
- User data isolation between accounts
- CRUD for career goals, applications, transactions, budgets, savings goals
- Dashboard summary calculations
- Contact form submission

---

## 🏗 Production Build

### Frontend

```bash
cd client
npm run build       # Creates dist/ folder
npm run preview     # Preview the production build locally
```

### Backend

```bash
cd server
NODE_ENV=production npm start
```

---

## ☁️ Deployment

### Frontend — Vercel / Netlify

1. Connect your repo and set the **root directory** to `client/`.
2. **Build command:** `npm run build`
3. **Output directory:** `dist`
4. Add environment variable: `VITE_API_URL=https://your-api.example.com/api`
5. For React Router: add a `_redirects` file (Netlify) or `vercel.json` rewrite rule:
   - Netlify: create `client/public/_redirects` → `/* /index.html 200`
   - Vercel: `vercel.json` with `"rewrites": [{"source":"/(.*)", "destination":"/index.html"}]`

### Backend — Railway / Render / Fly.io

1. Connect your repo and set the **root directory** to `server/`.
2. **Start command:** `npm start`
3. Set all environment variables from `server/.env`:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — secure random value
   - `NODE_ENV` — `production`
   - `ALLOWED_ORIGIN` — your deployed frontend URL (e.g., `https://nextstep.vercel.app`)

### MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user with a strong password.
3. Whitelist your backend server IP (or `0.0.0.0/0` for cloud hosts with dynamic IPs).
4. Copy the connection string and set it as `MONGO_URI`.
5. Replace `<password>` and `<dbname>` (`nextstep`) in the URI.

### Production Checklist

- [ ] `NODE_ENV=production` set on backend
- [ ] `JWT_SECRET` is at least 32 chars, random, not in source control
- [ ] `ALLOWED_ORIGIN` matches exact deployed frontend URL
- [ ] `MONGO_URI` uses Atlas, not `localhost`
- [ ] MongoDB Atlas network access is configured
- [ ] HTTPS is enabled (automatic on Vercel/Railway/Render)
- [ ] Cookies will be `secure:true` in production (handled automatically)
- [ ] No `.env` files committed to git

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `FATAL: JWT_SECRET must be at least 32 characters` | Set a proper `JWT_SECRET` in `server/.env` |
| `MongoDB connection failed` | Check `MONGO_URI`, ensure MongoDB is running or Atlas IP is whitelisted |
| CORS errors in browser | Ensure `ALLOWED_ORIGIN` in server `.env` matches your exact frontend URL |
| `401 Unauthorized` on all requests | Cookies may not be sent — ensure `withCredentials: true` in axios and CORS `credentials: true` |
| Frontend shows blank page | Run `npm run build` and check console for errors; ensure `VITE_API_URL` is set |
| Vite proxy not working | Check `vite.config.js` proxy target matches your backend port |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (12 rounds) — never stored in plaintext.
- JWT tokens live in **HTTP-only cookies** — inaccessible to JavaScript.
- All private API endpoints verify the cookie token before responding.
- Database queries are always scoped to `req.user.id` — users cannot access each other's data.
- Rate limiting: 10 auth requests / 15 min, 100 general / 15 min per IP.
- The `helmet` middleware sets security headers on every response.
- Input validation with `express-validator` on all routes.
- No credentials, secrets, or `.env` files are committed to source control.

---

## 📝 License

This project was built for the **InAmigos Foundation** activity showcase. It is intended for educational and demonstrational purposes.

---

## 🙏 Acknowledgements

Built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and a collection of excellent open-source libraries.
