import React from 'react';
import { Eye, Edit3, Trash2, Mail, Phone, Calendar, UserX } from 'lucide-react';
import { getAvatarColor, getInitials, formatDate } from '../utils/helpers';

export default function StudentTable({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenAddModal,
  onResetFilters,
  hasActiveFilters,
}) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrapper">
          <UserX size={32} />
        </div>
        <h3>No students found</h3>
        <p>
          {hasActiveFilters
            ? 'No students matched your current search filters. Try adjusting or clearing your search.'
            : 'Your database is currently empty. Start by adding your first student!'}
        </p>
        <div className="empty-actions">
          {hasActiveFilters ? (
            <button className="btn btn-secondary" onClick={onResetFilters}>
              Reset Filters
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAddModal}>
              Register New Student
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll Number</th>
              <th>Department / Semester</th>
              <th>GPA</th>
              <th>Status</th>
              <th>Enrolled</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const statusClass =
                student.status === 'Active'
                  ? 'badge-active'
                  : student.status === 'Graduated'
                  ? 'badge-graduated'
                  : 'badge-inactive';

              return (
                <tr key={student.id}>
                  {/* Student Name & Avatar */}
                  <td>
                    <div className="student-cell-profile">
                      <div
                        className="avatar"
                        style={{ background: getAvatarColor(student.name) }}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <div className="student-meta-name">{student.name}</div>
                        <div className="student-meta-sub">
                          <Mail size={12} />
                          <span>{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="student-meta-sub">
                            <Phone size={12} />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Roll Number */}
                  <td>
                    <span className="badge badge-roll">{student.rollNumber}</span>
                  </td>

                  {/* Department & Semester */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span className="badge badge-dept">{student.department}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {student.semester}
                      </span>
                    </div>
                  </td>

                  {/* GPA */}
                  <td>
                    {student.gpa !== null && student.gpa !== undefined ? (
                      <span
                        className={`badge badge-gpa ${
                          student.gpa >= 3.5 ? 'gpa-high' : ''
                        }`}
                      >
                        {Number(student.gpa).toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`badge ${statusClass}`}>{student.status}</span>
                  </td>

                  {/* Admission Date */}
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(student.admissionDate)}</span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn-action view"
                        title="View student profile"
                        onClick={() => onViewStudent(student)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-action edit"
                        title="Edit student details"
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
