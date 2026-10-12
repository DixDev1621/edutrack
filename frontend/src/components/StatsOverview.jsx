import React from 'react';
import { Users, UserCheck, UserX, Award, BookOpen } from 'lucide-react';

export default function StatsOverview({
  stats,
  selectedDepartment,
  onSelectDepartment,
}) {
  const {
    totalStudents = 0,
    activeStudents = 0,
    inactiveStudents = 0,
    graduatedStudents = 0,
    averageGpa = 0.0,
    byDepartment = [],
  } = stats || {};

  return (
    <section className="stats-section" aria-label="Overview statistics">
      <div className="stats-grid">
        {/* Total Students */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{totalStudents}</span>
            <span className="stat-desc">Enrolled in database</span>
          </div>
          <div className="stat-icon primary">
            <Users size={22} />
          </div>
        </div>

        {/* Active Students */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Active Students</span>
            <span className="stat-value">{activeStudents}</span>
            <span className="stat-desc">Currently studying</span>
          </div>
          <div className="stat-icon success">
            <UserCheck size={22} />
          </div>
        </div>

        {/* Inactive / Leave */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Inactive</span>
            <span className="stat-value">{inactiveStudents}</span>
            <span className="stat-desc">On leave / paused</span>
          </div>
          <div className="stat-icon warning">
            <UserX size={22} />
          </div>
        </div>

        {/* Graduated */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Graduated</span>
            <span className="stat-value">{graduatedStudents}</span>
            <span className="stat-desc">Alumni completed</span>
          </div>
          <div className="stat-icon purple">
            <Award size={22} />
          </div>
        </div>

        {/* Average GPA */}
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Average GPA</span>
            <span className="stat-value">{averageGpa.toFixed(2)}</span>
            <span className="stat-desc">Scale of 4.00</span>
          </div>
          <div className="stat-icon primary">
            <BookOpen size={22} />
          </div>
        </div>
      </div>

      {/* Quick filter department chips */}
      {byDepartment.length > 0 && (
        <div className="dept-chips" role="tablist" aria-label="Filter by department">
          <button
            className={`dept-chip ${selectedDepartment === 'All' ? 'active' : ''}`}
            onClick={() => onSelectDepartment('All')}
          >
            <span>All Departments</span>
            <span className="dept-chip-count">{totalStudents}</span>
          </button>

          {byDepartment.map((item) => (
            <button
              key={item.department}
              className={`dept-chip ${selectedDepartment === item.department ? 'active' : ''}`}
              onClick={() => onSelectDepartment(item.department)}
            >
              <span>{item.department}</span>
              <span className="dept-chip-count">{item.count}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
