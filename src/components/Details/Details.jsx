import "./Details.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Rate, Button, Flex, notification, Image } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useOutletContext, useParams } from "react-router-dom";
import { ListOneProductAPI } from "../../service/ApiProduct";
import { AddCartAPI } from "../../service/Cart";
import { useSelector } from "react-redux";

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
  const { user } = useSelector((state) => state.auth);

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

  const handleAddProduct = async () => {
    // Kiểm tra nếu size hoặc color chưa được chọn
    if (!sizeCart || !colorCart) {
      api.open({
        message: "Lỗi",
        description:
          "Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng.",
        duration: 3,
        type: "warning", // Có thể sử dụng loại 'error' hoặc 'warning' tùy theo ngữ cảnh
      });
      return; // Ngăn không cho gọi API nếu điều kiện không thỏa mãn
    }

    try {
      const res = await AddCartAPI(
        user._id,
        param.id,
        count,
        sizeCart,
        colorCart
      );
      if (res && res.data && res.data.cart) {
        api.open({
          message: "Đã thêm vào giỏ hàng",
          description: (
            <div className="flex gap-2 p-2 ">
              <img src={image[0]} className="img_cart" alt="lỗi" />
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
      // Thêm xử lý lỗi nếu cần
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
                        src={image}
                        preview={{
                          src: image,
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
                      <img src={image} />
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
                  {stock} sản phẩm có sẵn
                </h4>
              </div>
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
    </div>
  );
};

export default Details;
