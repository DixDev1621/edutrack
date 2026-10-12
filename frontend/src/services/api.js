/**
 * API Service for Student Management System
 * Communicates with the Express backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Handle API responses and throw informative errors
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = data?.message || (data?.errors && data.errors.join(', ')) || `HTTP error! Status: ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse(res);
  },

  /**
   * Fetch all students with query filters
   * @param {Object} params - { search, department, status, sortBy, order }
   */
  async getStudents(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${BASE_URL}/students${queryString}`);
    return handleResponse(res);
  },

  /**
   * Fetch student stats overview
   */
  async getStats() {
    const res = await fetch(`${BASE_URL}/students/stats`);
    return handleResponse(res);
  },

  /**
   * Fetch single student by ID
   */
  async getStudentById(id) {
    const res = await fetch(`${BASE_URL}/students/${id}`);
    return handleResponse(res);
  },

  /**
   * Register a new student
   */
  async createStudent(studentData) {
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  /**
   * Update existing student
   */
  async updateStudent(id, studentData) {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  /**
   * Delete student record
   */
  async deleteStudent(id) {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  /**
   * Reset / Seed sample students
   */
  async seedStudents() {
    const res = await fetch(`${BASE_URL}/students/seed`, {
      method: 'POST',
    });
    return handleResponse(res);
  },
};
