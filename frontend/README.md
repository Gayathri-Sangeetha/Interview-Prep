# 🎯 InterviewPrep AI

A full-stack MERN application that helps developers prepare for technical interviews using AI-powered question generation, interactive Q&A, and smart study tools.

---

## ✨ Features

- 🔐 User Authentication — Register and login with JWT
- 🎭 Role-Based Sessions — Generate questions by job role & experience
- 🤖 AI-Powered Q&A — Auto-generate technical questions using Gemini API
- 📖 Accordion UI — Expandable Q&A for clean study flow
- 💡 AI Explanations — On-demand concept breakdowns
- 📌 Pin Questions — Save important questions for quick access
- 🗄️ MongoDB Storage — All sessions and questions saved to database
- 🎨 Tailwind CSS — Responsive, modern UI

---

## 🛠️ Tech Stack

- **Frontend** — React, Vite, Tailwind CSS, Axios
- **Backend** — Node.js, Express.js
- **Database** — MongoDB Atlas (Mongoose)
- **Auth** — JWT + bcryptjs
- **AI** — Groq API

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/interview-prep-ai.git
cd interview-prep-ai
```

### 2. Backend setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Groq_API_KEY=your_groq_api_key
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create session + generate questions |
| GET | `/api/sessions` | Get all sessions |
| GET | `/api/sessions/:id` | Get single session |
| DELETE | `/api/sessions/:id` | Delete session |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions/pinned` | Get pinned questions |
| PATCH | `/api/questions/:id/pin` | Toggle pin |
| POST | `/api/questions/explain` | Get AI explanation |

---

## 🔒 .gitignore

Make sure your `.gitignore` includes:
```
node_modules
.env
dist
```

---

## 👩‍💻 Author

Made by **Gayathri**

---

⭐ If you found this helpful, give it a star on GitHub!