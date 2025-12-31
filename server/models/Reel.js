import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema({
    videoUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
        default: []
    },
    comments: [{
        user: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    promotion: {
        enabled: { type: Boolean, default: false },
        campaignGoal: String,
        targetAudience: String,
        budget: Number,
        duration: Number,
        totalCost: Number,
        paymentId: String,
        paymentStatus: String
    },
    views: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    user: {
        userId: { type: String }, // Store the unique user ID here
        // Placeholder for user association if we had auth
        name: { type: String, default: 'Seller' },
        email: { type: String }, // Robust linking
        storeName: { type: String, default: '' },
        avatar: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Reel', reelSchema);
