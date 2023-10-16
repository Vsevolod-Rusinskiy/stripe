const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User } = require('../models');



router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    console.log("Received webhook request");
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Error while processing webhook:", err);

        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const user = await User.findOne({ where: { email: "john.doe@example.com" } });
            if (user) {
                user.paymentStatus = 'Paid';
                await user.save();
            }
            console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}`);
            break;

        case 'payment_intent.payment_failed':
            const paymentError = event.data.object;
            console.log(`Payment failed! ID: ${paymentError.id} due to ${paymentError.last_payment_error.message}`);

            const failedUser = await User.findOne({ where: { email: "john.doe@example.com" } });
            if (failedUser) {
                failedUser.paymentStatus = 'Failed';
                await failedUser.save();
            }
            break;


        default:
            return res.status(400).end();
    }


    res.json({received: true});
});




module.exports = router;
