// Stripe payment integration for SIGIL OS
// This provides a complete Stripe integration for subscription payments

// Load Stripe.js (would be loaded from CDN in production)
// <script src="https://js.stripe.com/v3/"></script>

let stripe;
let elements;
let cardElement;

// Initialize Stripe with your publishable key
function initStripe(publishableKey) {
    stripe = Stripe(publishableKey);
    
    // Create Elements instance
    elements = stripe.elements({
        fonts: [{
            cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        }],
        locale: 'auto',
    });

    // Create and mount card element
    cardElement = elements.create('card', {
        style: {
            base: {
                color: '#32325d',
                fontFamily: 'Inter, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    });

    // Mount the card element
    const cardElementContainer = document.getElementById('card-element');
    if (cardElementContainer) {
        cardElement.mount('#card-element');
    }
}

// Create payment method
async function createPaymentMethod(cardElement, billingDetails) {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
    });

    if (error) {
        throw error;
    }

    return paymentMethod;
}

// Create subscription
async function createSubscription(paymentMethodId, customerId, priceId) {
    // In production, this would call your backend API
    // which would use the Stripe API to create a subscription
    
    const response = await fetch('/api/v1/create-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            payment_method_id: paymentMethodId,
            customer_id: customerId,
            price_id: priceId,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create subscription');
    }

    return await response.json();
}

// Confirm payment (for one-time payments)
async function confirmPayment(clientSecret, cardElement) {
    const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
            payment_method: {
                card: cardElement,
            },
        }
    );

    if (error) {
        throw error;
    }

    return paymentIntent;
}

// Setup Intent for subscription
async function confirmSetupIntent(clientSecret, cardElement) {
    const { error, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
            payment_method: {
                card: cardElement,
            },
        }
    );

    if (error) {
        throw error;
    }

    return setupIntent;
}

// Handle payment submission
async function handlePaymentSubmit(plan, billingCycle) {
    const submitButton = document.getElementById('submit-button');
    const errorMessage = document.getElementById('error-message');
    
    // Disable button
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
        // Get billing details from form
        const email = document.querySelector('input[type="email"]').value;
        const name = document.querySelector('input[placeholder="John Doe"]').value;
        const country = document.querySelector('select').value;

        const billingDetails = {
            name: name,
            email: email,
            address: {
                country: country,
            },
        };

        // Create payment method
        const paymentMethod = await createPaymentMethod(cardElement, billingDetails);

        // In production, you would:
        // 1. Create or get customer on your backend
        // 2. Create subscription using Stripe API
        // 3. Return success to frontend

        // For now, simulate success
        const priceId = getPriceId(plan, billingCycle);
        const customerId = 'cus_' + Date.now(); // Would come from backend
        
        await createSubscription(paymentMethod.id, customerId, priceId);

        // Show success
        showSuccess('Payment successful! Redirecting to app...');
        
        // Store subscription info
        localStorage.setItem('sigil-os-plan', plan);
        localStorage.setItem('sigil-os-billing', billingCycle);
        localStorage.setItem('sigil-os-subscribed', 'true');

        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 2000);

    } catch (error) {
        // Show error
        showError(error.message);
        submitButton.disabled = false;
        submitButton.textContent = 'Subscribe Now';
    }
}

// Get Stripe price ID based on plan and billing cycle
function getPriceId(plan, billingCycle) {
    // In production, these would be your actual Stripe price IDs
    const priceIds = {
        free: {
            monthly: 'price_free_monthly',
            yearly: 'price_free_yearly',
        },
        pro: {
            monthly: 'price_pro_monthly',
            yearly: 'price_pro_yearly',
        },
        enterprise: {
            monthly: 'price_enterprise_monthly',
            yearly: 'price_enterprise_yearly',
        },
    };

    return priceIds[plan][billingCycle] || priceIds.pro.monthly;
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Show success message
function showSuccess(message) {
    const successElement = document.getElementById('success-message');
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initStripe,
        handlePaymentSubmit,
        createPaymentMethod,
        createSubscription,
        confirmPayment,
        confirmSetupIntent,
    };
}
