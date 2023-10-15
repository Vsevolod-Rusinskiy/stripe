const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // предполагается, что сумма будет передана в минимальных единицах валюты (например, центы)
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd', // укажите свою валюту
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
