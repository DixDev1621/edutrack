const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateStudentInput } = require('../middleware/validator');

// Stats endpoint
router.get('/stats', studentController.getStudentStats);

// Seed endpoint
router.post('/seed', studentController.seedStudents);

// CRUD routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', validateStudentInput, studentController.createStudent);
router.put('/:id', validateStudentInput, studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
