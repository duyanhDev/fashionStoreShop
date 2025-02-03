import { FcGoogle } from "react-icons/fc";
import { FaCheckSquare } from "react-icons/fa";
import { Button, notification } from "antd";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { LoginAuth } from "../../service/Auth";
import { login } from "../../redux/actions/Auth";
import { useNavigate } from "react-router-dom";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      if (res && res.data.EC === 0) {
        dispatch(login(res.data.data.token, res.data.data.user));
        api["success"]({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn đã quay trở lại",
        });
        navigate("/");
      } else {
        api["error"]({
          message: "Lỗi đăng nhập",
          description: res.data.message || "Đăng nhập không thành công",
        });
      }
    } catch (error) {
      api["error"]({
        message: "Lỗi đăng nhập",
        description: "Đã có lỗi xảy ra, vui lòng thử lại sau",
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

  return (
    <div className="min-h-screen flex">
      {contextHolder}
      {/* Left side - Image */}
      <div className="w-8/12">
        <img
          src="https://marketplace.canva.com/EAFfT9NH-JU/1/0/1600w/canva-gray-minimalist-fashion-big-sale-banner-TvkdMwoxWP8.jpg"
          className="w-full h-full object-cover"
          alt="Banner"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-1/3 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <form className="flex flex-col w-full pb-6 text-center">
            <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
              Sign In
            </h3>
            <p className="mb-4 text-grey-700">Enter your email and password</p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <FcGoogle size={30} />
              <button className="px-4 py-2 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300">
                Sign in with Google
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
            <input
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
                  Keep me logged in
                </span>
              </label>
              <div
                className="text-sm font-medium text-purple-blue-500 cursor-pointer"
                onClick={() => handleForget()}
              >
                Forget password?
              </div>
            </div>

            <button className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
              Sign In
            </button>

            <div className="-mt-20">
              <p className="text-sm leading-relaxed text-grey-900">
                Not registered yet?{" "}
                <button
                  className="font-bold text-grey-700"
                  onClick={() => navigate("/")}
                >
                  Create an Account
                </button>
              </p>
            </div>
          </form>
        </div>
        <ForgetPassword
          open={open}
          loading={loading}
          setOpen={setOpen}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default LoginForm;
