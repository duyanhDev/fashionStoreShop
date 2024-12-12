import { useEffect, useState } from "react";
import "./ClothingMale.css";
import { Radio, Space, Slider, Button, Card, Skeleton } from "antd";
import { Link, useParams } from "react-router-dom";
import { CategoryProductsGender } from "../../service/ApiCategory";

const ClothingMale = () => {
  const [priceFitter, setPriceFitter] = useState(1000000);
  const [products, setProducts] = useState([]);
  const param = useParams();
  const [loading, setLoading] = useState(true);
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };
  const marks = {
    0: <span>0VND</span>,
    100: <span className="increase">{priceFitter}VND</span>,
  };

  const [value, setValue] = useState(1);
  const [selectedValues, setSelectedValues] = useState([]);
  const [color, setColor] = useState("");
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedValues((prev) => [...prev, value]);
    } else {
      setSelectedValues((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleOnClickColor = (value) => {
    console.log(value);

    setColor(value);
  };
  const SkeletonCard = () => (
    <Card
      style={{ width: 265.8 }}
      cover={
        <Skeleton.Image active={true} style={{ width: "100%", height: 200 }} />
      }
    >
      <Skeleton active={true} paragraph={{ rows: 3 }} />
    </Card>
  );
  const FetchLoadProductGender = async () => {
    setTimeout(() => {
      setLoading(true); // Đặt loading sau 500ms
    }, 300);
    try {
      const res = await CategoryProductsGender(param.gender);
      if (res && res.data && res.data.EC === 0) {
        setTimeout(() => {
          setProducts(res.data.data);
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchLoadProductGender();
  }, [param.gender]);

  console.log(products);

  return (
    <section>
      <div className="flex colletion">
        <div className="colletion_left">
          <div>
            <h1>Loại sản phẩm</h1>
            <Radio.Group className="mr-5" onChange={onChange} value={value}>
              <Space direction="vertical">
                <Radio value={1}>Áo</Radio>
                <Radio value={2}>Quần</Radio>
                <Radio value={3}>Giày</Radio>
                <Radio value={4}>Túi</Radio>
              </Space>
            </Radio.Group>
          </div>
          <div>
            <h1 className="mt-2">Bộ sưu tập</h1>
            <Radio.Group className="mr-5" onChange={onChange} value={value}>
              <Space direction="vertical">
                <Radio value={1}>Áo sơ mi</Radio>
                <Radio value={2}>Áo thun</Radio>
                <Radio value={3}>Áo khoác</Radio>
                <Radio value={4}>Áo polo</Radio>
                <Radio value={5}>Quần jean</Radio>
                <Radio value={6}>Quần tây</Radio>
                <Radio value={7}>Quần âu</Radio>
                <Radio value={7}>Quần âu âu</Radio>
                <Radio value={10}>Giày tây</Radio>
                <Radio value={11}>Giày lười</Radio>
                <Radio value={12}>Giày Boat</Radio>
              </Space>
            </Radio.Group>
          </div>

          <div className="mt-2">
            <h1>Kích cỡ</h1>
            <div className="w-52 collection_size">
              <ul className="flex items-center flex-wrap">
                {["S", "M", "L", "XL", "XXL", "28", "29", "30", "31", "32"].map(
                  (size) => (
                    <li className="size_products" key={size}>
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        value={size}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor={`size-${size}`}>
                        <span>{size}</span>
                      </label>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="mt-2">
            <h1>Màu sắc</h1>
            <div className="grid grid-cols-4 -ml-6 ">
              <div className="filter-select-color__item-list flex justify-center">
                <input
                  type="radio"
                  id="color_yellow"
                  name="color" // Ensure all radio buttons share the same name
                  className="m-auto flex items-center mt-2"
                  value="yellow"
                  onChange={() => handleOnClickColor("yellow")}
                />
                <label htmlFor="color_yellow">
                  <div className="filter-select-color_button flex items-center justify-center m-auto"></div>
                  <span className="text-center">Vàng</span>
                </label>
              </div>
              <div className="filter-select-color__item-list flex justify-center">
                <input
                  type="radio"
                  id="color_green"
                  name="color" // Ensure all radio buttons share the same name
                  className="m-auto flex items-center mt-2"
                  value="green"
                  onChange={() => handleOnClickColor("green")}
                />
                <label htmlFor="color_green">
                  <div className="filter-select-green flex items-center justify-center m-auto"></div>
                  <span className="text-center">Xanh lá</span>
                </label>
              </div>

              <div className="filter-select-color__item-list flex justify-center ">
                <input
                  type="radio"
                  id="color_black"
                  name="color"
                  className="m-auto flex items-center mt-2"
                  value="black"
                  onChange={() => handleOnClickColor("black")}
                />

                <label htmlFor="color_black">
                  <div className="filter-select-black flex items-center justify-center m-auto"></div>
                  <span className="text-center m">Đen</span>
                </label>
              </div>
              <div className="filter-select-color__item-list flex justify-center  ">
                <input
                  type="radio"
                  id="color_red"
                  name="color"
                  className="m-auto flex items-center mt-2"
                  value="red"
                  onChange={() => handleOnClickColor("red")}
                />
                <label htmlFor="color_red">
                  <div className="filter-select-red flex items-center justify-center m-auto"></div>
                  <span className="text-center m">Đỏ</span>
                </label>
              </div>
              <div className="filter-select-color__item-list flex justify-center ">
                <input
                  type="radio"
                  id="color_white"
                  name="color"
                  className="m-auto flex items-center mt-2"
                  value="white"
                  onChange={() => handleOnClickColor("white")}
                />
                <label htmlFor="color_white">
                  <div className="filter-select-white flex items-center justify-center m-auto"></div>
                  <span className="text-center m">trắng</span>
                </label>
              </div>
            </div>
            <div className="w-52">
              <div>
                <h1>Lọc theo giá</h1>
              </div>
              <Slider
                className="w-full"
                marks={marks}
                defaultValue={priceFitter}
                min={0}
                max={1000000}
                step={100000}
                onChange={(value) => setPriceFitter(value)}
              />
            </div>
          </div>
        </div>
        <div className="colletion_right flex-1">
          <div className="w-full">
            <div className="flex  items-center ">
              <Link>
                <h1 className="text-[#a3a3a3]">Trang chủ</h1>
              </Link>
              <Link className="ml-3 font-normal products_link relative">
                {" "}
                234 sản phẩm
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <div className="">
              <p className="text-4xl text-black font-bold">
                Một số sản phẩm bán chạy
              </p>
            </div>

            <div className="mt-5 flex gap-4 items-center flex-nowrap border-b border-gray-200 p-2 sm:flex-wrap lg:flex-nowrap ">
              <div className="flex gap-4 ml-6">
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
                <div className="w-32">
                  <div>
                    <img
                      className="img_male"
                      src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT009.13.jpg"
                      alt="lỗi"
                    />
                  </div>
                  <div className="text-center">
                    <p>ÁO nam</p>
                  </div>
                </div>
              </div>
            </div>
            {/* main menu nam nu */}
            <div className="mt-3 ">
              <div className="">
                <ul className="flex items-center justify-between gap-3">
                  <li className="male_clothing">
                    <span>Áo khoác nam</span>
                  </li>
                  <li className="male_clothing">
                    <span>Áo thun nam</span>
                  </li>
                  <li className="male_clothing">
                    <span>Áo sơ mi nam</span>
                  </li>
                  <li className="male_clothing">
                    <span>Quần jean nam</span>
                  </li>
                  <li className="male_clothing">
                    <span>Quần ngắn nam</span>
                  </li>
                  <li className="male_clothing">
                    <span>Quần dài nam </span>
                  </li>
                  <li className="male_clothing">
                    <span>Quần Jogger nam</span>
                  </li>
                  <li className="male_clothing">
                    <span>Giày nam</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* sản phẩm */}
            <div className="mt-3 male_left">
              <div className="flex flex-wrap gap-2">
                {loading
                  ? [...Array(12)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  : products &&
                    products.length > 0 &&
                    products.map((product, index) => {
                      return (
                        <div
                          className="main_product_male cursor-pointer mt-5"
                          key={index + 1}
                        >
                          <div className="w-10 h-10 absolute right-0">
                            <span className="percent">{product.discount}%</span>
                          </div>
                          <div>
                            <img
                              src={product.images[0].url}
                              alt="ảnh"
                              className="image_product_gender"
                            />
                          </div>
                          <div className="mt-2">
                            <h1 className=" main_product_male_h1">
                              {product.name}
                            </h1>
                            <div className="flex gap-5 items-center justify-center">
                              <span className="line-through text-red-500">
                                {formatPrice(product.price)}
                              </span>
                              <span>
                                {formatPrice(product.discountedPrice)}
                              </span>
                            </div>
                          </div>
                          <div className="text-center m-2">
                            <Button>Xem chi tiết sản phẩm</Button>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClothingMale;
