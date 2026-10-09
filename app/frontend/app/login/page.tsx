'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Lock,
  Mail,
  Key,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('demo.student@internpilot.ai');
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setError('Please provide a Supabase Access Token or use Quick Demo Sign-In.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(tokenInput.trim(), email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify token.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login('demo-token-intern', 'alex.rivera@internpilot.ai');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '32px' }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            InternPilot<span style={{ color: '#2563eb' }}> AI</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Sign in to access your personalized career operating system
          </p>
        </div>

        {error && (
          <div className="error-banner" style={{ marginBottom: '20px' }}>
            <div>{error}</div>
          </div>
        )}

        {/* Quick Demo Evaluation Button (Primary for testing/hackathons) */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Authenticating...' : 'One-Click Demo Candidate Login'}</span>
            <ArrowRight size={16} />
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
            * Connects immediately to FastAPI backend via /api/auth/me
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
            OR Custom Supabase Session
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Custom Bearer Token Form */}
        <form onSubmit={handleCustomLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label className="label">Student Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="input"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '34px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <label className="label">Supabase Access Token</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="input"
                  placeholder="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  style={{ paddingLeft: '34px' }}
                />
                <Key size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Attached automatically as Authorization: Bearer &lt;TOKEN&gt;
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Lock size={15} />
            <span>Sign In with Access Token</span>
          </button>
        </form>
      </div>
    </div>
  );
}
