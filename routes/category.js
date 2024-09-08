const express = require('express');
const router = express.Router();

const { createCategory, getCategories } = require('../controllers/categoryController');

// Route để tạo một category mới
router.post('/createCategory', createCategory);

// Route để lấy danh sách tất cả các categories
router.get('/getCategories', getCategories);

module.exports = router;