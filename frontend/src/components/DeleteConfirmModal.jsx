import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  student,
  isDeleting,
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-danger"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 id="delete-dialog-title">Delete Student</h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isDeleting}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Are you sure you want to delete the student record for:
          </p>
          <div
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              margin: '0.85rem 0',
              border: '1px solid var(--border-color)',
            }}
          >
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-primary)' }}>
              {student.name}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Roll Number: <code style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{student.rollNumber}</code> • {student.department}
            </span>
          </div>
          <p style={{ color: 'var(--danger)', fontSize: '0.825rem', fontWeight: 500 }}>
            This action cannot be undone. All student records will be removed from the database.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Student</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
