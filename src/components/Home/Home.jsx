import { Card, Skeleton } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Home.css";
// Import Swiper styles
import "swiper/css";
import { Pagination } from "swiper/modules";
import { useNavigate, useOutletContext } from "react-router-dom";
import Clothing from "./Clothing/Clothing";
import { useState, useEffect } from "react";

const Home = () => {
  const { ListProducts } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const SkeletonCard = () => (
    <Card
      style={{ width: 280 }}
      cover={
        <Skeleton.Image active={true} style={{ width: "100%", height: 200 }} />
      }
    >
      <Skeleton active={true} paragraph={{ rows: 2 }} className="mt-2" />
    </Card>
  );

  const handleDetails = (id) => {
    navigate(`product/${id}`);
  };
  return (
    <div className="m-auto ">
      <div className="m-3">
        <h1 className=" text-xl font-bold h1_main">SẢN PHẨM NỔI BẬT</h1>
        {/* <div className="">
          <ul className="flex items-center gap-4">
            <li>ÁO</li>
            <li>QUẦN</li>
            <li>GIÀY</li>
            <li>MŨ</li>
            <li>DÉP</li>
          </ul>
        </div> */}
      </div>
      <div className="flex gap-5 mx-4 category_main ">
        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {loading
            ? [...Array(5)].map((_, index) => (
                <SwiperSlide key={`skeleton-${index}`}>
                  <SkeletonCard />
                </SwiperSlide>
              ))
            : ListProducts &&
              ListProducts.length > 0 &&
              ListProducts.map((item, index) => {
                return (
                  <SwiperSlide
                    key={item._id}
                    onClick={() => handleDetails(item._id)}
                  >
                    <Card
                      hoverable
                      style={{
                        width: 280,
                      }}
                      cover={
                        <div className="hover_children">
                          <img alt="example" src={item.images[0]} />

                          <div className="p-2 h-20 size g-2 hover">
                            <p className="font-bold text-[#000]">
                              Thêm vào giỏ hàng
                            </p>
                            <div className="flex justify-center items-center mt-3">
                              {item.size &&
                                item.size.length > 0 &&
                                item.size.map((item, index) => {
                                  return (
                                    <div key={index}>
                                      <span
                                        className="p-2 text-center text-xs "
                                        key={index}
                                      >
                                        {item}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <div className="discount ">
                        <p className="text-[#111] font-semibold p-1">
                          {item.brand}
                        </p>
                        <p className="text-[#111] font-semibold text-nowrap p-1">
                          {item.name}
                        </p>
                        <span className="line-through text-[#222] opacity-60 p-1">
                          {item.discount ? (
                            <span>{formatPrice(item.price)}</span>
                          ) : (
                            ""
                          )}
                        </span>
                        <span className="px-3">
                          {item.discountedPrice
                            ? formatPrice(item.discountedPrice)
                            : formatPrice(item.price)}
                        </span>
                      </div>
                    </Card>
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </div>
      <div className=" mt-4">
        <h1 className="ml-4 mt-3 text-xl font-bold">GỢI Ý SẢN PHẨM CHO BẠN</h1>
        <Clothing ListProducts={ListProducts} />
      </div>
    </div>
  );
};

export default Home;
