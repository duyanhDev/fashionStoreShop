const { uploadFileToCloudinary } = require("./../services/Cloudinary");
const { RegisterUser, LoginUser } = require("./../services/Auth");
const Users = require("./../Model/User");
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
module.exports = {
  RegisterUserAPI,
  LoginUserAPI,
  ListUserAPI,
};
