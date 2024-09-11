const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Basket = require('../models/Basket');
const Food = require('../models/Food');

exports.addToBasket = async (req, res) => {
    const { foodId } = req.body;
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
  
      // Kiểm tra xem món ăn có tồn tại không
      const foodExists = await Food.findById(foodId);
      if (!foodExists) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Món ăn không tồn tại',
        });
      }
  
      // Lấy giỏ hàng của người dùng hoặc tạo mới nếu chưa có
      let basket = await Basket.findOne({ user: userId });
      if (!basket) {
        basket = new Basket({
          user: userId,
          items: [],
        });
      }
  
      // Thêm món ăn vào giỏ hàng
    basket.items.push({
        _id: foodExists._id,
        title: foodExists.title,
        description: foodExists.description,
        price: foodExists.price,
        image: foodExists.image
      });
      await basket.save();
  
      return res.status(201).json({
        message: 'Món ăn đã được thêm vào giỏ hàng',
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

  exports.removeFromBasket = async (req, res) => {
    const { foodId } = req.body;
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
  
      // Tìm vị trí món ăn trong giỏ hàng
      const foodIndex = basket.items.findIndex(item => item._id.equals(foodId));
      if (foodIndex === -1) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Món ăn không có trong giỏ hàng',
        });
      }
  
      // Xóa món ăn khỏi giỏ hàng
      basket.items.splice(foodIndex, 1);
      await basket.save();
  
      return res.status(200).json({
        message: 'Món ăn đã được xóa khỏi giỏ hàng',
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
        return res.status(200).json({
            basket: []
        });
      }
      
      return res.status(200).json({
        basketId: basket._id,
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

  exports.checkoutBasket = async (req, res) => {
    const { basketId } = req.body; // Lấy basketId từ body request
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Lấy token từ header
  
    // Kiểm tra xem token có được truyền không
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
  
      // Tìm giỏ hàng dựa trên basketId và userId
      const basket = await Basket.findOne({ _id: basketId, user: userId });
      if (!basket) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Giỏ hàng không tồn tại hoặc không thuộc về người dùng',
        });
      }
  
      // Xóa giỏ hàng sau khi checkout
      await Basket.findByIdAndDelete(basketId);
  
      // Trả về response sau khi giỏ hàng được xóa thành công
      return res.status(200).json({
        message: 'Checkout thành công',
      });
    } catch (err) {
      console.error(err.message);
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ statusCode: 401, message: 'Token không hợp lệ hoặc đã hết hạn' });
      }
      res.status(500).json({
        statusCode: 500,
        message: 'Lỗi máy chủ',
      });
    }
  };