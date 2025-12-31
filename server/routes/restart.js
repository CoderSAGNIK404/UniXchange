// Route to trigger server restart (for development purposes)
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Server restarting...');
    // Exit process; nodemon will restart automatically
    process.exit(0);
});

export default router;
