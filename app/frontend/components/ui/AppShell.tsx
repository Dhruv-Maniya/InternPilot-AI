'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Navbar } from '@/components/navbar/Navbar';
import { useAuth } from '@/lib/auth-context';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, removeToast } = useAuth();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <main className="page-body">{children}</main>
      </div>

      {/* Global Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: '#10b981' }} />}
              {toast.type === 'error' && <AlertCircle size={18} style={{ color: '#ef4444' }} />}
              {toast.type === 'info' && <Info size={18} style={{ color: '#2563eb' }} />}
              <span style={{ fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
