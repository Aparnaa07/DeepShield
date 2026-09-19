import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Deep Shield — AI Fraud Detection",
  description: "AI-Powered Deepfake & Identity Fraud Detection Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none z-0" />
        <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-0"
          style={{ background: "radial-gradient(circle at top left, rgba(79, 70, 229, 0.15) 0%, transparent 70%)" }}
        />
        <div className="fixed bottom-0 right-0 w-48 h-48 pointer-events-none z-0"
          style={{ background: "radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.1) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
