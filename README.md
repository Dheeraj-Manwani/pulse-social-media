<div align="center">

# Pulse - Social Media
![logo](https://d3alt1jj3f7923.cloudfront.net/static_assets/pulse_logo.png)

**Find your Rhythm, Connect, Share Moments**

A modern, full-stack social media platform built with Next.js 15, featuring real-time messaging, infinite scroll, optimistic updates, and beautiful UI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.16-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## ✨ Features

### 🎯 Core Features
- **🔐 Authentication** - Secure login/signup with Google OAuth and email/password
- **📱 Real-time Messaging** - Direct messages powered by Stream Chat
- **🔔 Notifications** - Real-time notifications for likes, comments, and follows
- **📸 Media Uploads** - Image and video uploads via UploadThing
- **♾️ Infinite Scroll** - Smooth infinite loading with React Query
- **⚡ Optimistic Updates** - Instant UI updates for better UX
- **🌓 Dark Mode** - Beautiful dark theme with system preference detection
- **🔍 Search** - Full-text search for posts and users
- **📑 Bookmarks** - Save your favorite posts
- **💬 Comments** - Rich comment system with real-time updates

### 🎨 UI/UX
- Modern, responsive design
- Smooth animations with Framer Motion
- Accessible components with Radix UI
- Customizable theme system
- Mobile-first approach

---

## 📁 Project Structure

```
pulse-social-media/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (main)/            # Main app routes
│   │   │   ├── messages/      # Messaging feature
│   │   │   ├── notifications/ # Notifications
│   │   │   └── ...
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── posts/             # Post-related components
│   │   ├── comments/         # Comment components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utilities and configs
│   └── assets/               # Images and assets
├── example.env               # Environment variables template
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **TipTap** - Rich text editor

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Lucia Auth** - Authentication
- **Stream Chat** - Real-time messaging
- **UploadThing** - File uploads

### DevOps
- **Vercel** - Deployment
- **Prisma Migrate** - Database migrations



<div align="center">


[Report Bug](https://github.com/yourusername/pulse-social-media/issues) · [Request Feature](https://github.com/yourusername/pulse-social-media/issues)

</div>