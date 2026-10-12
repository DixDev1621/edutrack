const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let dbInstance = null;

const initialStudents = [
  {
    roll_number: 'CS2026-001',
    name: 'Sophia Patel',
    email: 'sophia.patel@university.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    semester: 'Semester 6',
    gpa: 3.92,
    gender: 'Female',
    date_of_birth: '2004-03-15',
    admission_date: '2023-08-20',
    status: 'Active',
    address: '42 Campus Vista Ave, Innovation City'
  },
  {
    roll_number: 'CS2026-002',
    name: 'Ethan Alexander Walker',
    email: 'ethan.walker@university.edu',
    phone: '+1 (555) 345-6789',
    department: 'Computer Science',
    semester: 'Semester 4',
    gpa: 3.75,
    gender: 'Male',
    date_of_birth: '2005-07-22',
    admission_date: '2024-08-18',
    status: 'Active',
    address: '108 University Heights Blvd'
  },
  {
    roll_number: 'DS2026-015',
    name: 'Amina Al-Mansoor',
    email: 'amina.mansoor@university.edu',
    phone: '+1 (555) 456-7890',
    department: 'Data Science',
    semester: 'Semester 4',
    gpa: 3.88,
    gender: 'Female',
    date_of_birth: '2005-01-10',
    admission_date: '2024-08-18',
    status: 'Active',
    address: '77 Silicon Square, Tech Quarter'
  },
  {
    roll_number: 'ME2025-088',
    name: 'Marcus Liam Vance',
    email: 'marcus.vance@university.edu',
    phone: '+1 (555) 567-8901',
    department: 'Mechanical Engineering',
    semester: 'Semester 8',
    gpa: 3.45,
    gender: 'Male',
    date_of_birth: '2003-11-04',
    admission_date: '2022-08-25',
    status: 'Graduated',
    address: '15 Engineering Loop, East Campus'
  },
  {
    roll_number: 'EE2026-034',
    name: 'Chloe Isabella Chen',
    email: 'chloe.chen@university.edu',
    phone: '+1 (555) 678-9012',
    department: 'Electrical Engineering',
    semester: 'Semester 5',
    gpa: 3.68,
    gender: 'Female',
    date_of_birth: '2004-09-18',
    admission_date: '2023-08-20',
    status: 'Active',
    address: '94 Circuit Drive, West District'
  },
  {
    roll_number: 'BA2026-042',
    name: 'Lucas Gabriel Rossi',
    email: 'lucas.rossi@university.edu',
    phone: '+1 (555) 789-0123',
    department: 'Business Administration',
    semester: 'Semester 3',
    gpa: 3.15,
    gender: 'Male',
    date_of_birth: '2005-05-30',
    admission_date: '2025-01-15',
    status: 'Inactive',
    address: '312 Downtown Plaza, Suite 4B'
  }
];

async function initializeDatabase() {
  if (dbInstance) return dbInstance;

  const dbDir = path.resolve(__dirname, '../../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.join(dbDir, 'students.db');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys and WAL mode for better concurrency
  await db.exec('PRAGMA foreign_keys = ON;');
  await db.exec('PRAGMA journal_mode = WAL;');

  // Create table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roll_number TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      department TEXT NOT NULL,
      semester TEXT NOT NULL,
      gpa REAL DEFAULT 0.0,
      gender TEXT,
      date_of_birth TEXT,
      admission_date TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if students table is empty, seed initial records
  const countRow = await db.get('SELECT COUNT(*) as count FROM students');
  if (countRow && countRow.count === 0) {
    console.log('Seeding initial student records for demonstration...');
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
    console.log(`Seeded ${initialStudents.length} student records.`);
  }

  dbInstance = db;
  return db;
}

function getDatabase() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

module.exports = {
  initializeDatabase,
  getDatabase,
  initialStudents
};
