/**
 * Common formatting and UI utility functions
 */

const AVATAR_COLORS = [
  'linear-gradient(135deg, #4f46e5, #7c3aed)',
  'linear-gradient(135deg, #0ea5e9, #2563eb)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #14b8a6, #0d9488)',
  'linear-gradient(135deg, #f97316, #ea580c)',
];

export function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'ST';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export const DEFAULT_DEPARTMENTS = [
  'Computer Science',
  'Data Science',
  'Information Technology',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Biotechnology',
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];
