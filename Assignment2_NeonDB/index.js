const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

// Initialize Prisma client
const prisma = new PrismaClient();

// Define a route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/users', async(req, res) => {
    try {
        const users = await prisma.user.findMany(); // Fetch all users
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});