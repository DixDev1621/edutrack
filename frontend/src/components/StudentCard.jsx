import React from 'react';
import { Eye, Edit3, Trash2, Mail, Phone, Calendar, BookOpen, Award } from 'lucide-react';
import { getAvatarColor, getInitials, formatDate } from '../utils/helpers';

export default function StudentCard({
  student,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
}) {
  const statusClass =
    student.status === 'Active'
      ? 'badge-active'
      : student.status === 'Graduated'
      ? 'badge-graduated'
      : 'badge-inactive';

  return (
    <div className="student-card">
      <div>
        <div className="card-header-top">
          <div className="card-student-info">
            <div
              className="avatar"
              style={{ background: getAvatarColor(student.name) }}
            >
              {getInitials(student.name)}
            </div>
            <div>
              <div className="card-student-name">{student.name}</div>
              <span className="badge badge-roll" style={{ marginTop: '0.2rem' }}>
                {student.rollNumber}
              </span>
            </div>
          </div>
          <span className={`badge ${statusClass}`}>{student.status}</span>
        </div>

        <div className="card-details-list">
          <div className="card-detail-item">
            <BookOpen size={14} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {student.department}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>• {student.semester}</span>
          </div>

          <div className="card-detail-item">
            <Mail size={14} />
            <span>{student.email}</span>
          </div>

          {student.phone && (
            <div className="card-detail-item">
              <Phone size={14} />
              <span>{student.phone}</span>
            </div>
          )}

          <div className="card-detail-item">
            <Calendar size={14} />
            <span>Enrolled: {formatDate(student.admissionDate)}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div>
          {student.gpa !== null && student.gpa !== undefined ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={14} style={{ color: 'var(--primary)' }} />
              <span
                className={`badge badge-gpa ${
                  student.gpa >= 3.5 ? 'gpa-high' : ''
                }`}
              >
                GPA: {Number(student.gpa).toFixed(2)}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              GPA: N/A
            </span>
          )}
        </div>

        <div className="actions-cell">
          <button
            className="btn-action view"
            title="View details"
            onClick={() => onViewStudent(student)}
          >
            <Eye size={16} />
          </button>
          <button
            className="btn-action edit"
            title="Edit student"
            onClick={() => onEditStudent(student)}
          >
            <Edit3 size={16} />
          </button>
          <button
            className="btn-action delete"
            title="Delete student"
            onClick={() => onDeleteStudent(student)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
