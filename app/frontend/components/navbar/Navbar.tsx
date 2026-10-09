'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Menu, Target, ArrowRight, UserCheck, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps {
  onToggleMobile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile }) => {
  const { user, profile, activeInternship, deadlines } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="topbar">
        {/* Left: Mobile Toggle & Active Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onToggleMobile && (
            <button
              onClick={onToggleMobile}
              style={{ display: 'inline-flex', padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}
            >
              <Menu size={22} />
            </button>
          )}

          {activeInternship ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '0.8125rem' }}>
              <Target size={14} style={{ color: '#2563eb' }} />
              <span style={{ fontWeight: 600, color: '#1e3a8a' }}>Preparing:</span>
              <span style={{ color: '#1e40af', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeInternship.title} ({activeInternship.company})
              </span>
              <Link href="/skill-gap" style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#2563eb', fontWeight: 600, marginLeft: '6px', fontSize: '0.75rem' }}>
                Prep Workspace <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
              Discover Opportunities. Prepare Smarter. Manage Your Career.
            </div>
          )}
        </div>

        {/* Right: Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: showNotifications ? '#f1f5f9' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
              }}
              title="Upcoming Deadlines"
            >
              <Bell size={18} />
              {deadlines.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {deadlines.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '340px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-color)',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>Application Deadlines</span>
                  <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>
                    {deadlines.length} Alert{deadlines.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {deadlines.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '0.8125rem' }}>
                      <CheckCircle2 size={24} style={{ color: '#10b981', margin: '0 auto 8px', display: 'block' }} />
                      No urgent deadlines within the alert window.
                    </div>
                  ) : (
                    deadlines.map((item, idx) => (
                      <div key={idx} style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc', transition: 'background-color 0.15s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }}>{item.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.company}</div>
                          </div>
                          <span
                            className={`badge ${item.days_remaining <= 1 ? 'badge-danger' : 'badge-warning'}`}
                            style={{ fontSize: '0.6875rem' }}
                          >
                            <Clock size={10} style={{ marginRight: '2px' }} />
                            {item.days_remaining === 0 ? 'Today' : `${item.days_remaining}d left`}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> {item.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <Link
                    href="/watchlist"
                    onClick={() => setShowNotifications(false)}
                    style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}
                  >
                    View All in Watchlist →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Trigger */}
          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#1e293b',
            }}
          >
            <UserCheck size={16} style={{ color: '#2563eb' }} />
            <span>{profile.name.split(' ')[0]}</span>
          </button>
        </div>
      </header>

      {/* Student Profile Overview Modal */}
      {showProfileModal && (
        <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#0f172a' }}>Student Profile & Preferences</div>
              <button onClick={() => setShowProfileModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#94a3b8' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label className="label">Full Name</label>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{profile.name}</div>
              </div>

              <div>
                <label className="label">Education / Program</label>
                <div style={{ fontSize: '0.875rem', color: '#475569' }}>{profile.education}</div>
              </div>

              <div>
                <label className="label">Current Technical Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {profile.skills.map((s, idx) => (
                    <span key={idx} className="badge badge-primary">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Career Interests</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {profile.interests.map((s, idx) => (
                    <span key={idx} className="badge badge-neutral">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Preferred Location</label>
                <div style={{ fontSize: '0.875rem', color: '#475569' }}>📍 {profile.preferred_location}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Close</button>
              <Link href="/internships" className="btn btn-primary" onClick={() => setShowProfileModal(false)}>
                Find Matched Internships
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
