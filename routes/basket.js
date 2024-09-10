const express = require('express');
const router = express.Router();
const { saveBasket, getBasket } = require('../controllers/basketController');

// Route lưu giỏ hàng
router.post('/saveBasket', saveBasket);

router.get('/getBasket', getBasket);

module.exports = router;