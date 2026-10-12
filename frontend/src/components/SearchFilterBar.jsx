import React from 'react';
import { Search, X, LayoutGrid, ListFilter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  department,
  onDepartmentChange,
  departmentsList,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <div className="filter-card">
      <div className="filter-grid">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by student name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="student-search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Department Filter */}
        <div className="filter-item">
          <select
            className="form-control"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            aria-label="Filter by Department"
          >
            <option value="All">All Departments</option>
            {departmentsList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-item">
          <select
            className="form-control"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="filter-item">
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            aria-label="Sort By"
          >
            <option value="id-desc">Newest First</option>
            <option value="id-asc">Oldest First</option>
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="roll_number-asc">Roll No (Ascending)</option>
            <option value="gpa-desc">GPA (Highest First)</option>
          </select>
        </div>

        {/* View Mode & Reset Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {hasActiveFilters && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onResetFilters}
              title="Reset all search and filter conditions"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
            >
              <ListFilter size={15} />
              <span className="hidden-mobile">Table</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Cards Grid View"
            >
              <LayoutGrid size={15} />
              <span className="hidden-mobile">Cards</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
