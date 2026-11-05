const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/employees/stats
// Must be before /:id to avoid "stats" being treated as an id
router.get('/stats', getStats);

// @route   GET /api/employees
router.get('/', getAllEmployees);

// @route   POST /api/employees
router.post('/', createEmployee);

// @route   GET /api/employees/:id
router.get('/:id', getEmployee);

// @route   PUT /api/employees/:id
router.put('/:id', updateEmployee);

// @route   DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

module.exports = router;
