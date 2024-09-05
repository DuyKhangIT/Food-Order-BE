const User = require('../models/User');
const bcrypt = require('bcryptjs');
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
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
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
        status: false,
        message: 'Invalid credentials',
      });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);

    // Nếu password không đúng
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: 'Invalid credentials',
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
      status: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
