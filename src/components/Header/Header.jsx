import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import {
  IoSearch,
  IoNotificationsOutline,
  IoCartOutline,
} from "react-icons/io5";
import Avatar from "antd/es/avatar/avatar";
import { Dropdown } from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/Auth";

const Header = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: user?.name || "My name", // Safely access user.name with optional chaining
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      extra: "⌘P",
    },
    {
      key: "3",
      label: "Billing",
      extra: "⌘B",
    },
    {
      key: "4",
      label: "Settings",
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
    {
      key: "5",
      label: user?.name ? "Đăng Xuất" : "Đăng Nhập",
      icon: <LogoutOutlined />,
      extra: "⌘S",
      onClick: handleLogOut, // Move the onClick here
    },
  ];

  return (
    <div className="w-full flex justify-between items-center h-full m-auto">
      <div className="flex items-center doin_image">
        <ul className="flex items-center justify-between">
          <li className="px-5">
            <img
              src="https://dosi-in.com/images/assets/icons/logo.svg"
              alt="Logo"
            />
          </li>
          <li>
            <Link className="text_shop text-xl">Shopping</Link>
          </li>
          <li className="px-5 text-xl">Style</li>
        </ul>
      </div>
      <div className="input relative flex items-center">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          className="w-full outline-none"
        />
        <IoSearch color="#ccc" className="absolute left-0 m-4 text-2xl" />
      </div>
      <div className="w-3/12 flex justify-between doin_right px-5">
        <ul className="flex justify-end w-full">
          <li className="px-5">
            <IoNotificationsOutline size={30} />
          </li>
          <li className="px-5">
            <IoCartOutline size={30} />
          </li>
          <li className="px-5">
            {user ? (
              <Dropdown
                menu={{
                  items,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                </a>
              </Dropdown>
            ) : (
              <Dropdown
                menu={{
                  items,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Avatar />
                </a>
              </Dropdown>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
