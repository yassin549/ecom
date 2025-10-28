"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#111827",
          padding: "16px",
          borderRadius: "12px",
          border: "2px solid #E5E7EB",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#fff",
          },
          style: {
            border: "2px solid #10B981",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
          style: {
            border: "2px solid #EF4444",
          },
        },
        loading: {
          iconTheme: {
            primary: "#6366F1",
            secondary: "#fff",
          },
        },
      }}
    />
  )
}
