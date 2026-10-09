'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  GitCompare,
  BookOpen,
  FileText,
  HelpCircle,
  MessageSquare,
  Bookmark,
  Briefcase,
  LogOut,
  Target,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { user, profile, activeInternship, logout, setActiveInternship } = useAuth();

  const navSections = [
    {
      title: 'DISCOVER',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Internships', href: '/internships', icon: Compass },
      ],
    },
    {
      title: 'PREPARATION SUITE',
      items: [
        { name: 'Skill Gap Analysis', href: '/skill-gap', icon: GitCompare },
        { name: 'Learning Resources', href: '/learning', icon: BookOpen },
        { name: 'Resume Intelligence', href: '/resume', icon: FileText },
        { name: 'Aptitude Practice', href: '/aptitude', icon: HelpCircle },
        { name: 'Mock Interview AI', href: '/interview', icon: MessageSquare },
      ],
    },
    {
      title: 'CAREER TRACKER',
      items: [
        { name: 'My Watchlist', href: '/watchlist', icon: Bookmark },
        { name: 'Applications Tracker', href: '/applications', icon: Briefcase },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={onCloseMobile}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              InternPilot<span style={{ color: '#60a5fa' }}> AI</span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Career Operating System</div>
          </div>
        </Link>
        {onCloseMobile && (
          <button onClick={onCloseMobile} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Target Internship Context Pill */}
      {activeInternship && (
        <div style={{ margin: '16px 16px 4px', padding: '12px', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Target size={12} /> Target Context
            </span>
            <button
              onClick={() => setActiveInternship(null)}
              title="Clear active context"
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Clear
            </button>
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeInternship.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeInternship.company}
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {navSections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 12px 6px' }}>
              {section.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? '#ffffff' : '#94a3b8' }} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', backgroundColor: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
            {profile.name ? profile.name[0] : 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile.name || 'Student'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || 'Authenticated'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
