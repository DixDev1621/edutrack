import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { DEFAULT_DEPARTMENTS, SEMESTERS } from '../utils/helpers';

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  student, // null if creating, object if editing
  isSubmitting,
}) {
  const isEditing = Boolean(student && student.id);

  const initialFormState = {
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    semester: 'Semester 1',
    gpa: '',
    gender: 'Male',
    dateOfBirth: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    address: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        rollNumber: student.rollNumber || '',
        email: student.email || '',
        phone: student.phone || '',
        department: student.department || 'Computer Science',
        semester: student.semester || 'Semester 1',
        gpa: student.gpa !== null && student.gpa !== undefined ? String(student.gpa) : '',
        gender: student.gender || 'Male',
        dateOfBirth: student.dateOfBirth || '',
        admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
        status: student.status || 'Active',
        address: student.address || '',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
    setServerError('');
  }, [student, isOpen]);

  if (!isOpen) return null;

  function validate() {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full name is required (minimum 2 characters)';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll Number / Student ID is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }

    if (formData.gpa !== '' && formData.gpa !== null && formData.gpa !== undefined) {
      const gpaNum = parseFloat(formData.gpa);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
        newErrors.gpa = 'GPA must be between 0.00 and 4.00';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        gpa: formData.gpa !== '' ? parseFloat(formData.gpa) : null,
      });
    } catch (err) {
      setServerError(err.message || 'An error occurred while saving student details.');
    }
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h3 id="modal-title">
            {isEditing ? 'Edit Student Details' : 'Register New Student'}
          </h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {serverError && (
              <div className="form-alert danger">
                <AlertCircle size={18} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-name">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  id="student-name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alexander Hayes"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              {/* Roll Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-roll">
                  Roll Number / Student ID <span className="req">*</span>
                </label>
                <input
                  id="student-roll"
                  type="text"
                  className="form-control"
                  placeholder="e.g. CS2026-101"
                  value={formData.rollNumber}
                  onChange={(e) => handleChange('rollNumber', e.target.value)}
                  required
                />
                {errors.rollNumber && (
                  <span className="form-error-msg">{errors.rollNumber}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-email">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  id="student-email"
                  type="email"
                  className="form-control"
                  placeholder="alex.hayes@university.edu"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
                {errors.email && (
                  <span className="form-error-msg">{errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-phone">
                  Phone Number
                </label>
                <input
                  id="student-phone"
                  type="tel"
                  className="form-control"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-dept">
                  Department / Program <span className="req">*</span>
                </label>
                <select
                  id="student-dept"
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                >
                  {DEFAULT_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="form-error-msg">{errors.department}</span>
                )}
              </div>

              {/* Semester */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-sem">
                  Academic Semester <span className="req">*</span>
                </label>
                <select
                  id="student-sem"
                  className="form-control"
                  value={formData.semester}
                  onChange={(e) => handleChange('semester', e.target.value)}
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <span className="form-error-msg">{errors.semester}</span>
                )}
              </div>

              {/* GPA */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-gpa">
                  Cumulative GPA (0.00 – 4.00)
                </label>
                <input
                  id="student-gpa"
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="4.00"
                  className="form-control"
                  placeholder="e.g. 3.75"
                  value={formData.gpa}
                  onChange={(e) => handleChange('gpa', e.target.value)}
                />
                {errors.gpa && <span className="form-error-msg">{errors.gpa}</span>}
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-status">
                  Enrollment Status
                </label>
                <select
                  id="student-status"
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-gender">
                  Gender
                </label>
                <select
                  id="student-gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-dob">
                  Date of Birth
                </label>
                <input
                  id="student-dob"
                  type="date"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
              </div>

              {/* Admission Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-admission">
                  Admission Date <span className="req">*</span>
                </label>
                <input
                  id="student-admission"
                  type="date"
                  className="form-control"
                  value={formData.admissionDate}
                  onChange={(e) => handleChange('admissionDate', e.target.value)}
                  required
                />
              </div>

              {/* Address */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="student-address">
                  Residential / Campus Address
                </label>
                <input
                  id="student-address"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 104 Innovation Way, Tech Park"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  <span>Saving Student...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditing ? 'Update Student' : 'Register Student'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
