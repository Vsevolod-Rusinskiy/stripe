require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();

app.use(bodyParser.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Subscription Backend is Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
