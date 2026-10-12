import React from 'react';
import { X, Edit3, Mail, Phone, Calendar, MapPin, Award, BookOpen, Clock } from 'lucide-react';
import { getAvatarColor, getInitials, formatDate } from '../utils/helpers';

export default function StudentDetailModal({
  isOpen,
  onClose,
  student,
  onEditStudent,
}) {
  if (!isOpen || !student) return null;

  const statusClass =
    student.status === 'Active'
      ? 'badge-active'
      : student.status === 'Graduated'
      ? 'badge-graduated'
      : 'badge-inactive';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <div className="modal-header">
          <h3 id="detail-title">Student Profile</h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Profile */}
          <div className="detail-profile-header">
            <div
              className="avatar lg"
              style={{ background: getAvatarColor(student.name) }}
            >
              {getInitials(student.name)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{student.name}</h2>
                <span className={`badge ${statusClass}`}>{student.status}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem' }}>
                <span className="badge badge-roll">{student.rollNumber}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {student.department} • {student.semester}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="detail-info-grid">
            <div className="detail-item">
              <span className="detail-item-label">Email Address</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{student.email}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Phone Number</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{student.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Department / Major</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{student.department}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Academic Semester</span>
              <div className="detail-item-value">
                <span>{student.semester}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Cumulative GPA</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={15} style={{ color: 'var(--primary)' }} />
                <span>
                  {student.gpa !== null && student.gpa !== undefined
                    ? `${Number(student.gpa).toFixed(2)} / 4.00`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Gender</span>
              <div className="detail-item-value">
                <span>{student.gender || 'Not specified'}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Date of Birth</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{formatDate(student.dateOfBirth)}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-item-label">Admission Date</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{formatDate(student.admissionDate)}</span>
              </div>
            </div>

            <div className="detail-item" style={{ gridColumn: 'span 2' }}>
              <span className="detail-item-label">Address</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{student.address || 'No address provided'}</span>
              </div>
            </div>

            <div className="detail-item" style={{ gridColumn: 'span 2' }}>
              <span className="detail-item-label">System Record Created</span>
              <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Clock size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{student.createdAt || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEditStudent(student);
            }}
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
