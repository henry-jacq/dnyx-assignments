const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(express.json()); // Use express.json() for handling JSON payloads
app.use(express.urlencoded({ extended: true }));

// Read a single user by ID
app.get('/api/user/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update a user by ID
app.put('/api/user/:id', async(req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: { name, email },
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete a user by ID
app.delete('/api/user/:id', async(req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id, 10) },
        });
        res.status(204).send(); // No content
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Create a new user
app.post('/api/user/create', async(req, res) => {
    const { name, email } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email },
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Read all users
app.get('/api/users', async(req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});