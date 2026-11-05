/**
 * Seed Script — Employee Management System
 *
 * Usage:
 *   node seed.js
 *
 * Seeds:
 *   - 1 Super Admin account
 *   - 5 sample employees
 *
 * WARNING: Running this script multiple times will skip already-existing
 * documents (email uniqueness prevents duplicates).
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Employee = require('./models/Employee');

dotenv.config();

const seedAdmins = [
  {
    name: 'Super Admin',
    email: 'admin@company.com',
    password: 'Admin@123',
    role: 'admin',
  },
];

const seedEmployees = [
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    salary: 95000,
    status: 'active',
    address: '123 Maple Street, San Francisco, CA 94101',
  },
  {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@company.com',
    phone: '+1-555-0102',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 78000,
    status: 'active',
    address: '456 Oak Avenue, New York, NY 10001',
  },
  {
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol.williams@company.com',
    phone: '+1-555-0103',
    department: 'HR',
    position: 'HR Specialist',
    salary: 65000,
    status: 'active',
    address: '789 Pine Road, Chicago, IL 60601',
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1-555-0104',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 60000,
    status: 'inactive',
    address: '321 Elm Street, Austin, TX 78701',
  },
  {
    firstName: 'Eva',
    lastName: 'Martinez',
    email: 'eva.martinez@company.com',
    phone: '+1-555-0105',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 82000,
    status: 'active',
    address: '654 Birch Lane, Seattle, WA 98101',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Seed admins
    let adminsCreated = 0;
    for (const adminData of seedAdmins) {
      const existing = await Admin.findOne({ email: adminData.email });
      if (!existing) {
        await Admin.create(adminData);
        adminsCreated++;
        console.log(`  ✔ Admin created: ${adminData.email}`);
      } else {
        console.log(`  ⚠ Admin already exists, skipped: ${adminData.email}`);
      }
    }

    // Seed employees
    let employeesCreated = 0;
    for (const empData of seedEmployees) {
      const existing = await Employee.findOne({ email: empData.email });
      if (!existing) {
        await Employee.create(empData);
        employeesCreated++;
        console.log(`  ✔ Employee created: ${empData.firstName} ${empData.lastName}`);
      } else {
        console.log(`  ⚠ Employee already exists, skipped: ${empData.email}`);
      }
    }

    console.log('\nSeeding complete!');
    console.log(`  Admins created:    ${adminsCreated}`);
    console.log(`  Employees created: ${employeesCreated}`);
    console.log('\nAdmin login credentials:');
    console.log('  Email:    admin@company.com');
    console.log('  Password: Admin@123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
