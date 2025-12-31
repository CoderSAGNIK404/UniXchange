import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    originalPrice: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    category: { type: String, required: true },
    image: { type: String }, // URL or Base64
    seller: { type: String, default: 'Seller' },
    status: { type: String, default: 'Active' },
    stock: { type: Number, default: 1 },
    stock: { type: Number, default: 1 },
    userId: { type: String }, // To link to a specific user account (DB ID)
    sellerId: { type: String }, // To link to seller's Display Name / Store Name
    sellerEmail: { type: String }, // Robust linking via Email
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
