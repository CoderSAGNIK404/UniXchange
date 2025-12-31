import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    buyer: {
        type: String,
        default: 'Guest Buyer'
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Completed', 'Cancelled']
    },
    sourceReelId: {
        type: String, // ID of the reel where the purchase originated
        default: null
    },
    sellerId: {
        type: String,
        default: 'demo_seller'
    },
    sellerEmail: { type: String }, // Robust linking via Email
    address: {
        type: String,
        required: true
    },
    customerName: {
        type: String
    },
    customerPhone: {
        type: String
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'ONLINE'],
        default: 'ONLINE'
    },
    paymentId: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
    // New fields for Payouts
    sellerBankDetails: {
        accountName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        upiId: String
    },
    payoutStatus: {
        type: String,
        enum: ['Pending', 'Processed', 'Failed'],
        default: 'Pending'
    }
});

export default mongoose.model('Order', orderSchema);
