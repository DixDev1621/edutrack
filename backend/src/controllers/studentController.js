const { getDatabase, initialStudents } = require('../config/db');

// Helper to format student record from DB (snake_case) to client camelCase
function formatStudent(row) {
  if (!row) return null;
  return {
    id: row.id,
    rollNumber: row.roll_number,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    department: row.department,
    semester: row.semester,
    gpa: row.gpa !== null && row.gpa !== undefined ? Number(row.gpa) : null,
    gender: row.gender || '',
    dateOfBirth: row.date_of_birth || '',
    admissionDate: row.admission_date || '',
    status: row.status || 'Active',
    address: row.address || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * GET /api/students
 * Retrieve all students with optional search, filtering, and sorting
 */
async function getAllStudents(req, res, next) {
  try {
    const db = getDatabase();
    const { search, department, status, sortBy = 'id', order = 'DESC' } = req.query;

    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];

    // Search by name or roll number
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ' AND (name LIKE ? OR roll_number LIKE ? OR email LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter by department
    if (department && department !== 'All') {
      query += ' AND department = ?';
      params.push(department);
    }

    // Filter by status
    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    // Safe sorting fields mapping
    const validSortFields = {
      id: 'id',
      name: 'name',
      rollNumber: 'roll_number',
      roll_number: 'roll_number',
      department: 'department',
      gpa: 'gpa',
      admissionDate: 'admission_date',
      admission_date: 'admission_date',
      status: 'status'
    };

    const sortColumn = validSortFields[sortBy] || 'id';
    const sortDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortColumn} ${sortDirection}`;

    const rows = await db.all(query, params);
    const students = rows.map(formatStudent);

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/students/stats
 * Summary statistics for the dashboard
 */
async function getStudentStats(req, res, next) {
  try {
    const db = getDatabase();

    const totalRow = await db.get('SELECT COUNT(*) as total FROM students');
    const activeRow = await db.get("SELECT COUNT(*) as active FROM students WHERE status = 'Active'");
    const inactiveRow = await db.get("SELECT COUNT(*) as inactive FROM students WHERE status = 'Inactive'");
    const graduatedRow = await db.get("SELECT COUNT(*) as graduated FROM students WHERE status = 'Graduated'");
    const avgGpaRow = await db.get('SELECT AVG(gpa) as avgGpa FROM students WHERE gpa > 0');

    const departmentRows = await db.all(`
      SELECT department, COUNT(*) as count 
      FROM students 
      GROUP BY department 
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      stats: {
        totalStudents: totalRow ? totalRow.total : 0,
        activeStudents: activeRow ? activeRow.active : 0,
        inactiveStudents: inactiveRow ? inactiveRow.inactive : 0,
        graduatedStudents: graduatedRow ? graduatedRow.graduated : 0,
        averageGpa: avgGpaRow && avgGpaRow.avgGpa ? Number(avgGpaRow.avgGpa.toFixed(2)) : 0.0,
        byDepartment: departmentRows
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/students/:id
 * Retrieve a single student by ID
 */
async function getStudentById(req, res, next) {
  try {
    const db = getDatabase();
    const { id } = req.params;

    const row = await db.get('SELECT * FROM students WHERE id = ?', [id]);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    res.json({
      success: true,
      data: formatStudent(row)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/students
 * Register a new student
 */
async function createStudent(req, res, next) {
  try {
    const db = getDatabase();
    const {
      rollNumber,
      name,
      email,
      phone,
      department,
      semester,
      gpa = 0.0,
      gender,
      dateOfBirth,
      admissionDate,
      status = 'Active',
      address
    } = req.body;

    // Check duplicate roll number
    const existingRoll = await db.get('SELECT id FROM students WHERE LOWER(roll_number) = LOWER(?)', [rollNumber]);
    if (existingRoll) {
      return res.status(409).json({
        success: false,
        message: `Roll number '${rollNumber}' is already registered to another student.`
      });
    }

    // Check duplicate email
    const existingEmail = await db.get('SELECT id FROM students WHERE LOWER(email) = LOWER(?)', [email]);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Email address '${email}' is already registered.`
      });
    }

    const effectiveAdmissionDate = admissionDate || new Date().toISOString().split('T')[0];

    const result = await db.run(`
      INSERT INTO students (
        roll_number, name, email, phone, department, semester, gpa, gender, date_of_birth, admission_date, status, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      rollNumber,
      name,
      email,
      phone || null,
      department,
      semester,
      gpa || 0.0,
      gender || null,
      dateOfBirth || null,
      effectiveAdmissionDate,
      status || 'Active',
      address || null
    ]);

    const createdStudent = await db.get('SELECT * FROM students WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully!',
      data: formatStudent(createdStudent)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/students/:id
 * Update existing student details
 */
async function updateStudent(req, res, next) {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const {
      rollNumber,
      name,
      email,
      phone,
      department,
      semester,
      gpa,
      gender,
      dateOfBirth,
      admissionDate,
      status,
      address
    } = req.body;

    const existingStudent = await db.get('SELECT * FROM students WHERE id = ?', [id]);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    // Check unique roll number if modified
    if (rollNumber && rollNumber.toLowerCase() !== existingStudent.roll_number.toLowerCase()) {
      const duplicateRoll = await db.get(
        'SELECT id FROM students WHERE LOWER(roll_number) = LOWER(?) AND id != ?',
        [rollNumber, id]
      );
      if (duplicateRoll) {
        return res.status(409).json({
          success: false,
          message: `Roll number '${rollNumber}' is already used by another student.`
        });
      }
    }

    // Check unique email if modified
    if (email && email.toLowerCase() !== existingStudent.email.toLowerCase()) {
      const duplicateEmail = await db.get(
        'SELECT id FROM students WHERE LOWER(email) = LOWER(?) AND id != ?',
        [email, id]
      );
      if (duplicateEmail) {
        return res.status(409).json({
          success: false,
          message: `Email address '${email}' is already registered to another student.`
        });
      }
    }

    await db.run(`
      UPDATE students SET
        roll_number = ?,
        name = ?,
        email = ?,
        phone = ?,
        department = ?,
        semester = ?,
        gpa = ?,
        gender = ?,
        date_of_birth = ?,
        admission_date = ?,
        status = ?,
        address = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      rollNumber || existingStudent.roll_number,
      name || existingStudent.name,
      email || existingStudent.email,
      phone !== undefined ? phone : existingStudent.phone,
      department || existingStudent.department,
      semester || existingStudent.semester,
      gpa !== undefined ? gpa : existingStudent.gpa,
      gender !== undefined ? gender : existingStudent.gender,
      dateOfBirth !== undefined ? dateOfBirth : existingStudent.date_of_birth,
      admissionDate || existingStudent.admission_date,
      status || existingStudent.status,
      address !== undefined ? address : existingStudent.address,
      id
    ]);

    const updatedStudent = await db.get('SELECT * FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Student record updated successfully!',
      data: formatStudent(updatedStudent)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/students/:id
 * Delete a student record
 */
async function deleteStudent(req, res, next) {
  try {
    const db = getDatabase();
    const { id } = req.params;

    const student = await db.get('SELECT * FROM students WHERE id = ?', [id]);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    await db.run('DELETE FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Student '${student.name}' (Roll No: ${student.roll_number}) has been removed.`
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/students/seed
 * Restore or seed default demo students
 */
async function seedStudents(req, res, next) {
  try {
    const db = getDatabase();
    
    // Clear and re-populate
    await db.run('DELETE FROM students');
    
    const insertStmt = await db.prepare(`
      INSERT INTO students (
        roll_number, name, email, phone, department, semester, gpa, gender, date_of_birth, admission_date, status, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const student of initialStudents) {
      await insertStmt.run(
        student.roll_number,
        student.name,
        student.email,
        student.phone,
        student.department,
        student.semester,
        student.gpa,
        student.gender,
        student.date_of_birth,
        student.admission_date,
        student.status,
        student.address
      );
    }
    await insertStmt.finalize();

    const all = await db.all('SELECT * FROM students ORDER BY id ASC');

    res.json({
      success: true,
      message: `Reset and seeded ${initialStudents.length} sample student records successfully!`,
      data: all.map(formatStudent)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllStudents,
  getStudentStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  seedStudents
};
