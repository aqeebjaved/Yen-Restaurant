import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import Employee from './api/models/employee.model.js';

const uri = 'mongodb+srv://aqeebj8:saad123@restro.4jx27sq.mongodb.net/?retryWrites=true&w=majority&appName=Restro';

async function createAdmin() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB Atlas');

    const existingAdmin = await Employee.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = bcryptjs.hashSync('Admin@123', 10);

    const adminUser = new Employee({
      firstname: 'Admin',
      lastname: 'User',
      username: 'adminuser',
      address: 'Admin Address',
      email: 'admin@example.com',
      nic: '000000000V',
      phone: '0000000000',
      password: hashedPassword,
      role: 'admin',
      isAdmin: true,
      profilePicture: '',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
