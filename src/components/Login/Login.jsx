import { FcGoogle } from "react-icons/fc";
import { FaCheckSquare } from "react-icons/fa";
import { Button, notification, Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { LoginAuth } from "../../service/Auth";
import { login } from "../../redux/actions/Auth";
import { useNavigate } from "react-router-dom";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
import Register from "../Register/Register";
import "./Login.css";
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modal2Open, setModal2Open] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  // Validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    // Validate email
    if (!email) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email không đúng định dạng";
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      api["error"]({
        message: "Lỗi đăng nhập",
        description: "Vui lòng kiểm tra lại thông tin đăng nhập",
      });
      return;
    }

    try {
      let res = await LoginAuth(email, password);
      setIsLoading(true);
      if (res && res.data.EC === 0) {
        setTimeout(() => {
          dispatch(login(res.data.data.token, res.data.data.user));
          api["success"]({
            message: "Đăng nhập thành công",
            description: "Chào mừng bạn đã quay trở lại",
          });
          navigate("/");
          setIsLoading(false);
        }, 5000);
      } else {
        api["error"]({
          message: "Lỗi đăng nhập",
          description: res.data.message || "Đăng nhập không thành công",
        });
      }
    } catch (error) {
      setIsLoading(false);
      api["error"]({
        message: "Lỗi đăng nhập",
        description: "Vui lòng nhập đúng tài khoản hoặc mật khẩu",
      });
      console.error("Login error:", error);
    }
  };

  const handleForget = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handelRegister = () => {
    setModal2Open(true);
  };

  const handleGoogleLogin = () => {
    // Chuyển hướng đến backend để bắt đầu quá trình xác thực Google
    window.location.href = "http://localhost:9000/auth/google";
  };
  return (
    <div className="min-h-screen flex">
      {contextHolder}
      {/* Left side - Image */}
      <div className="w-8/12">
        {isLoading && (
          <Spin
            className="spin_loading"
            indicator={<LoadingOutlined spin />}
            size="large"
          />
        )}
        <img
          src="https://marketplace.canva.com/EAFfT9NH-JU/1/0/1600w/canva-gray-minimalist-fashion-big-sale-banner-TvkdMwoxWP8.jpg"
          className="w-full h-full object-cover"
          alt="Banner"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-1/3 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col w-full pb-6 text-center">
            <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
              ĐĂNG NHẬP BẰNG GOOGLE
            </h3>

            <div className="flex items-center justify-center gap-2 mb-6">
              <FcGoogle size={30} />
              <button
                className="px-4 py-2 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300"
                onClick={handleGoogleLogin}
              >
                Đăng nhập google
              </button>
            </div>

            <div className="flex items-center mb-6">
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
              <p className="mx-4 text-grey-600">or</p>
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>

            {/* Email Input */}
            <label
              htmlFor="email"
              className="mb-2 text-sm text-start text-grey-900"
            >
              Email*
            </label>
            <input
              id="email"
              type="email"
              placeholder="mail@example.com"
              value={email}
              className={`flex items-center w-full h-9 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-1 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border border-solid ${
                errors.email ? "border-red-500" : "border-[#ccc]"
              }`}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mb-4 text-left">
                {errors.email}
              </span>
            )}

            {/* Password Input */}
            <label
              htmlFor="password"
              className="mb-2 mt-4 text-sm text-start text-grey-900"
            >
              Password*
            </label>
            <Input.Password
              id="password"
              type="password"
              placeholder="Enter a password"
              value={password}
              className={`flex items-center w-full h-9 px-5 py-4 mb-1 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border border-solid ${
                errors.password ? "border-red-500" : "border-[#ccc]"
              }`}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mb-4 text-left">
                {errors.password}
              </span>
            )}

            <Button onClick={handleLogin}>Đăng Nhập</Button>

            <div className="flex flex-row justify-between mt-6">
              <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-5 h-5">
                  <FaCheckSquare />
                </div>
                <span className="ml-1 text-sm font-normal text-grey-900">
                  Lưu mật khẩu
                </span>
              </label>
              <div
                className="text-sm font-medium text-purple-blue-500 cursor-pointer"
                onClick={() => handleForget()}
              >
                Quên mật khẩu?
              </div>
            </div>

            <button className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
              Sign In
            </button>

            <div className="-mt-20">
              <p className="text-sm leading-relaxed text-grey-900">
                Bạn đã có tài khoản chưa?{" "}
                <button
                  className="font-bold text-grey-700"
                  onClick={() => handelRegister()}
                >
                  Đăng kí tài khoản
                </button>
              </p>
            </div>
          </div>
        </div>
        <ForgetPassword
          open={open}
          loading={loading}
          setOpen={setOpen}
          setLoading={setLoading}
        />
        <Register modal2Open={modal2Open} setModal2Open={setModal2Open} />
      </div>
    </div>
  );
};

export default LoginForm;
