import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { initializePayment } from '../utils/paymentService';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Check, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addOrder } = useMarketplace();
    const { clearCart } = useCart();
    const { addToast } = useToast();
    const { user, updateUser } = useAuth(); // Integrate Auth
    const [activeStep, setActiveStep] = useState(2); // Start at Address (1 is Login, auto-completed)
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    // Address State
    const [addresses, setAddresses] = useState(() => {
        if (user && user.addresses) {
            return user.addresses;
        }
        try {
            const saved = localStorage.getItem('userAddresses');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    });

    // Update addresses when user logs in/out
    useEffect(() => {
        if (user && user.addresses) {
            setAddresses(user.addresses);
        } else if (!user) {
            // Fallback to local storage for guest
            try {
                const saved = localStorage.getItem('userAddresses');
                const parsed = saved ? JSON.parse(saved) : [];
                setAddresses(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                setAddresses([]);
            }
        }
    }, [user]);

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    // Select first address by default when addresses change
    useEffect(() => {
        // If no addresses, show add form
        if (addresses.length === 0) {
            setIsAddingAddress(true);
        }

        // Auto-select first address if none selected, but ONLY if we are not adding a new one
        if (addresses.length > 0 && !selectedAddressId && !isAddingAddress) {
            setSelectedAddressId(addresses[0].id);
        }
    }, [addresses, selectedAddressId, isAddingAddress]);

    const [newAddress, setNewAddress] = useState({
        name: user?.name || '', // Pre-fill name if logged in
        phone: '', pin: '', locality: '', address: '', city: '', state: '', type: 'HOME'
    });

    // Handle both single product (Buy Now) and multiple items (Cart)
    const { product, items } = location.state || {};
    const checkoutItems = items || (product ? [product] : []);
    const isCartCheckout = !!items;

    useEffect(() => {
        if (checkoutItems.length === 0) navigate('/app');
    }, [checkoutItems, navigate]);


    if (checkoutItems.length === 0) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-color)',
                color: 'var(--text-color)'
            }}>
                <h2>No items in checkout</h2>
                <p>Redirecting you back to app...</p>
                <button
                    onClick={() => navigate('/app')}
                    style={{
                        marginTop: '1rem',
                        padding: '10px 20px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Calculations
    const calculateTotal = () => {
        return checkoutItems.reduce((acc, item) => {
            // Handle both number and string price "₹120"
            let price = item.amount || item.price;
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
            }
            return acc + (Number(price) * (item.quantity || 1));
        }, 0);
    };

    const totalAmount = calculateTotal();
    const delivery = 0;
    const finalTotal = totalAmount + delivery;
    const discount = Math.round(totalAmount * 0.2); // Fake discount logic per item or total
    const originalPrice = totalAmount + discount;

    const handleSaveAddress = async () => {
        if (!newAddress.name || !newAddress.address || !newAddress.phone) {
            addToast("Please fill all required fields");
            return;
        }
        const address = { ...newAddress, id: Date.now() };
        const updatedAddresses = [address, ...addresses];

        setAddresses(updatedAddresses);
        setSelectedAddressId(address.id);
        setIsAddingAddress(false);

        if (user) {
            // Save to User Profile
            await updateUser({ addresses: updatedAddresses });
        } else {
            // Save to Local Storage (Guest)
            localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        }
    };

    const handleDeliverHere = () => {
        if (!selectedAddressId) {
            addToast("Please select an address");
            return;
        }
        setActiveStep(3);
    };

    const getSelectedAddressStr = () => {
        const addr = addresses.find(a => a.id === selectedAddressId);
        if (!addr) return "";
        return `${addr.name}, ${addr.address}, ${addr.city}, ${addr.state} - ${addr.pin}`;
    };

    const handlePayment = () => {
        setLoading(true);
        const addrObj = addresses.find(a => a.id === selectedAddressId);
        const finalAddress = getSelectedAddressStr();

        const completeOrder = async (payId) => {
            try {
                // Create an order for EACH item
                const orderPromises = checkoutItems.map(item => {
                    let itemPrice = item.amount || item.price;
                    if (typeof itemPrice === 'string') {
                        itemPrice = parseFloat(itemPrice.replace(/[^0-9.-]+/g, ""));
                    }
                    const itemTotal = Number(itemPrice) * (item.quantity || 1);

                    return addOrder({
                        product: item.title || item.name || item.product, // specific field check
                        amount: itemTotal,
                        sourceReelId: item.sourceReelId,
                        buyer: user ? user.name : 'Guest',
                        sellerId: item.sellerId || 'UniXchange Seller',
                        sellerEmail: item.sellerEmail, // Pass robust email
                        address: finalAddress,
                        customerName: addrObj?.name || 'Guest',
                        customerPhone: addrObj?.phone || '',
                        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'ONLINE',
                        paymentId: payId,
                        quantity: item.quantity || 1
                    });
                });

                await Promise.all(orderPromises);

                addToast(`Order Placed Successfully! (${checkoutItems.length} items)`);
                if (isCartCheckout) clearCart();
                setLoading(false);
                navigate('/app'); // Redirect to Home instead of Orders
            } catch (error) {
                console.error("Order creation failed", error);
                addToast("Order creation failed, please contact support.");
                setLoading(false);
            }
        };

        if (paymentMethod === 'cod') {
            setTimeout(() => completeOrder('COD'), 1500);
            return;
        }

        initializePayment(
            finalTotal,
            (res) => completeOrder(res.razorpay_payment_id),
            (err) => { addToast("Payment Failed"); setLoading(false); },
            `Payment for ${checkoutItems.length} items`
        );
    };

    const inputStyle = {
        padding: '10px',
        border: '1px solid #e0e0e0',
        borderRadius: '2px',
        fontSize: '0.9rem',
        color: '#212121'
    };

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', padding: '2rem 1rem', color: 'var(--text-color)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '1.5rem', alignItems: 'start' }}>

                {/* Left Section: Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>


                    {/* Step 1: Login */}
                    <Step
                        number={1}
                        title="LOGIN"
                        done={true}
                        active={false}
                        summary={
                            <div>
                                <span style={{ fontWeight: 600 }}>{user ? user.name : 'Guest User'}</span>
                                <span style={{ marginLeft: '10px' }}>{user ? user.email : '+91 9876543210'}</span>
                            </div>
                        }
                    />

                    {/* Step 2: Delivery Address */}
                    <Step
                        number={2}
                        title="DELIVERY ADDRESS"
                        done={activeStep > 2}
                        active={activeStep === 2}
                        summary={activeStep > 2 ? <span>{getSelectedAddressStr()}</span> : null}
                    >
                        <div style={{ padding: '1rem 0' }}>
                            {addresses.length > 0 && (
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                    Saved Addresses
                                </div>
                            )}
                            {addresses.map(addr => (
                                <div key={addr.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--border-color)', background: selectedAddressId === addr.id ? 'var(--hover-bg)' : 'var(--card-bg)' }}>
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => setSelectedAddressId(addr.id)}
                                        style={{ marginTop: '5px', cursor: 'pointer' }}
                                    />
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                                            <span style={{ fontWeight: 600 }}>{addr.name}</span>
                                            <span style={{ background: 'var(--bg-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{addr.type}</span>
                                            <span style={{ fontWeight: 600 }}>{addr.phone}</span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '1rem' }}>
                                            {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pin}</strong>
                                        </p>
                                        {selectedAddressId === addr.id && (
                                            <button
                                                onClick={handleDeliverHere}
                                                style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 600, borderRadius: '2px', cursor: 'pointer', fontSize: '0.9rem' }}
                                            >
                                                DELIVER HERE
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add Address Form */}
                            {!isAddingAddress ? (
                                <div
                                    onClick={() => { setIsAddingAddress(true); setSelectedAddressId(null); }}
                                    style={{ padding: '1rem', color: '#2874f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                                >
                                    <Plus size={18} /> ADD A NEW ADDRESS
                                </div>
                            ) : (
                                <div style={{ background: 'var(--hover-bg)', padding: '1.5rem', marginTop: '1rem', borderRadius: '4px' }}>
                                    <div style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>ADD A NEW ADDRESS</div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <input type="text" placeholder="Name" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} className="checkout-input" />
                                        <input type="text" placeholder="10-digit mobile number" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="checkout-input" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <input type="text" placeholder="Pincode" value={newAddress.pin} onChange={e => setNewAddress({ ...newAddress, pin: e.target.value })} className="checkout-input" />
                                        <input type="text" placeholder="Locality" value={newAddress.locality} onChange={e => setNewAddress({ ...newAddress, locality: e.target.value })} className="checkout-input" />
                                    </div>
                                    <textarea
                                        placeholder="Address (Area and Street)"
                                        value={newAddress.address}
                                        onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                        className="checkout-input"
                                        style={{ marginBottom: '1rem', height: '100px', resize: 'none' }}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <input type="text" placeholder="City/District/Town" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="checkout-input" />
                                        <select value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="checkout-input">
                                            <option value="">--Select State--</option>
                                            {[
                                                "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
                                                "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
                                                "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
                                                "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
                                                "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
                                            ].map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                                            <input type="radio" name="addrType" checked={newAddress.type === 'HOME'} onChange={() => setNewAddress({ ...newAddress, type: 'HOME' })} /> Home
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                                            <input type="radio" name="addrType" checked={newAddress.type === 'WORK'} onChange={() => setNewAddress({ ...newAddress, type: 'WORK' })} /> Work
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button onClick={handleSaveAddress} style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 600, borderRadius: '2px', cursor: 'pointer' }}>
                                            SAVE AND DELIVER HERE
                                        </button>
                                        <button onClick={() => setIsAddingAddress(false)} style={{ background: 'none', color: 'var(--primary-color)', border: 'none', padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Step>

                    {/* Step 3: Order Summary */}
                    <Step
                        number={3}
                        title="ORDER SUMMARY"
                        done={activeStep > 3}
                        active={activeStep === 3}
                        summary={activeStep > 3 ? <span>{checkoutItems.length} Item{checkoutItems.length > 1 ? 's' : ''}</span> : null}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {checkoutItems.map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: '1.5rem', padding: '1rem 0', borderBottom: index < checkoutItems.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <div style={{ width: '100px', height: '100px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={item.image || "https://via.placeholder.com/80"} alt="Product" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>{item.title || item.name || item.product}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#878787', marginBottom: '0.5rem' }}>Seller: {item.sellerId || 'UniXchange Seller'}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#878787', marginBottom: '0.5rem' }}>Qty: {item.quantity || 1}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                                {/* Display item price - check if string or number */}
                                                {typeof (item.amount || item.price) === 'string' ? (item.amount || item.price) : `₹${item.amount || item.price}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setActiveStep(4)}
                                style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '10px 20px', fontWeight: 600, borderRadius: '2px', cursor: 'pointer', fontSize: '0.9rem', width: 'fit-content' }}
                            >
                                CONTINUE
                            </button>
                        </div>
                    </Step>

                    {/* Step 4: Payment Options */}
                    <Step
                        number={4}
                        title="PAYMENT OPTIONS"
                        done={false}
                        active={activeStep === 4}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                            <PaymentOption
                                id="razorpay"
                                label="UPI / Credit / Debit / ATM Card"
                                selected={paymentMethod === 'razorpay'}
                                onSelect={() => setPaymentMethod('razorpay')}
                            />
                            <PaymentOption
                                id="cod"
                                label="Cash on Delivery"
                                selected={paymentMethod === 'cod'}
                                onSelect={() => setPaymentMethod('cod')}
                            />

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                style={{
                                    marginTop: '1rem',
                                    background: '#fb641b', color: '#fff', border: 'none',
                                    padding: '12px 20px', fontWeight: 600, borderRadius: '2px',
                                    cursor: loading ? 'wait' : 'pointer', fontSize: '1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    width: '200px'
                                }}
                            >
                                {loading ? 'PROCESSING...' : `PAY ₹${finalTotal}`}
                            </button>
                        </div>
                    </Step>
                </div>

                {/* Right Section: Price Details */}
                <div style={{ background: 'var(--card-bg)', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        PRICE DETAILS
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Price ({checkoutItems.length} item{checkoutItems.length > 1 ? 's' : ''})</span>
                            <span>₹{originalPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Discount</span>
                            <span style={{ color: '#388e3c' }}>− ₹{discount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Delivery Charges</span>
                            <span style={{ color: '#388e3c' }}>FREE</span>
                        </div>
                        <div style={{ borderTop: '1px dashed #e0e0e0', margin: '0.5rem 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.2rem' }}>
                            <span>Total Amount</span>
                            <span>₹{finalTotal}</span>
                        </div>
                        <div style={{ borderTop: '1px dashed #e0e0e0', margin: '0.5rem 0' }} />
                        <div style={{ color: '#388e3c', fontWeight: 600, fontSize: '0.9rem' }}>
                            You will save ₹{discount} on this order
                        </div>
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#878787', borderTop: '1px solid #f0f0f0' }}>
                        <ShieldCheck size={16} />
                        Safe and Secure Payments. 100% Authentic products.
                    </div>
                </div>

            </div>
        </div>
    );
};

const Step = ({ number, title, active, done, children, summary }) => {
    return (
        <div style={{ background: 'var(--card-bg)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', borderRadius: '2px' }}>
            <div style={{
                padding: '1rem',
                background: active ? 'var(--primary-color)' : 'var(--card-bg)',
                color: active ? '#fff' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '1rem'
            }}>
                <span style={{
                    background: active ? '#fff' : 'var(--hover-bg)',
                    color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
                    width: '24px', height: '24px', borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600
                }}>
                    {done ? <Check size={14} color="var(--primary-color)" /> : number}
                </span>
                <span style={{ fontWeight: 600, fontSize: '1rem', textTransform: 'uppercase' }}>{title}</span>
                {done && active === false && (
                    <div style={{ marginLeft: 'auto', color: 'var(--text-color)', fontSize: '0.9rem' }}>
                        {summary}
                    </div>
                )}
            </div>
            {active && (
                <div style={{ padding: '1rem 2rem' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const PaymentOption = ({ id, label, selected, onSelect }) => (
    <div
        onClick={onSelect}
        style={{
            padding: '1rem',
            background: selected ? 'var(--hover-bg)' : 'var(--card-bg)',
            borderBottom: '1px solid var(--border-color)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '1rem'
        }}
    >
        <input type="radio" checked={selected} readOnly />
        <span>{label}</span>
    </div>
);

export default Checkout;
