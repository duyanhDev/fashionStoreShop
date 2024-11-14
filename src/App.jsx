import { Link, Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { getListProductsAPI } from "./service/ApiProduct";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CartListProduct } from "./service/Cart";
function App() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const [ListProducts, setListProducts] = useState([]);
  const [ListCart, setListCard] = useState([]);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const ListProducsData = async () => {
    try {
      let res = await getListProductsAPI();

      if (res && res.data.EC === 0) {
        setListProducts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ListProducsData();
  }, []);

  const CartListProductsUser = async () => {
    if (!user?._id) {
      // Handle the case where user._id is not available
      setError("User is not authenticated");
      return;
    }

    try {
      const res = await CartListProduct(user._id);
      if (res && res.data && res.data.EC === 0) {
        setListCard(res.data.data);
      } else {
        setError("Failed to fetch cart products");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching the cart");
    }
  };

  useEffect(() => {
    CartListProductsUser();
  }, [user._id]);

  return (
    <div className="container_nav">
      <div className="nav_header">
        <Header
          user={user}
          ListCart={ListCart}
          CartListProductsUser={CartListProductsUser}
        />
        <div className="nav_menu flex justify-center items-center gap-3">
          <ul className="flex gap-10">
            <li>
              <Link>Sản phẩm</Link>
            </li>
            <li>
              <Link>Nam</Link>
            </li>
            <li>
              <Link>Nữ</Link>
            </li>
            <li>
              <Link>Phụ kiện</Link>
            </li>
            <li>
              <Link>Thương hiệu</Link>
            </li>
            <li>
              <Link>Xếp hạng</Link>
            </li>
            <li>
              <Link>Độc nhất</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="dolin_swiper w-full  ">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              className="w-full object-cover"
              src="https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/November2024/Hero_Banner_-_Desktop_1_SL_FW.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full object-cover"
              src="https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/November2024/Hero_Banner_-_Desktop_2_JK.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full object-cover"
              src="https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/October2024/1920_x_788_hero_banner2.jpg"
            />
          </SwiperSlide>

          <div className="autoplay-progress" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle}>
              <circle cx="24" cy="24" r="20"></circle>
            </svg>
            <span ref={progressContent}></span>
          </div>
        </Swiper>
      </div>
      <div className="content">
        <Outlet
          context={{ ListProducts, CartListProductsUser, ListCart, user }}
        />
      </div>
    </div>
  );
}

export default App;
