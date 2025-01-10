const { uploadFileToCloudinary } = require("./../services/Cloudinary");
const { RegisterUser, LoginUser } = require("./../services/Auth");
const Users = require("./../Model/User");
const bcrypt = require("bcrypt"); // Thay vì "bcryptjs"
const RegisterUserAPI = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    console.log("check name", name);
    console.log("check emal", email);
    console.log("check pas", password);
    console.log("check", isAdmin);

    let avatarUrl = ""; // Thay đổi từ 'const' sang 'let'

    if (req.files && req.files.avatar) {
      const files = req.files.avatar;
      let result = await uploadFileToCloudinary(files);
      avatarUrl = result.secure_url; // Gán giá trị mới cho 'avatarUrl'
      console.log(avatarUrl);
    }

    const dataUser = await RegisterUser(
      name,
      email,
      password,
      isAdmin,
      avatarUrl
    );
    return res.status(200).json({
      EC: 0,
      data: dataUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const LoginUserAPI = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await LoginUser(email, password);

    return res.status(200).json({
      EC: 0,
      data: {
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
      },
    });
  } catch (error) {
    return res.status(400).json({
      EC: 1,
      message: error.message,
    });
  }
};

const ListUserAPI = async (req, res) => {
  try {
    const users = await Users.find({});

    return res.status(200).json({
      EC: 0,
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

const ListOneUserAPI = async (req, res) => {
  const { id } = req.query;

  const users = await Users.findOne({ _id: id });

  return res.status(201).json({
    EC: 0,
    data: users,
  });
};

// uploadprofile

const UpDateProfileUserAPI = async (req, res) => {
  try {
    const {
      id,
      name,
      password,
      city,
      district,
      ward,
      phone,
      gender,
      dateOfBirth,
      height,
      weight,
    } = req.body;

    console.log(
      id,
      name,
      password,
      city,
      district,
      ward,
      phone,
      gender,
      dateOfBirth,
      height,
      weight
    );

    const avatar = req.files?.avatar;

    // Tìm người dùng
    const UpdateUser = await Users.findById(id);

    if (!UpdateUser) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Cập nhật dữ liệu
    const updatedData = {
      name: name || UpdateUser.name,
      password: password || UpdateUser.password,
      "address.city": city || UpdateUser.address.city,
      "address.district": district || UpdateUser.address.district,
      "address.ward": ward || UpdateUser.address.ward,
      phone: phone || UpdateUser.phone,
      gender: gender || UpdateUser.gender,
      dateOfBirth: dateOfBirth || UpdateUser.dateOfBirth,
      height: height || UpdateUser.height,
      weight: weight || UpdateUser.weight,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    // Nếu có avatar mới
    if (avatar) {
      try {
        const result = await uploadFileToCloudinary(avatar);
        updatedData.avatar = result.secure_url;
      } catch (err) {
        return res.status(500).json({ error: "Tải ảnh lên thất bại" });
      }
    }

    // Cập nhật trong DB
    const updatedUser = await Users.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  RegisterUserAPI,
  LoginUserAPI,
  ListUserAPI,
  ListOneUserAPI,
  UpDateProfileUserAPI,
};
