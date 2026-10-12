import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import SearchFilterBar from './components/SearchFilterBar';
import StudentTable from './components/StudentTable';
import StudentCard from './components/StudentCard';
import StudentModal from './components/StudentModal';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { DEFAULT_DEPARTMENTS } from './utils/helpers';
import { Plus, UserPlus, RefreshCw } from 'lucide-react';

export default function App() {
  // Data States
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('id-desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check API health
  const checkHealth = useCallback(async () => {
    try {
      await api.checkHealth();
      setApiOnline(true);
    } catch {
      setApiOnline(false);
    }
  }, []);

  // Fetch Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      if (res && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Could not load stats:', err);
    }
  }, []);

  // Fetch Students
  const loadStudents = useCallback(async () => {
    try {
      const [field, order] = sortBy.split('-');
      const res = await api.getStudents({
        search: searchQuery,
        department: selectedDepartment,
        status: selectedStatus,
        sortBy: field,
        order: order || 'desc',
      });
      if (res && res.data) {
        setStudents(res.data);
      }
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      addToast(err.message || 'Failed to fetch students from backend', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedDepartment, selectedStatus, sortBy, addToast]);

  // Initial load
  useEffect(() => {
    checkHealth();
    loadStats();
    loadStudents();
  }, []);

  // Reload students on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDepartment, selectedStatus, sortBy]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([checkHealth(), loadStats(), loadStudents()]);
    addToast('Student records refreshed.', 'info');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedStatus('All');
    setSortBy('id-desc');
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedDepartment !== 'All' ||
    selectedStatus !== 'All' ||
    sortBy !== 'id-desc'
  );

  // Departments list from stats or fallback
  const departmentsList = useMemo(() => {
    if (stats?.byDepartment?.length) {
      const fromStats = stats.byDepartment.map((d) => d.department);
      return Array.from(new Set([...DEFAULT_DEPARTMENTS, ...fromStats]));
    }
    return DEFAULT_DEPARTMENTS;
  }, [stats]);

  // Modal Triggers
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setIsAddEditModalOpen(true);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setEditingStudent(null);
  };

  // Create or Update Submit
  const handleSaveStudent = async (studentData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        // Update
        const res = await api.updateStudent(editingStudent.id, studentData);
        addToast(res.message || 'Student updated successfully!', 'success');
      } else {
        // Create
        const res = await api.createStudent(studentData);
        addToast(res.message || 'Student registered successfully!', 'success');
      }
      setIsAddEditModalOpen(false);
      setEditingStudent(null);
      await Promise.all([loadStudents(), loadStats()]);
    } catch (err) {
      throw err; // Handled inside StudentModal
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Student
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteStudent(deletingStudent.id);
      addToast(res.message || 'Student deleted successfully', 'success');
      setDeletingStudent(null);
      await Promise.all([loadStudents(), loadStats()]);
    } catch (err) {
      addToast(err.message || 'Failed to delete student.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Seed sample data
  const handleSeedData = async () => {
    try {
      const res = await api.seedStudents();
      addToast(res.message || 'Sample students loaded!', 'success');
      handleResetFilters();
      await Promise.all([loadStudents(), loadStats()]);
    } catch (err) {
      addToast(err.message || 'Failed to seed sample data.', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        apiOnline={apiOnline}
        onOpenAddModal={handleOpenAddModal}
        onRefresh={handleRefresh}
        onSeedData={handleSeedData}
        isRefreshing={isRefreshing}
      />

      <main className="main-content">
        {/* Page Hero Header */}
        <div className="page-hero">
          <div className="page-hero-title">
            <h2>Student Directory & Records</h2>
            <p>
              Manage admissions, search student profiles, track academic status, and update records.
            </p>
          </div>
          <div className="page-hero-actions">
            <button
              className="btn btn-primary"
              onClick={handleOpenAddModal}
            >
              <UserPlus size={16} />
              <span>Add New Student</span>
            </button>
          </div>
        </div>

        {/* Stats & Department quick filters */}
        <StatsOverview
          stats={stats}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={(dept) => setSelectedDepartment(dept)}
        />

        {/* Search, Filter, Sort, and View bar */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          department={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departmentsList={departmentsList}
          status={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Main Content Area */}
        {loading ? (
          <div
            style={{
              padding: '4rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading student records...</p>
          </div>
        ) : viewMode === 'table' ? (
          <StudentTable
            students={students}
            onViewStudent={(student) => setViewingStudent(student)}
            onEditStudent={handleOpenEditModal}
            onDeleteStudent={(student) => setDeletingStudent(student)}
            onOpenAddModal={handleOpenAddModal}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        ) : (
          <div>
            {students.length === 0 ? (
              <StudentTable
                students={[]}
                onViewStudent={() => {}}
                onEditStudent={() => {}}
                onDeleteStudent={() => {}}
                onOpenAddModal={handleOpenAddModal}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            ) : (
              <div className="cards-grid">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onViewStudent={(s) => setViewingStudent(s)}
                    onEditStudent={handleOpenEditModal}
                    onDeleteStudent={(s) => setDeletingStudent(s)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <StudentModal
        isOpen={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        onSubmit={handleSaveStudent}
        student={editingStudent}
        isSubmitting={isSubmitting}
      />

      <StudentDetailModal
        isOpen={Boolean(viewingStudent)}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        onEditStudent={handleOpenEditModal}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
        student={deletingStudent}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>EduTrack Student Management System</strong> • Full-Stack Web Application
          </div>
          <div>
            Backend: Express + SQLite • Frontend: React + Vite • Ready for Vercel & Render
          </div>
        </div>
      </footer>
    </div>
  );
}
