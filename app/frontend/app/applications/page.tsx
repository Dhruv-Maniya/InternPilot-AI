'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  LayoutGrid,
  List,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { applicationsApi } from '@/lib/api';
import { ApplicationItem, ApplicationStatus } from '@/types';

const STAGES: ApplicationStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

export default function ApplicationsPage() {
  const { showToast } = useAuth();

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // New Application Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Applied');
  const [creating, setCreating] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<ApplicationItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationsApi.getAll();
      if (res && res.applications) {
        setApplications(res.applications);
      } else {
        setApplications([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load applications.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) {
      showToast('Title and Company are required.', 'error');
      return;
    }

    setCreating(true);
    try {
      const appId = `app-${Date.now().toString(36)}`;
      const created = await applicationsApi.create({
        application_id: appId,
        internship_id: `intern-${Date.now().toString(36)}`,
        title: newTitle.trim(),
        company: newCompany.trim(),
        application_url: newUrl.trim() || 'https://google.com',
        status: newStatus,
      });

      setApplications((prev) => [created, ...prev]);
      showToast(`Tracked application for "${created.title}"!`, 'success');
      setShowCreateModal(false);
      setNewTitle('');
      setNewCompany('');
      setNewUrl('');
      setNewStatus('Applied');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create application.';
      showToast(msg, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatusVal: string) => {
    try {
      const updated = await applicationsApi.updateStatus(applicationId, newStatusVal);
      setApplications((prev) =>
        prev.map((app) => (app.application_id === applicationId ? updated : app))
      );
      showToast(`Status updated to "${newStatusVal}"`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status.';
      showToast(msg, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await applicationsApi.delete(deleteTarget.application_id);
      setApplications((prev) =>
        prev.filter((app) => app.application_id !== deleteTarget.application_id)
      );
      showToast('Application deleted successfully.', 'info');
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete application.';
      showToast(msg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">Pipeline Management</span>
            <span className="badge badge-neutral">GET /api/applications</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Applications Tracker
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Track application progress through all hiring stages with instant status updates and metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'kanban' ? '#fff' : 'transparent',
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: viewMode === 'kanban' ? '#0f172a' : '#64748b',
              }}
            >
              <LayoutGrid size={14} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? '#fff' : 'transparent',
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: viewMode === 'table' ? '#0f172a' : '#64748b',
              }}
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Track Application</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <button className="btn btn-sm btn-secondary" onClick={fetchApplications}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="card loading-skeleton" style={{ height: '320px' }} />
      ) : applications.length === 0 ? (
        <div className="card empty-state">
          <Briefcase className="empty-icon" />
          <h3 className="empty-title">No Applications Tracked Yet</h3>
          <p className="empty-desc">
            Keep all your internship applications organized in one centralized pipeline from initial submission to final offer.
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            <span>Track Your First Application</span>
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {STAGES.map((stage) => {
            const stageApps = applications.filter(
              (a) => a.status.toLowerCase() === stage.toLowerCase()
            );

            const stageColors: Record<ApplicationStatus, { header: string; border: string }> = {
              Applied: { header: '#2563eb', border: '#bfdbfe' },
              Shortlisted: { header: '#8b5cf6', border: '#ddd6fe' },
              Interview: { header: '#f59e0b', border: '#fde68a' },
              Selected: { header: '#10b981', border: '#a7f3d0' },
              Rejected: { header: '#ef4444', border: '#fecaca' },
            };

            return (
              <div
                key={stage}
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  padding: '14px',
                  minHeight: '400px',
                  border: '1px solid #e2e8f0',
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: stageColors[stage].header,
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{stage}</span>
                  </div>
                  <span
                    className="badge badge-neutral"
                    style={{ backgroundColor: '#ffffff', fontWeight: 700 }}
                  >
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stageApps.map((app) => (
                    <div
                      key={app.application_id}
                      className="card"
                      style={{
                        padding: '14px',
                        backgroundColor: '#ffffff',
                        borderLeft: `3px solid ${stageColors[stage].header}`,
                      }}
                    >
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                        {app.title}
                      </h4>
                      <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '10px' }}>
                        {app.company}
                      </div>

                      {/* Status Selector Dropdown */}
                      <div style={{ marginBottom: '10px' }}>
                        <select
                          className="input"
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              Move to: {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Card Footer Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        {app.application_url ? (
                          <a
                            href={app.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.6875rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <span>Link</span>
                            <ExternalLink size={10} />
                          </a>
                        ) : <div />}

                        <button
                          onClick={() => setDeleteTarget(app)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                          title="Delete application"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Role Title</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Company</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Current Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Application ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.application_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>{app.title}</td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{app.company}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      className="input"
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px', width: '130px' }}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                    {app.application_id}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setDeleteTarget(app)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE APPLICATION MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>Track New Application</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleCreateApplication}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="label">Internship / Job Title *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g. Data Analyst Intern"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g. Microsoft, Razorpay, Swiggy"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Application URL (Optional)</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Initial Pipeline Stage</label>
                  <select
                    className="input"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  <span>{creating ? 'Saving...' : 'Add to Pipeline'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR DESTRUCTIVE DELETE */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>Delete Application</h3>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to remove your application record for <strong>{deleteTarget.title}</strong> at <strong>{deleteTarget.company}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                <span>{deleting ? 'Removing...' : 'Delete Application'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
