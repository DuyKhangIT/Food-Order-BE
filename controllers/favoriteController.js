const Favorite = require('../models/Favorite');
const Food = require('../models/Food');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// API để thêm hoặc gỡ food khỏi danh sách yêu thích
exports.toggleFavorite = async (req, res) => {
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
  
      // Kiểm tra xem món ăn đã có trong danh sách yêu thích chưa
      const favorite = await Favorite.findOne({ user: userId, food: foodId });
  
      if (favorite) {
        // Nếu đã có, gỡ món ăn ra khỏi danh sách yêu thích
        await Favorite.findByIdAndDelete(favorite._id);
        return res.status(200).json({ status: true, message: 'Unfavorited' });
      } else {
        // Nếu chưa có, thêm món ăn vào danh sách yêu thích
        const newFavorite = new Favorite({ user: userId, food: foodId });
        await newFavorite.save();
        return res.status(201).json({ status: true, message: 'Favorited' });
      }
    } catch (err) {
      console.error(err.message);
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ statusCode: 401, message: 'Token không hợp lệ hoặc đã hết hạn' });
      }
      res.status(500).send('Lỗi máy chủ');
    }
  };

exports.checkFavorite = async (req, res) => {
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

    // Kiểm tra xem món ăn đã có trong danh sách yêu thích chưa
    const favorite = await Favorite.findOne({ user: userId, food: foodId });

    if (favorite) {
      // Nếu đã được yêu thích
      return res.status(200).json({ isFavorite: true });
    } else {
      // Nếu chưa được yêu thích
      return res.status(200).json({ isFavorite: false });
    }
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ statusCode: 401, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    res.status(500).send('Lỗi máy chủ');
  }
  };

  // API để lấy danh sách các món ăn yêu thích của người dùng
  exports.getFavoriteFoods = async (req, res) => {
    // Lấy token từ headers
    const token = req.header('Authorization').replace('Bearer ', '');
  
    if (!token) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Không tìm thấy token, quyền truy cập bị từ chối',
          });
    }
  
    try {
      // Giải mã token để lấy userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      const userId = decoded.userId;
  
      // Lấy danh sách các Favorite của người dùng
      const favoritesList = await Favorite.find({ user: userId }).populate('food');
  
      // Kiểm tra xem danh sách yêu thích có trống không
      if (favoritesList.length === 0) {
        return res.status(200).json({ status: true, favoriteFoods: [] });
      }
  
      // Tạo danh sách các món ăn từ danh sách favorites
      const favoriteFoods = favoritesList.map(favorite => ({
        id: favorite.food._id,
        title: favorite.food.title,
        description: favorite.food.description,
        price: favorite.food.price,
        image: favorite.food.image,
      }));
  
      // Trả về danh sách các món ăn yêu thích
      res.status(200).json({favorites: favoriteFoods });
    } catch (err) {
      console.error(err.message);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            statusCode: 401,
            message: 'Token không hợp lệ',
          });
      }
      res.status(500).send('Lỗi máy chủ');
    }
  };