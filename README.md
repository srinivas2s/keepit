<div align="center">

# 📦 KeepIt
### **"Receipts Fade. KeepIt Doesn't."**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Tesseract.js](https://img.shields.io/badge/Tesseract.js-Open_Source_OCR-5E35B1?style=for-the-badge)](https://tesseract.projectnaptha.com/)

---

KeepIt is a premium, full-stack warranty management application designed to ensure you never lose a warranty claim again. Scan receipts, track expiry dates, and verify coverage with dynamic QR codes.

[Explore Dashboard](http://localhost:3000/dashboard) · [Add New Product](http://localhost:3000/add) · [View Alerts](http://localhost:3000/alerts)

</div>

## ✨ Features

- **📸 AI-Powered Scanning**: Extract product details, brands, and dates automatically using Open Source OCR (Tesseract.js).
- **⏳ Live Countdown**: Real-time warranty tracking with animated flip counters and progress bars.
- **📱 Smart QR Verification**: Generate unique, secure QR codes for instant verification at service centres.
- **🔔 Proactive Alerts**: Automatic notifications 90, 30, and 7 days before any warranty expires.
- **📄 PDF Export**: Generate professional warranty reports for your entire inventory with one click.
- **🌗 Dark Mode**: Full support for system-wide light and dark themes with persistent memory.
- **📲 PWA Support**: Install KeepIt on your iOS or Android device for an app-like experience.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router) |
| **Styling** | [Tailwind CSS 4.0](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Auth** | [Supabase Auth](https://supabase.com/auth) (OTP via Phone) |
| **OCR** | [Tesseract.js](https://tesseract.projectnaptha.com/) (Open Source) |
| **QR Library** | [react-qr-code](https://github.com/rosskhanas/react-qr-code) |

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Supabase](https://supabase.com/) Project

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/keepit.git
cd keepit
npm install
```

### 2. Environment Setup
Create a `.env.local` file and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Migration
Execute the SQL found in [`supabase/schema.sql`](./supabase/schema.sql) within your Supabase SQL Editor to set up:
- Users, Products, and Alerts tables
- Row Level Security (RLS) Policies
- Automatic Status Update Triggers

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Mobile Installation (PWA)
1. Open your browser on mobile.
2. Navigate to your deployed KeepIt URL.
3. Select **"Add to Home Screen"** from the browser menu.
4. Launch KeepIt from your app drawer!

---

<div align="center">
  Built with ❤️ by Antigravity AI
</div>
