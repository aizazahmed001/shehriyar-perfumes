const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_project');
        console.log('MongoDB Connected');

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env');
        }

        if (adminPassword.length < 8) {
            throw new Error('ADMIN_PASSWORD must be at least 8 characters');
        }

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            existingAdmin.password = adminPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin password updated successfully');
        } else {
            const admin = new User({
                name: process.env.ADMIN_NAME?.trim() || 'Store Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
