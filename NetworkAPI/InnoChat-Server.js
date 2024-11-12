const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoute = require("./Routes/UserRoutes");
const chatRoute = require("./Routes/ChatRoutes");
const messageRoute = require("./Routes/MessageRoutes");

const app = express();
require('dotenv').config();

// Middleware setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Static route to serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Server setup
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URL;

mongoose
    .connect(uri, {})
    .then(() => console.log('MongoDB connection established...'))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on ${port}...`);
});
