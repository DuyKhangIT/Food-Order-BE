const express = require('express');
const router = express.Router();
const { addToBasket, removeFromBasket , getBasket, checkoutBasket } = require('../controllers/basketController');

// Route lưu giỏ hàng
router.post('/addToBasket', addToBasket);

router.post('/removeFromBasket', removeFromBasket);

router.get('/getBasket', getBasket);

router.post('/checkoutBasket', checkoutBasket);

module.exports = router;