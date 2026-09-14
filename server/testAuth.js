const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_project');
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const password = 'admin123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('Admin user not found');
            process.exit(1);
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            console.log('Login mock success for admin@gmail.com');
        } else {
            console.log('Login mock failed for admin@gmail.com');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLogin();
