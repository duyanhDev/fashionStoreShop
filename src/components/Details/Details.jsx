import "./Details.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Rate, Button, Flex, notification, Image, Avatar, Input } from "antd";
import { HeartOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useOutletContext, useParams } from "react-router-dom";
import {
  ListOneProductAPI,
  PutFeedbackProductAPI,
  toggleLikeRatingAPI,
} from "../../service/ApiProduct";
import { AddCartAPI } from "../../service/Cart";
import { useSelector } from "react-redux";
import { fetchTotalProductsSoldAPI } from "../../service/totalProduct";
import ReactPaginate from "react-paginate";
const Details = () => {
  const [api, contextHolder] = notification.useNotification();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDisscount] = useState("");
  const [pricediscount, setPricedisscount] = useState("");
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [sizeCart, SetSizeCart] = useState("");
  const [colorCart, SetcolorCart] = useState("");
  const { CartListProductsUser } = useOutletContext();
  const [checked, setChecked] = useState(false);
  const param = useParams();
  const [SelectedColor, setSelectedColor] = useState("");
  const [SelectedSize, setSelectedSize] = useState("");
  const [CheckSelectedSize, setCheckSelectedSize] = useState(false);
  const [feedback, setFeedBack] = useState([]);
  const ratings = 5;
  const [review, setReivew] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [sumProducts, setSumProducts] = useState([]);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(feedback.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentFeedback = feedback.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const onChange = (value) => {
    console.log("changed", value);
  };
  const [count, setCount] = useState(1);

  const handleIncrment = (value) => {
    setCount(count + 1);
  };

  const handleDecrements = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const FetchAPIDetaillProuduct = async () => {
    try {
      const res = await ListOneProductAPI(param.id);

      if (res && res.data && res.data.EC === 0) {
        setName(res.data.data.name || "");
        setDescription(res.data.data.description);
        setBrand(res.data.data.brand || "");
        setPrice(res.data.data.price || "");
        setDisscount(res.data.data.discount || "");
        setPricedisscount(res.data.data.discountedPrice || "");
        setImage(res.data.data.images || []);
        setStock(res.data.data.stock || "");
        setSize(res.data.data.size || []);
        setColor(res.data.data.color || []);
        setFeedBack(res.data.data.ratings || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchAPIDetaillProuduct();
  }, []);

  const total = pricediscount ? count * pricediscount : count * price;

  const handleSize = (item) => {
    setSelectedSize(item);
    setCheckSelectedSize(true);
    SetSizeCart(item);
  };

  const handleColor = (item) => {
    setChecked(true);
    setSelectedColor(item);
    SetcolorCart(item);
  };

  const priceShift = discount ? pricediscount : price;

  const handleAddProduct = async () => {
    if (!user) {
      api.open({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
        duration: 3,
        type: "warning",
      });
      // navigation("/login");
      return;
    }

    if (!sizeCart || !colorCart) {
      api.open({
        message: "Lỗi",
        description:
          "Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng.",
        duration: 3,
        type: "warning",
      });
      return;
    }
    if (stock <= 0) {
      api.open({
        message: "Sản phẩm đã bán hết",
        description:
          "Vui lòng khách hàng đợi shop nhập thêm hoặc mua sản phẩm mới",
        duration: 3,
        type: "warning",
      });
      return;
    }
    if (count > stock) {
      api.open({
        message: `Sản phẩm  hiện giờ chỉ còn ${stock} sản phẩm`,
        description: `Khách hàng chỉnh số lượng cho phù hợp với số lượng sản phẩm`,
        duration: 3,
        type: "warning",
      });
      return;
    }
    try {
      const res = await AddCartAPI(
        user._id,
        param.id,
        count,
        sizeCart,
        colorCart,
        priceShift
      );

      if (res && res.data && res.data.cart) {
        api.open({
          message: "Đã thêm vào giỏ hàng",
          description: (
            <div className="flex gap-2 p-2 ">
              <img src={image[0].url} className="img_cart" alt="lỗi" />
              <div>
                <h1 className="whitespace-nowrap">{name}</h1>
                <h1>{`${colorCart} / ${sizeCart}`}</h1>
                <h1>{`${pricediscount} / ${price}`}</h1>
              </div>
            </div>
          ),
          duration: 15,
        });
        CartListProductsUser();
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  const fetchTotalProductsSold = async () => {
    try {
      const res = await fetchTotalProductsSoldAPI();
      if (res && res.data) {
        const data = res.data.productsSold.filter(
          (product) => product.productId === param.id
        );

        setSumProducts(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchTotalProductsSold();
  }, []);

  const handleFeedBack = async () => {
    try {
      const res = await PutFeedbackProductAPI(
        param.id,
        user._id,
        ratings,
        review
      );

      if (res && res.data) {
        setReivew("");
        FetchAPIDetaillProuduct();
      }
    } catch (error) {}
  };

  const hanldetoggleLikeRatingAPI = async (ratings) => {
    try {
      const res = await toggleLikeRatingAPI(param.id, ratings, user._id);

      if (res && res.data && res.data.success === true) {
        FetchAPIDetaillProuduct();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Details w-full">
      {contextHolder}
      <div className="Details_main flex">
        <div className="w-1/2">
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2 "
          >
            {image &&
              image.length > 0 &&
              image.map((image, index) => {
                return (
                  <>
                    <SwiperSlide key={index}>
                      <Image
                        src={image.url}
                        preview={{
                          src: image.url,
                        }}
                      />
                    </SwiperSlide>
                  </>
                );
              })}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper"
          >
            {image &&
              image.length > 0 &&
              image.map((image, index) => {
                return (
                  <>
                    <SwiperSlide key={index}>
                      <img src={image.url} />
                    </SwiperSlide>
                  </>
                );
              })}
          </Swiper>
        </div>
        <div className="w-1/2 doisi_detail__main">
          <div className="border border-b-2 ">
            <div className="p-4">
              <span className="text-[#484848] font-normal text-sm">
                Thương hiệu :{" "}
              </span>
              <span className="text-pink-gradient uppercase">{brand}</span>
              <div>
                <h1 className="text-[#484848] text-base">{name}</h1>
                <h1 className="text-[#484848] text-base">{description}</h1>
              </div>
            </div>
          </div>

          <div className="border border-b-2">
            <div className="p-4">
              <div className=" flex items-center gap-2">
                <h1 className=" text-3xl text-black">
                  {pricediscount
                    ? formatPrice(pricediscount)
                    : formatPrice(price)}
                </h1>
                <span className="text-[#b3b3b3] font-normal text-sm">
                  {discount ? formatPrice(price) : ""}
                </span>
                <span className="text-[#fe252c] font-normal text-sm">
                  {discount ? `${discount}% ` : ""}
                </span>
              </div>
              <h1>
                <Rate />
              </h1>
            </div>
          </div>
          <div className="border border-b-2">
            <div className="p-4">
              <div className="flex items-center gap-1 ">
                <h4 className="font-normal text-sm border-r pr-1">Màu sắc</h4>
                <span className="text-[#b3b3b3] font-normal text-sm">
                  {color.length} màu
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 cursor-pointer">
                {color.map((color, index) => {
                  if (color === "đen") {
                    return (
                      <div
                        className={`${
                          SelectedColor === color && checked
                            ? `colorBtn color_black`
                            : `color_black`
                        }`}
                        key={index}
                        onClick={() => handleColor(color)} // Corrected: Passes a function
                      ></div>
                    );
                  } else if (color === "trắng") {
                    return (
                      <div
                        className={`${
                          SelectedColor === color && checked
                            ? `colorBtn`
                            : `color_white`
                        }`}
                        key={index}
                        onClick={() => handleColor(color)}
                      ></div>
                    );
                  } else if (color === "vàng") {
                    return (
                      <div
                        className={`${
                          SelectedColor === color && checked
                            ? `colorBtn color_yellor`
                            : `color_yellor`
                        }`}
                        key={index}
                        onClick={() => handleColor(color)}
                      ></div>
                    );
                  } else {
                    return (
                      <div
                        className={`${
                          SelectedColor === color && checked
                            ? `colorBtn color_red`
                            : `color_red`
                        }`}
                        key={index}
                        onClick={() => handleColor(color)}
                      ></div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <div className="border border-b-2">
            <div className="p-4">
              <div className="flex items-center gap-1">
                <h4 className="font-normal text-sm border-r pr-1">
                  Kích thước
                </h4>
                <span className="text-[#b3b3b3] font-normal text-sm">
                  {size.length}
                </span>
              </div>
              <div className="flex items-center gap-1 m-3">
                {size &&
                  size.length > 0 &&
                  size.map((item, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSize(item)}
                      className={`${
                        CheckSelectedSize && SelectedSize === item
                          ? "bg-black text-[#fff]"
                          : ""
                      }`}
                    >
                      {item}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
          <div className="border border-b-2">
            <div className="p-4">
              <div className="flex items-center gap-1">
                <span className="">Tổng Tiền : {formatPrice(total)}</span>
              </div>
            </div>
          </div>
          <div className="border border-b-2">
            <div className="p-4">
              <div className="flex items-center gap-1">
                <h4
                  className="text-[#b3b3b3] font-normal text-sm"
                  onChange={(e) => setStock(e.target.value)}
                >
                  {`${stock > 0 ? `${stock} sản phẩm có sẵn` : "Đã bán hết"} `}
                </h4>
              </div>
              {sumProducts && sumProducts.length > 0 && (
                <div className="flex items-center gap-1">
                  <h4
                    className="text-[#b3b3b3] font-normal text-sm"
                    onChange={(e) => setStock(e.target.value)}
                  >
                    {sumProducts[0].quantity} sản phẩm đã bán
                  </h4>
                </div>
              )}
              <div className=" flex items-center gap-1">
                <div className="flex items-center m-3 number-input-group ">
                  <Button
                    className=" w-10 h-10  border-none outline-none"
                    style={{ background: "none" }}
                    onClick={() => handleDecrements()}
                  >
                    <MinusOutlined />
                  </Button>
                  <input
                    type="number"
                    disabled
                    className="w-10 h-10 text-center "
                    min={1}
                    value={count}
                  />
                  <Button
                    className="w-10 h-10 border-none outline-none "
                    style={{ background: "none", outline: "none" }}
                    onClick={() => handleIncrment()}
                  >
                    <PlusOutlined className="mr-6" />
                  </Button>
                </div>
                <div className="w-3/4">
                  <Flex
                    vertical
                    gap="small"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Button
                      type="primary"
                      block
                      style={{ backgroundColor: "black", color: "white" }}
                      onClick={handleAddProduct}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="feedback">
        <div className="w-1/5 star ">
          <div className=" ">
            <h1 className="text-center font-bold text-xl">ĐÁNH GIÁ SẢN PHẨM</h1>
          </div>
          <div className="mt-2">
            <h1 className="text-center text-6xl font-bold">5</h1>
          </div>
          <div className="text-center mt-2">
            <Rate defaultValue={5} size={30} />
          </div>
          <div className="text-center mt-2">
            <p className="text-[#4d4d4d] text-xl italic">
              {feedback && feedback.length} đánh giá
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-center font-bold text-xl">PHẢN HỒI</div>
          {currentFeedback &&
            currentFeedback.map((item) => {
              return (
                <div className="" key={item._id}>
                  <div className="w-full m-4 flex items-center gap-3">
                    {user ? (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={item && item.userId.avatar}
                        alt="avatar lỗi"
                      />
                    ) : (
                      <Avatar>U</Avatar>
                    )}
                    {item && <p>{item.userId.name}</p>}
                  </div>
                  <div className="ml-5 flex gap-2 items-center">
                    <p>{item.review}</p>

                    {item.likes && item.likes.length > 0 ? (
                      <p className="flex items-center gap-1">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="heart"
                          className={`svg-inline--fa fa-heart w-5 ${
                            item.likes.includes(user._id)
                              ? "text-[#ed2b48]"
                              : ""
                          }`}
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          onClick={() => hanldetoggleLikeRatingAPI(item._id)}
                        >
                          {item.likes.includes(user._id) ? (
                            <path
                              fill="currentColor"
                              d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                            ></path>
                          ) : (
                            <path
                              fill="currentColor"
                              d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                            ></path>
                          )}
                        </svg>
                        <span>{item.likes.length}</span>
                      </p>
                    ) : (
                      <p>
                        {" "}
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="far"
                          data-icon="heart"
                          className="svg-inline--fa fa-heart w-5"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          onClick={() => hanldetoggleLikeRatingAPI(item._id)}
                        >
                          <path
                            fill="currentColor"
                            d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                          ></path>
                        </svg>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          <ReactPaginate
            previousLabel={
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="left"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
              </svg>
            }
            nextLabel={
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="right"
                width="16px"
                height="16px"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
              </svg>
            }
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
          <div className="w-full text-center flex justify-center gap-2">
            <Input
              showCount
              maxLength={50}
              onChange={(e) => setReivew(e.target.value)}
              className="w-4/5"
              placeholder="Phản hồi sản phẩm tại đây nhé!!"
              value={review}
            />
            <Button onClick={handleFeedBack}>Gửi phản hồi</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
