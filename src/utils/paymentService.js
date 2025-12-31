const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const initializePayment = async (cost, onSuccess, onError, description = "UniXchange Payment") => {
    // 1. Load SDK dynamically if not present
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
        alert("Payment Gateway failed to load. Please check your internet connection.");
        if (onError) onError("SDK_NOT_LOADED");
        return;
    }

    // 2. Create Options
    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!rzpKey || rzpKey === "Here_is_your_key_id") {
        alert("Razorpay Key is missing or invalid. Please check your .env file.");
        if (onError) onError("INVALID_KEY");
        return;
    }

    const options = {
        key: rzpKey,
        amount: cost * 100, // Amount in paise
        currency: "INR",
        name: "UniXchange",
        description: description,
        image: "https://your-logo-url.com/logo.png", // Optional: Add app logo
        handler: function (response) {
            // Payment Success
            console.log("Payment Successful:", response);
            // In a real backend, you verify 'response.razorpay_payment_id' & 'response.razorpay_signature'
            onSuccess(response);
        },
        prefill: {
            name: "UniXchange User",
            email: "user@example.com",
            contact: "9999999999"
        },
        theme: {
            color: "#8b5cf6" // Primary Brand Color
        },
        modal: {
            ondismiss: function () {
                if (onError) onError("Payment Cancelled");
            }
        }
    };

    // 3. Open Razorpay
    try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            console.error("Payment Failed:", response.error);
            if (onError) onError(response.error.description);
        });

        rzp.open();
    } catch (err) {
        console.error("Razorpay Error:", err);
        alert("Something went wrong with the payment gateway.");
    }
};
