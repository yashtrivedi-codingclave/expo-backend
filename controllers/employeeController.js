const Employee = require('../models/Employee');

/**
 * @desc    Get all employees with optional search/filter
 * @route   GET /api/employees
 * @access  Private
 */
const getAllEmployees = async (req, res) => {
  try {
    const { search, department, status } = req.query;

    const filter = {};

    // Department filter
    if (department) {
      filter.department = department;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { position: searchRegex },
        { employeeId: searchRegex },
      ];
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error('getAllEmployees error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get a single employee by ID
 * @route   GET /api/employees/:id
 * @access  Private
 */
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ employee });
  } catch (error) {
    console.error('getEmployee error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Private
 */
const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      joinDate,
      status,
      address,
    } = req.body;

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      joinDate,
      status: status ? status.toLowerCase() : 'active',
      address,
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee,
    });
  } catch (error) {
    console.error('createEmployee error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `An employee with this ${field} already exists` });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update an employee by ID
 * @route   PUT /api/employees/:id
 * @access  Private
 */
const updateEmployee = async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: Date.now() };

    if (updates.status) {
      updates.status = updates.status.toLowerCase();
    }

    // Prevent overwriting the auto-generated employeeId
    delete updates.employeeId;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    console.error('updateEmployee error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `An employee with this ${field} already exists` });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete an employee by ID
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully', employee });
  } catch (error) {
    console.error('deleteEmployee error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get employee statistics
 * @route   GET /api/employees/stats
 * @access  Private
 */
const getStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'inactive' });

    // Count per department
    const departmentAggregation = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const departments = departmentAggregation.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departments,
      // Frontend compatibility aliases:
      total: totalEmployees,
      active: activeEmployees,
      inactive: inactiveEmployees,
      departmentList: departmentAggregation.map((d) => ({ _id: d._id, count: d.count })),
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
};
