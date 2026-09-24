import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Razorpay instance using environment variables
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in .env');
  }

  return new Razorpay({
    key_id,
    key_secret
  });
};

// ==============================================================================
// STEP 1: BACKEND - Create Order
// Endpoint: POST /api/create-order
// Call Razorpay API: POST https://api.razorpay.com/v1/orders
// Request: { amount (paise), currency, receipt }
// Return: { order_id, amount, currency }
// Minimum amount: 100 paise
// ==============================================================================
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Minimum amount validation (100 paise = 1 INR)
    if (!amount || Number(amount) < 100) {
      return res.status(400).json({
        error: 'Invalid amount. Minimum order amount is 100 paise (1 INR).'
      });
    }

    let instance;
    try {
      instance = getRazorpayInstance();
    } catch (authErr) {
      console.error('[Razorpay Auth Failure]:', authErr.message);
      return res.status(401).json({ error: authErr.message });
    }

    const options = {
      amount: Math.round(Number(amount)),
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('[Razorpay Create Order Error]:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.error?.description || error.message || 'Failed to create Razorpay order'
    });
  }
});

// ==============================================================================
// STEP 3: BACKEND - Verify Signature
// Endpoint: POST /api/verify-payment
// Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
// Compare generated signature with razorpay_signature
// Return success only if signatures match
// ==============================================================================
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Missing fields check
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(500).json({
        success: false,
        error: 'Server misconfiguration: RAZORPAY_KEY_SECRET is missing.'
      });
    }

    // Generate expected signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body)
      .digest('hex');

    // Compare generated signature with razorpay_signature
    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Signature mismatch: return 400, do NOT mark as paid
      return res.status(400).json({
        success: false,
        error: 'Signature verification failed. Potential tampering detected.'
      });
    }
  } catch (error) {
    console.error('[Razorpay Verify Payment Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during signature verification'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Razorpay Payment Backend' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Razorpay Backend running on http://localhost:${PORT}`);
  });
}

export default app;
