const express = require('express');
const router = express.Router();

const { toggleFavorite, checkFavorite, getFavoriteFoods } = require('../controllers/favoriteController');

// Route để thêm food vào danh sách yêu thích
router.post('/toggleFavorite', toggleFavorite);

router.post('/checkFavorite', checkFavorite);

router.get('/getFavoriteFoods', getFavoriteFoods);

module.exports = router;
