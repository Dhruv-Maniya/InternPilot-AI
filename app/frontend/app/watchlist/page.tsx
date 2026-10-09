'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Trash2,
  Target,
  ExternalLink,
  Briefcase,
  Clock,
  RotateCw,
  Compass
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { watchlistApi, applicationsApi } from '@/lib/api';
import { WatchlistItem } from '@/types';

export default function WatchlistPage() {
  const { setActiveInternship, showToast, refreshDeadlines } = useAuth();

  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await watchlistApi.getAll();
      if (res && res.items) {
        setItems(res.items);
      } else {
        setItems([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load watchlist.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (internshipId: string) => {
    setDeletingId(internshipId);
    try {
      await watchlistApi.remove(internshipId);
      setItems((prev) => prev.filter((item) => item.internship_id !== internshipId));
      showToast('Internship removed from watchlist.', 'info');
      refreshDeadlines();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove internship.';
      showToast(msg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTrackApplication = async (item: WatchlistItem) => {
    setTrackingId(item.internship_id);
    try {
      const appId = `app-${Date.now().toString(36)}`;
      await applicationsApi.create({
        application_id: appId,
        internship_id: item.internship_id,
        title: item.title,
        company: item.company,
        application_url: item.application_url,
        status: 'Applied',
      });
      showToast(`Added "${item.title}" to Applications tracker!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not track application.';
      showToast(msg, 'error');
    } finally {
      setTrackingId(null);
    }
  };

  const handleSetTargetAndPrep = (item: WatchlistItem) => {
    setActiveInternship({
      title: item.title,
      company: item.company,
      location: item.location,
      url: item.application_url,
      required_skills: ['Python', 'SQL', 'Pandas'],
      preferred_skills: ['Power BI'],
      matched_skills: ['Python'],
      missing_skills: ['SQL', 'Pandas'],
      skills_to_learn: ['SQL', 'Pandas'],
      match_percentage: 80.0,
      requirements_found: true,
      eligibility: 'Likely Entry-Level',
      recommendation_priority: 0,
    });
    showToast(`Set "${item.title}" as active preparation target!`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">Saved Opportunities</span>
            <span className="badge badge-neutral">GET /api/watchlist</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            My Internship Watchlist
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Your saved opportunities, monitored deadlines, and quick preparation launchpad.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchWatchlist}
            disabled={loading}
            className="btn btn-secondary"
          >
            <RotateCw size={15} className={loading ? 'loading-skeleton' : ''} />
            <span>Refresh</span>
          </button>
          <Link href="/internships" className="btn btn-primary">
            <Compass size={15} />
            <span>Explore More</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={fetchWatchlist}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card loading-skeleton" style={{ height: '180px' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card empty-state">
          <Bookmark className="empty-icon" />
          <h3 className="empty-title">Your Watchlist is Empty</h3>
          <p className="empty-desc">
            Save internships you are interested in and they will appear here for easy deadline tracking and preparation.
          </p>
          <Link href="/internships" className="btn btn-primary">
            Find Internships to Save
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {items.map((item) => (
            <div
              key={item.internship_id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-primary">Watchlist Item</span>
                  {item.deadline && (
                    <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>
                      <Clock size={10} style={{ marginRight: '2px' }} />
                      Deadline: {item.deadline}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '4px' }}>
                  {item.company}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '16px' }}>
                  📍 {item.location}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href="/skill-gap"
                    onClick={() => handleSetTargetAndPrep(item)}
                    className="btn btn-sm btn-primary"
                    style={{ flex: 1 }}
                  >
                    <Target size={13} />
                    <span>Prepare Workspace</span>
                  </Link>

                  <button
                    onClick={() => handleTrackApplication(item)}
                    disabled={trackingId === item.internship_id}
                    className="btn btn-sm btn-secondary"
                    title="Move to Applications Tracker"
                  >
                    <Briefcase size={13} />
                    <span>Track</span>
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  {item.application_url ? (
                    <a
                      href={item.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>External Link</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : <div />}

                  <button
                    onClick={() => handleRemove(item.internship_id)}
                    disabled={deletingId === item.internship_id}
                    className="btn btn-sm btn-danger"
                    title="Remove from watchlist"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
