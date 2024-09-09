// controllers/foodController.js
const Food = require('../models/Food');
const Category = require('../models/Category');

// API để tạo một food mới
exports.createFood = async (req, res) => {
  const { title, description, price, image, category } = req.body;

  try {
    // Kiểm tra xem category có tồn tại không
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category không tồn tại' });
    }

    // Tạo đối tượng food mới
    const newFood = new Food({
      title,
      description,
      price,
      image,
      category,
    });

    // Lưu food vào database
    await newFood.save();

    res.status(201).json({
      id: newFood._id,
      title: newFood.title,
      description: newFood.description,
      price: newFood.price,
      image: newFood.image,
      category: newFood.category,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi máy chủ');
  }
};

// API để lấy danh sách tất cả các foods
exports.getAllFoods = async (req, res) => {
    try {
      // Lấy tất cả các foods từ database
      const foodsList = await Food.find().select('title description price image');
  
      // Trả về danh sách foods
      res.status(200).json({foods: foodsList});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Lỗi máy chủ');
    }
  };
