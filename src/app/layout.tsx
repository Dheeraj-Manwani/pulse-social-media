import { Toaster } from "react-hot-toast";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";
import { cn } from "@/lib/utils"; // shadcn helper
import NextTopLoader from "nextjs-toploader";

// Brand fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Pulse",
    default: "Pulse",
  },
  description:
    "Pulse is a social media app where you can feel the rhythm, connect, and share moments.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Pulse – Feel the Rhythm",
    description:
      "A social platform to connect, share, and feel the rhythm together.",
    url: "https://pulse-social-media-pi.vercel.app",
    siteName: "Pulse",
    images: [
      {
        url: "/full_logo.png", // 👈 put this in your /public folder
        // width: 1200,
        // height: 630,
        alt: "Pulse App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse – Feel the Rhythm",
    description:
      "A social platform to connect, share, and feel the rhythm together.",
    images: ["/full_logo.png"], // 👈 also from /public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        {/* UploadThing Config */}
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />

        {/* Data fetching / caching */}
        <ReactQueryProvider>
          {/* Theme + Motion Support */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#2563EB" height={4} />
            <main className="relative flex min-h-screen flex-col">
              {children}
            </main>
          </ThemeProvider>
        </ReactQueryProvider>

        {/* Notifications */}
        <Toaster
          toastOptions={{
            duration: 4000,
            position: "top-center",
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              maxWidth: "400px",
              minWidth: "300px",
            },
          }}
        />
      </body>
    </html>
  );
}
