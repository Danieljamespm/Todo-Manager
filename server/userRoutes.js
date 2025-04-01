const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnectedClient } = require('./database');
const { JWT_SECRET } = require('./auth');

const getUsersCollection = () => {
    const client = getConnectedClient();
    return client.db('Todos').collection('users');
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const collection = getUsersCollection();

        // Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const result = await collection.insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        if (!result.insertedId) {
            throw new Error('Failed to create user');
        }

        // Generate token
        const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET);

        res.status(201).json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user. Please try again.' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const collection = getUsersCollection();

        // Find user
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Sorry, you are not registered yet. Please register first.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;