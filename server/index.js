import express from 'express'; // Force Schema Reload
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
import fs from 'fs';

import reelRoutes from './routes/reels.js';
import chatRoutes from './routes/chat.js';

dotenv.config({ path: '../.env' }); // Load env variables from root .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unixchange')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('👉 If you do not have a local MongoDB running, please add a cloud connection string to your .env file as MONGODB_URI.');
    });

// Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

import userRoutes from './routes/users.js';

app.use('/api/reels', reelRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);


// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist')));

// Anything that doesn't match the above routes, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
