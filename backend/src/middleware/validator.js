/**
 * Input validation middleware for student operations
 */

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validateStudentInput(req, res, next) {
  const {
    name,
    rollNumber,
    roll_number,
    email,
    department,
    semester,
    gpa,
    status
  } = req.body;

  const actualRollNumber = (rollNumber || roll_number || '').trim();
  const actualName = (name || '').trim();
  const actualEmail = (email || '').trim();
  const actualDepartment = (department || '').trim();
  const actualSemester = (semester || '').trim();

  const errors = [];

  // Required fields
  if (!actualName || actualName.length < 2) {
    errors.push('Student name is required and must be at least 2 characters.');
  }

  if (!actualRollNumber) {
    errors.push('Roll number / Student ID is required.');
  }

  if (!actualEmail) {
    errors.push('Email address is required.');
  } else if (!validateEmail(actualEmail)) {
    errors.push('Please enter a valid email address.');
  }

  if (!actualDepartment) {
    errors.push('Department / Course is required.');
  }

  if (!actualSemester) {
    errors.push('Semester / Academic year is required.');
  }

  // GPA validation if provided
  if (gpa !== undefined && gpa !== null && gpa !== '') {
    const numericGpa = parseFloat(gpa);
    if (isNaN(numericGpa) || numericGpa < 0 || numericGpa > 4.0) {
      errors.push('GPA must be a valid number between 0.00 and 4.00.');
    }
  }

  // Status validation if provided
  if (status && !['Active', 'Inactive', 'Graduated'].includes(status)) {
    errors.push('Status must be one of: Active, Inactive, Graduated.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Normalize request body
  req.body.name = actualName;
  req.body.rollNumber = actualRollNumber;
  req.body.email = actualEmail.toLowerCase();
  req.body.department = actualDepartment;
  req.body.semester = actualSemester;
  req.body.status = status || 'Active';
  if (gpa !== undefined && gpa !== null && gpa !== '') {
    req.body.gpa = parseFloat(gpa);
  }

  next();
}

module.exports = {
  validateStudentInput,
  validateEmail
};
