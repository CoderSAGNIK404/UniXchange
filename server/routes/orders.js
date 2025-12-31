import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/orders
// @desc    Create a new order (Buy Now)
import User from '../models/User.js';

router.post('/', async (req, res) => {
    try {
        const orderData = {
            product: req.body.product,
            amount: req.body.amount,
            buyer: req.body.buyer || 'You',
            sourceReelId: req.body.sourceReelId,
            sellerId: req.body.sellerId,
            sellerEmail: req.body.sellerEmail,
            address: req.body.address,
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            paymentMethod: req.body.paymentMethod,
            paymentId: req.body.paymentId
        };

        // --- FETCH SELLER BANK DETAILS ---
        let sellerUser = null;
        if (req.body.sellerId) {
            sellerUser = await User.findOne({ userId: req.body.sellerId });
        }
        if (!sellerUser && req.body.sellerEmail) {
            sellerUser = await User.findOne({ email: req.body.sellerEmail });
        }

        if (sellerUser && sellerUser.bankDetails) {
            orderData.sellerBankDetails = sellerUser.bankDetails;
            orderData.payoutStatus = 'Pending';
        }
        // --------------------------------

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


export default router;
