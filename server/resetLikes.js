import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reel from './models/Reel.js';

dotenv.config({ path: '../.env' });

const resetLikes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unixchange');
        console.log('Connected to MongoDB');

        const result = await Reel.updateMany({}, { $set: { likes: [] } });
        console.log(`Reset likes for ${result.modifiedCount} reels.`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error resetting likes:', error);
        process.exit(1);
    }
};

resetLikes();
