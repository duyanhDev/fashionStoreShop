const Users = require("./../Model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config;

const RegisterUser = async (name, email, password, isAdmin = false, avatar) => {
  try {
    // Kiểm tra email đã tồn tại hay chưa
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    // Tạo người dùng mới
    const newUser = new Users({ name, email, password, isAdmin, avatar });

    // Lưu vào cơ sở dữ liệu
    return await newUser.save();
  } catch (error) {
    // Trả lỗi để xử lý bên ngoài
    throw error;
  }
};

const LoginUser = async (email, password) => {
  try {
    const user = await Users.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    return {
      token,
      refreshToken,
      user: user,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
};
