import express from 'express';
import multer from 'multer';
import path from 'path';
import Reel from '../models/Reel.js';

const router = express.Router();

// Multer Config for Video Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Not a video! Please upload a video.'), false);
        }
    }
});

// @route   POST /api/reels
// @desc    Upload a new reel
router.post('/', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        // URL construction: http://localhost:5000/uploads/filename
        const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Parse promotion data if sent as string (common with FormData)
        let promotion = {};
        if (req.body.promotion) {
            try {
                promotion = JSON.parse(req.body.promotion);
            } catch (e) {
                promotion = req.body.promotion;
            }
        }

        const newReel = new Reel({
            videoUrl,
            caption: req.body.caption,
            promotion,
            views: 0, // Start fresh
            reach: 0,
            revenue: 0, // Real revenue tracking
            user: {
                userId: req.body.userId,
                name: req.body.userName || 'Seller',
                email: req.body.userEmail, // Save email
                storeName: req.body.storeName || '',
                avatar: req.body.userAvatar || ''
            }
        });

        const savedReel = await newReel.save();
        res.status(201).json(savedReel);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/reels/:id/like
// @desc    Like/Unlike a reel
router.post('/:id/like', async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ message: 'Reel not found' });

        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        // Legacy/Corruption Data Migration
        // Safely check if likes is array. If not, or if it contains objects (bad schema), reset it.
        if (!Array.isArray(reel.likes) || (reel.likes.length > 0 && typeof reel.likes[0] === 'object')) {
            reel.likes = [];
        }

        // Check if already liked
        const index = reel.likes.indexOf(userId);
        if (index === -1) {
            // Not liked, so add it
            reel.likes.push(userId);
        } else {
            // Already liked, so remove it
            reel.likes.splice(index, 1);
        }

        await reel.save();
        res.json(reel);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/reels/:id/comment
// @desc    Comment on a reel
router.post('/:id/comment', async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ message: 'Reel not found' });

        const newComment = {
            user: req.body.user || 'Anonymous', // Placeholder user
            text: req.body.text
        };

        reel.comments.unshift(newComment); // Add to beginning
        await reel.save();
        res.json(reel);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/reels
// @desc    Get all reels
router.get('/', async (req, res) => {
    try {
        const reels = await Reel.find().sort({ createdAt: -1 });
        res.json(reels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   POST /api/reels/:id/view
// @desc    Increment view count
router.post('/:id/view', async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ message: 'Reel not found' });

        reel.views = (reel.views || 0) + 1;
        await reel.save();
        res.json(reel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/reels/:id
// @desc    Delete a reel
router.delete('/:id', upload.none(), async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ message: 'Reel not found' });

        // Check ownership (Optional: You can enforce strict check if auth token is present)
        // For now, we trust the client to only show delete button for own posts, 
        // OR we can pass userId in body/query to verify.
        // Let's expect userId in the request body for verification.
        const { userId } = req.body;

        // Strict verify: If the reel has a userId, the requester SHOULD provide it
        if (reel.user.userId && reel.user.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this reel' });
        }

        await reel.deleteOne();
        res.json({ message: 'Reel removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/reels/reset
// @desc    Delete ALL reels (Development/Reset only)
router.delete('/reset', async (req, res) => {
    try {
        await Reel.deleteMany({});
        res.json({ message: 'All reels have been deleted. Section reset.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
