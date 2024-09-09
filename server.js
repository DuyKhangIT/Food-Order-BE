const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Cấu hình biến môi trường
dotenv.config();

// Kết nối tới MongoDB
connectDB();

const app = express();

// Middleware để parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/category', require('./routes/category'));

app.use('/api/food', require('./routes/food'));

app.use('/api/favorite', require('./routes/favorite'));

// Cấu hình cổng
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
