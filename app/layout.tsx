
"use client"
import { Provider } from "react-redux";
import { store } from "@/redux/store";
//import { Metadata } from "next";
import "./globals.css";

/* export const metadata: Metadata = {
  title: "Kennel Management System",
  description: "Manage check-ins, check-outs, and details of dogs and owners efficiently.",
  themeColor: "#1976d2",
  manifest: "/manifest.json",
}; */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
