const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_project');
        console.log('MongoDB Connected');

        const users = await User.find({}, 'name email role');
        console.log('Users in DB:');
        console.table(users.map(u => ({ name: u.name, email: u.email, role: u.role })));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
