import express from 'express';
import { createPaymentIntent, createCheckoutSession } from '../controllers/payment.controllers.js';
import { authentication } from '../middleware/auth.middleware.js';

const paymentRouter = express.Router();


paymentRouter.post('/create-payment-intent/:orderId', authentication, createPaymentIntent);

paymentRouter.post('/create-checkout-session/:orderId', authentication, createCheckoutSession);

export default paymentRouter;
