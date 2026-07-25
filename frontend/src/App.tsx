import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Notification } from "./types";
import { Mail, Smartphone, BellRing, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<{ rollNumber: string; email: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Real-time toast alert popups state
  const [toast, setToast] = useState<{ id: string; title: string; message: string; type: 'email' | 'push' } | null>(null);

  // Load notifications from server
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifications/${user.rollNumber}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error("Failed to sync notifications:", e);
    }
  };

  // Trigger a new notification (API + visual toast)
  const handleTriggerNotification = async (title: string, message: string, type: 'email' | 'push') => {
    if (!user) return;
    
    // Add toast visual feedback
    const toastId = Math.random().toString();
    setToast({ id: toastId, title, message, type });
    
    // Auto clear toast after 5 seconds
    setTimeout(() => {
      setToast((prev) => (prev && prev.id === toastId ? null : prev));
    }, 5000);

    // Write to server SQL logs
    try {
      await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: "INSERT INTO notifications (roll_number, type, title, message, status, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
          params: [user.rollNumber, type, title, message, 'sent', new Date().toISOString()]
        })
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  // Automatically load notifications on login
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const handleLoginSuccess = (loggedInUser: { rollNumber: string; email: string }) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setToast(null);
  };

  return (
    <div className="relative min-h-screen bg-cyber-dark">
      {/* Toast Alert popover wrapper */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            id="toast-notification-popup"
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4 bg-cyber-slate/95 border border-cyber-blue/40 rounded-xl shadow-2xl backdrop-blur-xl p-4 flex gap-3.5"
          >
            {/* Corner styling accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyber-neon" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyber-neon" />

            <div className="w-10 h-10 rounded-lg bg-cyber-dark/80 border border-cyber-blue/20 flex items-center justify-center shrink-0">
              {toast.type === 'email' ? (
                <Mail className="w-5.5 h-5.5 text-cyber-blue" />
              ) : (
                <Smartphone className="w-5.5 h-5.5 text-cyber-neon animate-bounce" />
              )}
            </div>

            <div className="flex-1 space-y-1 pr-4">
              <span className="font-mono font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-white">
                <Sparkles className="w-3.5 h-3.5 text-cyber-neon" />
                {toast.type === 'email' ? "Email Notification Dispatched" : "Push Security Alert"}
              </span>
              <h5 className="font-sans font-bold text-white text-xs leading-tight">{toast.title}</h5>
              <p className="font-sans text-[11px] text-gray-300 leading-normal">{toast.message}</p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Routing */}
      {user ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          notifications={notifications}
          onTriggerNotification={handleTriggerNotification}
          onRefreshNotifications={fetchNotifications}
        />
      ) : (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onShowNotification={(title, message, type) => {
            // If they are not logged in, we can display the toast with some delay
            const toastId = Math.random().toString();
            setToast({ id: toastId, title, message, type });
            setTimeout(() => {
              setToast((prev) => (prev && prev.id === toastId ? null : prev));
            }, 5000);
          }}
        />
      )}
    </div>
  );
}
