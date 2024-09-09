const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { status } = require('express/lib/response');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Người dùng đã tồn tại' });
    }

    // Tạo đối tượng người dùng mới
    user = new User({ name, email, password });

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Lưu người dùng vào database
    await user.save();

    // Tạo và trả về JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.json({
        user: {
          id: user.id,
          email: user.email,
          password: user.password,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi máy chủ');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user theo email
    const user = await User.findOne({ email });

    // Nếu user không tồn tại
    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Người dùng không tồn tại',
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);

    // Nếu password không đúng
    if (!isMatch) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Mật khẩu không chính xác',
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET
      //{ expiresIn: '1h' } // Thời gian hết hạn của token
    );

    // Trả về response
    return res.json({
      token,
        user: {
          id: user._id,
          email: user.email,
        },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi máy chủ');
  }
};

exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
     // Kiểm tra xem người dùng có tồn tại không
     let user = await User.findOne({ email });
     if (!user) {
       return res.status(400).json({ statusCode: 400, message: 'Người dùng không tồn tại' });
     }
 
     // Kiểm tra mật khẩu cũ có đúng không
     const isMatch = await bcrypt.compare(oldPassword, user.password);
     if (!isMatch) {
       return res.status(400).json({ statusCode: 400, message: 'Mật khẩu cũ không chính xác' });
     }
 
     // Kiểm tra xem mật khẩu mới có khác mật khẩu cũ không
     const isSamePassword = await bcrypt.compare(newPassword, user.password);
     if (isSamePassword) {
       return res.status(400).json({ statusCode: 400, message: 'Mật khẩu mới không được trùng với mật khẩu cũ' });
     }
 
     // Mã hóa mật khẩu mới
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(newPassword, salt);
 
     // Lưu người dùng với mật khẩu mới
     await user.save(); 

    res.status(200).json({ status: true, message: 'Đổi mật khẩu thành công'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi máy chủ');
  }
};
