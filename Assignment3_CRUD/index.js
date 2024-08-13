const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(express.urlencoded({ extended: true }));

// Serve the form
// app.get('/users/create', (req, res) => {
//     res.render('index', { title: 'Create User', message: 'Fill out the form to create a new user' });
// });

// Handle form submission
app.post('/users', async(req, res) => {
    const { name, email } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email },
        });
        const jsondata = { message: 'Created', data: { name, email } };
        res.status(201).json(jsondata);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Read all users
app.get('/users', async(req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Read a single user by ID
app.get('/users/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
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
app.put('/users/:id', async(req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email },
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete a user by ID
app.delete('/users/:id', async(req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // No content
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});