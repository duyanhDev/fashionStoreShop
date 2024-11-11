import "./Details.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Rate, Button, Flex } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { ListOneProductAPI } from "../../service/ApiProduct";

const Details = () => {
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

  const param = useParams();

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
  console.log(total);

  return (
    <div className="Details w-full">
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
                      <img src={image} />
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
                {color &&
                  color.length > 0 &&
                  color.map((color, index) => {
                    if (color === "đen") {
                      return <div className="color_black" key={index}></div>;
                    } else if (color === "trắng") {
                      return <div className="color_white" key={index}></div>;
                    } else if (color === "vàng") {
                      return <div className="color_yellor" key={index}></div>;
                    } else {
                      return <div className="color_red" key={index}></div>;
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
                  size.map((item, index) => {
                    return (
                      <>
                        <Button key={index}>{item}</Button>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="border border-b-2">
            <div className="p-4">
              <div className="flex items-center gap-1">
                <h4 className="text-[#b3b3b3] font-normal text-sm">
                  {stock} sản phẩm có sẵn
                </h4>
              </div>
              <div className=" flex items-center gap-1">
                <div className="flex items-center m-3 number-input-group ">
                  <Button
                    className=" w-3 border-none outline-none"
                    style={{ background: "none" }}
                    onClick={() => handleDecrements()}
                  >
                    <MinusOutlined />
                  </Button>
                  <input
                    type="number"
                    disabled
                    className="w-full text-center ml-4"
                    min={1}
                    value={count}
                  />
                  <Button
                    className="w-3 border-none outline-none"
                    style={{ background: "none", outline: "none" }}
                    onClick={() => handleIncrment()}
                  >
                    <PlusOutlined />
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
