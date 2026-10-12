import React from 'react';
import { GraduationCap, Plus, RefreshCw, Database } from 'lucide-react';

export default function Navbar({
  apiOnline,
  onOpenAddModal,
  onRefresh,
  onSeedData,
  isRefreshing,
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="brand">
          <div className="brand-icon-wrapper">
            <GraduationCap size={24} />
          </div>
          <div className="brand-info">
            <h1>EduTrack</h1>
            <span>Student Management System</span>
          </div>
        </a>

        <div className="navbar-actions">
          {/* Health indicator badge */}
          <div
            className={`health-badge ${apiOnline ? 'online' : 'offline'}`}
            title={apiOnline ? 'Backend API connected' : 'Backend API unavailable'}
          >
            <span className={`pulse-dot ${apiOnline ? 'online' : 'offline'}`} />
            <span>{apiOnline ? 'API Online' : 'API Offline'}</span>
          </div>

          {/* Quick Refresh */}
          <button
            className="btn btn-secondary btn-icon-only"
            onClick={onRefresh}
            title="Refresh student list"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spinner-dark' : ''} />
          </button>

          {/* Seed demo data */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onSeedData}
            title="Populate or restore sample student data"
          >
            <Database size={15} />
            <span className="hidden-mobile">Reset Demo Data</span>
          </button>

          {/* Register student CTA */}
          <button
            className="btn btn-primary"
            onClick={onOpenAddModal}
            id="register-student-button"
          >
            <Plus size={17} />
            <span>Register Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
