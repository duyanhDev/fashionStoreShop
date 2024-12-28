import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import {
  IoSearch,
  IoNotificationsOutline,
  IoCartOutline,
} from "react-icons/io5";
import Avatar from "antd/es/avatar/avatar";
import { Dropdown, Button, Drawer } from "antd";
import {
  CloseCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/Auth";
import { useEffect, useState } from "react";
import { RemoveCartOnePorduct } from "../../service/Cart";
import ClipLoader from "react-spinners/ClipLoader";
import {
  FetcDataNocatifions,
  UpdateDataNocatifions,
} from "../../service/ApiNocatifions";

const Header = ({ user, ListCart, CartListProductsUser }) => {
  console.log(user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showHiden, setShowHiden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [loadingCart, setLoadingCart] = useState(true);
  const [DataNotifications, setDataNotifications] = useState([]);
  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
      label: "Đơn hàng",
      extra: "⌘B",
      onClick: () => {
        navigate("/order");
      },
    },
    {
      key: "4",
      label: "Settings",
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
    user &&
      user.isAdmin === true && {
        key: "4",
        label: "Admin",
        icon: <SettingOutlined />,
        extra: "⌘S",
        onClick: () => {
          navigate("/admin");
        },
      },

    {
      key: "5",
      label: user?.name ? "Đăng Xuất" : "Đăng Nhập",
      icon: <LogoutOutlined />,
      extra: "⌘S",
      onClick: handleLogOut, // Move the onClick here
    },
  ];
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0đ"; // Fallback value or any other default handling
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handleRemoveCartProduct = async (id) => {
    try {
      setLoadingSpin(true);
      const res = await RemoveCartOnePorduct(ListCart._id, id, user._id);

      if (res.data) {
        setTimeout(() => {
          setLoadingSpin(false);
          CartListProductsUser();
        }, 3000);
      }
    } catch (error) {
      setLoadingSpin(false);
      console.error("Error in handleRemoveCartProduct:", error);
    }
  };
  const handlePay = () => {
    setLoadingCart(true);
    try {
      setOpen(false);
      const timer = setTimeout(() => {
        setLoadingCart(false);
      }, 3000);
      navigate("cart");
      return () => clearTimeout(timer);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleShowNocations = () => {
    setShowHiden(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const FetchDataNocatifionsAPI = async () => {
    try {
      let res = await FetcDataNocatifions(user._id);
      if (res && res.data && res.data.EC === 0) {
        setDataNotifications(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    FetchDataNocatifionsAPI();
  }, []);

  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) {
      return "Vừa xong";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  }

  const handleBtnNocafition = async (id, orderId) => {
    try {
      navigate(`/orderstatus/${orderId}`);
      let res = await UpdateDataNocatifions(id);

      if (res && res.data && res.data.EC === 0) {
        FetchDataNocatifionsAPI();
        setShowHiden(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full flex justify-between items-center h-full m-auto">
      <div className="flex items-center doin_image">
        <ul className="flex items-center justify-between">
          <li className="px-5">
            <Link to="/">
              <img
                src="https://dosi-in.com/images/assets/icons/logo.svg"
                alt="Logo"
              />
            </Link>
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
          <li className="px-5 relative" onClick={handleShowNocations}>
            <IoNotificationsOutline size={30} />
            {DataNotifications && DataNotifications.length > 0 ? (
              <span className="cart_items mr-1">
                {DataNotifications.filter((item) => !item.read).length}
              </span>
            ) : (
              <span className="cart_items mr-1">0</span>
            )}
          </li>
          <li className="px-5 relative" onClick={showLoading}>
            <IoCartOutline size={30} />
            {
              ListCart && ListCart.items ? (
                <span className="cart_items">{ListCart.items.length}</span>
              ) : (
                <span className="cart_items">0</span>
              ) // Show 0 if ListCart is empty or undefined
            }
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
        <Drawer
          closable
          destroyOnClose
          title={<p>Giỏ Hàng Của Bạn </p>}
          placement="right"
          open={open}
          loading={loading}
          onClose={() => setOpen(false)}
          className="relative"
        >
          {/* <Button
            type="primary"
            style={{
              marginBottom: 16,
            }}
            onClick={showLoading}
          >
            Reload
          </Button> */}
          {ListCart && ListCart.items && ListCart.items.length > 0 ? (
            ListCart.items.map((cart, index) => {
              return (
                <div className="">
                  <div
                    className="flex gap-3 w-full border-b-2 items-center "
                    key={index}
                  >
                    <div>
                      <img
                        src={cart.productId.images[0].url}
                        alt={cart.productId.name}
                        width={100}
                      />
                    </div>
                    <div className="cart_dosi ml-2 flex-1">
                      <div>
                        <p className="text-base font-bold ">
                          {cart.productId.name}
                        </p>
                      </div>
                      <div className="mt-2">
                        <span>Số lượng : {cart.quantity}</span>
                      </div>
                      <div className="mt-2">
                        <span>Size : {cart.size}</span>
                      </div>
                      <div className="mt-2">
                        <span>Màu : {cart.color}</span>
                      </div>
                      <div className="mt-2 whitespace-nowrap">
                        <span>
                          Tổng giá : {formatPrice(cart.totalItemPrice)}
                        </span>
                      </div>
                    </div>
                    <div
                      className="mt-1 self-start"
                      onClick={() => handleRemoveCartProduct(cart._id)}
                    >
                      <CloseCircleOutlined />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <span>Giỏ hàng chưa có gì :(, chọn mua đồ bạn nhé)</span>
          )}
          {ListCart && ListCart.items && ListCart.items.length > 0 ? (
            <>
              <p className="font-semibold text-base ml-5 mt-2 whitespace-nowrap">
                Tổng giá tiền tất cả sản phẩm :{" "}
                {ListCart && ListCart.totalPrice !== undefined
                  ? formatPrice(ListCart.totalPrice)
                  : "0đ"}
              </p>
              <Button
                className="flex justify-center w-3/4 items-center ml-14 mt-1"
                type="primary"
                onClick={() => handlePay()}
              >
                Thanh Toán
              </Button>
            </>
          ) : (
            <div></div>
          )}
          {loadingSpin && (
            <div className="overlay flex items-center justify-center w-full h-full">
              <ClipLoader className="" />
            </div>
          )}
        </Drawer>

        <Drawer
          closable
          destroyOnClose
          title={<p>Thông Báo</p>}
          placement="right"
          open={showHiden}
          loading={loading}
          onClose={() => setShowHiden(false)}
        >
          <Button
            type="primary"
            style={{
              marginBottom: 16,
            }}
            onClick={handleShowNocations}
          >
            Reload
          </Button>
          {DataNotifications && DataNotifications.length > 0 ? (
            DataNotifications.map((item) => {
              return (
                item.read === false && (
                  <>
                    <div
                      className="border-b-2 p-1 cursor-pointer"
                      onClick={() =>
                        handleBtnNocafition(item._id, item.orderId)
                      }
                    >
                      {item.message}
                      <div className="mt-1">
                        {formatTimeAgo(item.createdAt)}
                      </div>
                    </div>
                  </>
                )
              );
            })
          ) : (
            <>
              <p>Hiện tại không có thông báo nào</p>
            </>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
