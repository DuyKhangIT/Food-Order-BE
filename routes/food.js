const express = require('express');
const router = express.Router();
const { createFood, getAllFoods } = require('../controllers/foodController');

// Route để tạo một food mới
router.post('/createFood', createFood);

router.get('/getAllFoods', getAllFoods);

module.exports = router;