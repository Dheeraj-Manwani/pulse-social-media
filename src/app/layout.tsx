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
  description: "Stay connected with the rhythm of conversations in real-time.",
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
            <NextTopLoader color="#6366F1" height={6} />
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
