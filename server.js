require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const userRouter = require('./src/routes/usersRoutes'); // Укажите правильный путь
const subscriptionRouter = require('./src/routes/subscriptionsRouter'); // Укажите правильный путь
const stripeRoutes = require('./src/routes/stripeRoutes');


const app = express();

app.use('/stripe', stripeRoutes);


app.use(bodyParser.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Subscription Backend is Running');
});

// Подключаем маршрутизаторы
app.use(userRouter);
app.use(subscriptionRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
