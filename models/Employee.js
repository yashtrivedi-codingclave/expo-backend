const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: {
      values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Other'],
      message: '{VALUE} is not a valid department',
    },
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
  },
  salary: {
    type: Number,
    min: [0, 'Salary cannot be negative'],
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'Active', 'Inactive'],
      message: '{VALUE} is not a valid status',
    },
    default: 'active',
    set: (v) => (v ? v.toLowerCase() : 'active'),
  },
  address: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook: auto-generate employeeId for new documents
employeeSchema.pre('save', async function (next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
