# 🔐 Toolwala — Free Authentication & Login Options Guide

A comprehensive comparison and implementation guide for **100% Free Login & Authentication** providers suitable for **Toolwala** (React 19 + Vite SPA).

---

## 📊 Quick Comparison Matrix

| Provider | Free Monthly Active Users (MAU) | Credit Card Required? | Social Logins (Google, GitHub, etc.) | Pre-built UI Components | Database Included? | Best For |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **[Supabase Auth](https://supabase.com/auth)** | **50,000 MAU** | ❌ No | ✅ Unlimited providers | ✅ Pre-built & Headless | ✅ Full PostgreSQL (500MB) | **Best Overall** (Huge free quota + Database) |
| **[Clerk](https://clerk.com)** | **10,000 MAU** | ❌ No | ✅ Google, GitHub, Apple, etc. | ⭐️⭐️⭐️⭐️⭐️ Native React (Matches Shadcn) | ❌ Auth only (Metadata storage) | **Best UI & Quickest Setup** (Zero CSS needed) |
| **[Firebase Auth](https://firebase.google.com)** | **50,000 MAU** (Identity) / Unlimited basic | ❌ No | ✅ Google, GitHub, Apple, etc. | ⚠️ Outdated FirebaseUI | ✅ Firestore NoSQL | High scale with Google ecosystem |
| **[Appwrite Cloud](https://appwrite.io)** | **75,000 MAU** | ❌ No | ✅ 30+ OAuth providers | ⚠️ Custom UI needed | ✅ Built-in DB + Storage | Open-source Firebase alternative |
| **[Kinde](https://kinde.com)** | **10,000 MAU** | ❌ No | ✅ Social + Passwordless | ✅ Hosted login page / SDK | ❌ Auth only | Modern B2B/B2C SaaS & clean UI |
| **[PocketBase](https://pocketbase.io)** | **Unlimited** (Self-hosted) | ❌ No | ✅ OAuth2 + Email/Password | ⚠️ Custom UI needed | ✅ Embedded SQLite | 100% Free forever & local control |

---

## 1. Supabase Auth (Recommended for Maximum Free Quota)

### Why Choose Supabase:
- **50,000 MAU free forever**: More than enough for thousands of daily active users.
- **Included PostgreSQL Database (500MB free)**: Perfect if you later want users to save their processed files, conversion history, or custom presets.
- **Row-Level Security (RLS)**: Protects user data directly in the database.
- **Methods**: Email + Password, Magic Link (passwordless), Google, GitHub, Apple, Discord, etc.

### Installation for Toolwala:
```bash
npm install @supabase/supabase-js
```

### Quick Setup Example (`src/lib/supabase.js`):
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Google Sign-In with One Click:
```javascript
import { supabase } from '../lib/supabase';

// Google OAuth
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) console.error('Login error:', error.message);
  return data;
}

// Sign Out
export async function signOut() {
  await supabase.auth.signOut();
}
```

---

## 2. Clerk (Recommended for Beautiful Shadcn-style UI)

### Why Choose Clerk:
- **10,000 MAU free forever**: Generous enough for growing apps.
- **Turnkey Pre-built Components**: Drop in `<SignIn />`, `<SignUp />`, and `<UserButton />` with zero custom HTML/CSS.
- **Matches Toolwala's Aesthetics**: Clerk's components look identical to **Shadcn UI** out of the box with dark and light mode themes.
- **Session & Token Management**: Automatic token refresh, multi-session support, and user profile management modals.

### Installation for Toolwala:
```bash
npm install @clerk/clerk-react
```

### Quick Setup Example (`src/main.jsx`):
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
```

### Adding Login Buttons to Toolwala Header (`Header.jsx`):
```jsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export function HeaderAuth() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
```

---

## 3. Firebase Authentication (Google Cloud)

### Why Choose Firebase:
- **50,000 MAU free tier** on the new Identity Platform; basic phone/email auth has high free quotas.
- Highly reliable Google infrastructure.
- Integrates seamlessly with Cloud Storage if you ever want cloud file storage.

### Downsides:
- Pre-built UI (`firebaseui`) looks dated compared to modern Shadcn styling; you usually have to code custom login forms.

---

## 4. Appwrite Cloud

### Why Choose Appwrite:
- **75,000 MAU free tier**: Largest free tier among hosted backend-as-a-service (BaaS) platforms.
- Open-source, no vendor lock-in.
- Includes auth, database, file storage, and serverless cloud functions on the free tier.

---

## 5. PocketBase (100% Free Forever, Self-Hosted)

### Why Choose PocketBase:
- **Zero MAU limits**: Completely free forever because you host it yourself (e.g. on a $0 free tier VPS like Oracle Cloud, Fly.io, or Render).
- Consists of a **single lightweight Go executable** with embedded SQLite database.
- Built-in real-time subscriptions, user auth (OAuth2 + Email), and admin dashboard.

---

## 🎯 Which Option Should Toolwala Use?

1. **If you want the fastest, best-looking UI that matches Toolwala's modern Shadcn design:**
   👉 **Choose Clerk**. You can add a complete, gorgeous modal login with Google/GitHub and user profile avatar in under 10 minutes without writing form markup or CSS.

2. **If you want the highest free limit + a free PostgreSQL database for user file history:**
   👉 **Choose Supabase**. 50,000 monthly active users completely free without entering a credit card, plus 500 MB of relational database storage.

3. **If you want 100% client-side privacy without external third-party tracking:**
   👉 Keep Toolwala **login-free** for basic tools, and only prompt optional login if users want cloud sync or conversion history.
