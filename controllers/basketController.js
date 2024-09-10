const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Basket = require('../models/Basket');
const Food = require('../models/Food');

exports.saveBasket = async (req, res) => {
  const { items } = req.body;
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Token không tồn tại',
    });
  }

  try {
    // Giải mã token để lấy userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Kiểm tra xem người dùng có tồn tại không
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Người dùng không tồn tại',
      });
    }

    // Kiểm tra từng món ăn trong giỏ hàng
    const basketItems = [];
    for (const item of items) {
      const foodExists = await Food.findById(item._id);
      if (!foodExists) {
        return res.status(400).json({
          statusCode: 400,
          message: `Món ăn với ID ${item._id} không tồn tại`,
        });
      }
      // Thêm món ăn vào giỏ hàng
      basketItems.push({
        _id: item._id,
        title: item.title,
        description: item.description,
        price: item.price,
        image: item.image,
      });
    }

    // Lưu giỏ hàng của người dùng
    const newBasket = new Basket({
      user: userId,
      items: basketItems,
    });

    await newBasket.save();

    return res.status(201).json({
      message: 'Giỏ hàng đã được lưu thành công',
      basket: newBasket.items,
    });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ statusCode: 401, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    res.status(500).send('Lỗi máy chủ');
  }
};

exports.getBasket = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Token không tồn tại',
      });
    }
  
    try {
      // Giải mã token để lấy userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
  
      // Kiểm tra xem người dùng có tồn tại không
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Người dùng không tồn tại',
        });
      }
  
      // Lấy giỏ hàng của người dùng
      const basket = await Basket.findOne({ user: userId });
      if (!basket) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Giỏ hàng không tồn tại',
        });
      }
      
      return res.status(200).json({
        basket: basket.items,
      });
    } catch (err) {
      console.error(err.message);
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ statusCode: 401, message: 'Token không hợp lệ hoặc đã hết hạn' });
      }
      res.status(500).send('Lỗi máy chủ');
    }
  };