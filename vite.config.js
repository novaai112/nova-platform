import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

function razorpayDevPlugin() {
  return {
    name: 'razorpay-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parseJsonBody = () => new Promise((resolve, reject) => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch (e) { reject(e); }
          });
        });

        const url = req.url?.split('?')[0];

        // STEP 1: POST /api/create-order
        if (req.method === 'POST' && url === '/api/create-order') {
          try {
            const body = await parseJsonBody();
            const { amount, currency = 'INR', receipt } = body;

            // Minimum amount: 100 paise
            if (!amount || Number(amount) < 100) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                error: 'Invalid amount. Minimum order amount is 100 paise (1 INR).'
              }));
            }

            const key_id = process.env.RAZORPAY_KEY_ID;
            const key_secret = process.env.RAZORPAY_KEY_SECRET;

            if (!key_id || !key_secret) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                error: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in .env'
              }));
            }

            const instance = new Razorpay({ key_id, key_secret });
            const order = await instance.orders.create({
              amount: Math.round(Number(amount)),
              currency: currency.toUpperCase(),
              receipt: receipt || `rcpt_${Date.now()}`
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              order_id: order.id,
              amount: order.amount,
              currency: order.currency
            }));
          } catch (err) {
            console.error('[Vite Razorpay Create Order Error]:', err);
            res.statusCode = err.statusCode || 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              error: err.error?.description || err.message || 'Failed to create Razorpay order'
            }));
          }
        }

        // STEP 3: POST /api/verify-payment
        if (req.method === 'POST' && url === '/api/verify-payment') {
          try {
            const body = await parseJsonBody();
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: false,
                error: 'Missing required payment verification fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
              }));
            }

            const key_secret = process.env.RAZORPAY_KEY_SECRET;
            if (!key_secret) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: false,
                error: 'Server misconfiguration: RAZORPAY_KEY_SECRET is missing.'
              }));
            }

            // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
            const expectedSignature = crypto
              .createHmac('sha256', key_secret)
              .update(`${razorpay_order_id}|${razorpay_payment_id}`)
              .digest('hex');

            if (expectedSignature === razorpay_signature) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: true,
                message: 'Payment verified successfully'
              }));
            } else {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: false,
                error: 'Signature verification failed. Potential tampering detected.'
              }));
            }
          } catch (err) {
            console.error('[Vite Razorpay Verify Error]:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              success: false,
              error: err.message || 'Internal server error during signature verification'
            }));
          }
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), razorpayDevPlugin()],
});