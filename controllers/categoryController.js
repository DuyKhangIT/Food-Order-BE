// controllers/categoryController.js
const Category = require('../models/Category');

// API để tạo một category mới
exports.createCategory = async (req, res) => {
  const { title, image } = req.body;

  try {
    // Tạo đối tượng category mới
    const newCategory = new Category({ title, image });

    // Lưu category vào database
    await newCategory.save();

    res.status(201).json({
      id: newCategory._id,
      title: newCategory.title,
      image: newCategory.image,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

exports.getCategories = async (req, res) => {
    try {
      const categoriesList = await Category.find();
  
      // Trả về danh sách categories
      res.status(200).json({categories: categoriesList});
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  };
