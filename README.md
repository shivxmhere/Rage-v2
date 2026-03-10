# RAGE OS — Rise. Achieve. Grow. Evolve.
> Rise. Achieve. Grow. Evolve.
**[Explore Live App](https://rage-os.vercel.app)**

A world-class, production-grade Student Operating System designed for academic dominance and systematic progress.

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Core** | React 18, Vite, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **Backend** | Firebase Auth, Firestore, Storage |
| **Intelligence** | Groq (Llama-3.3-70B) / Claude |
| **Analytics** | Recharts |
| **Format** | PWA (Progressive Web App) |

## 📦 Core Modules

| Module | Functionality |
| :--- | :--- |
| **TRACK** | High-precision study timer and habit synchronization. |
| **FEED** | Tactical social intelligence layer for peer networking. |
| **VAULT** | Encrypted knowledge base for files and persistent notes. |
| **GOALS** | Strategic directive tracking with OKR precision. |
| **TIMETABLE** | Dynamic command schedule with browser alerts. |
| **AI TUTOR** | Neural Nexus support for first-principles mastery. |
| **REPORT** | Live analytics and performance radar visualization. |
| **PROFILE** | Academic rank progression and identity parameters. |
| **CONNECT** | Live study clusters and squad accountability. |

## 📂 Project Structure

```text
src/
├── assets/
├── components/
│   ├── ProtectedRoute.tsx
│   └── UI.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   └── firebase.ts
├── pages/
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   ├── Onboarding.tsx
│   └── dashboard/
│       ├── AIChat.tsx
│       ├── Connect.tsx
│       ├── Feed.tsx
│       ├── Goals.tsx
│       ├── Profile.tsx
│       ├── Report.tsx
│       ├── Timetable.tsx
│       ├── Track.tsx
│       └── Vault.tsx
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## 🚀 Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/shivxmhere/Rage-v2.git

# 2. Install dependencies
npm install

# 3. Configure environment
copy .env.example .env

# 4. Launch development
npm run dev
```

## 🔑 Environment Variables

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_GROQ_API_KEY
```

## 🛡 Infrastructure

- **Auth**: Firebase Authentication with secure Google and Email provider integration.
- **Database**: Firestore NoSQL database providing real-time cross-device synchronization.
- **Deployment**: High-performance Vercel pipeline with automated CI/CD protocols.

## 📄 License

MIT
