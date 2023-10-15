const express = require('express');
const router = express.Router();
const { Subscription } = require('../models');

router.post('/subscriptions', async (req, res) => {
    try {
        const subscription = await Subscription.create(req.body);
        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
