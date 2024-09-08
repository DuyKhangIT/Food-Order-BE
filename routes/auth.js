const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');

// Route đăng ký
router.post('/register', register);

// Route đăng nhập
router.post('/login', login);

// Route đổi mật khẩu
router.put('/changePassword', changePassword);

module.exports = router;
