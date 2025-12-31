import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get User by ID (or create if not refers to an existing one - upsert logic helper)
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update or Create User (Upsert)
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        // Upsert: update if exists, insert if not
        const user = await User.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
