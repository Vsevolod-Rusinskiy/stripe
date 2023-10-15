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

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    console.log("Received webhook request");  // <-- добавьте этот лог
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Error while processing webhook:", err);  // <-- добавьте этот лог

        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}`);
            break;
        case 'payment_intent.payment_failed':
            const paymentError = event.data.object;
            console.log(`Payment failed! ID: ${paymentError.id} due to ${paymentError.last_payment_error.message}`);
            break;
        // Добавьте другие события по мере необходимости...
        default:
            return res.status(400).end();
    }

    // Возвращаем успешный статус
    res.json({received: true});
});




module.exports = router;
