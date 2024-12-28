import { useEffect, useState } from "react";
import "./ClothingMale.css";
import { Radio, Space, Slider, Button, Card, Skeleton } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CategoryGenderFitterAPI,
  CategoryProductsGender,
  ListCategoryAPI,
} from "../../service/ApiCategory";
import ReactPaginate from "react-paginate";

const ClothingMale = () => {
  const [priceFitter, setPriceFitter] = useState(0);
  const [hiddenPrice, SetHiddenPrice] = useState(false);
  const [Category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [priceProducts, SetPriceProducts] = useState([]);
  const param = useParams();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [value, setValue] = useState(1);
  const [valueCategory, setValueCategory] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [color, setColor] = useState("");
  const [hiddenProducts, setHiddenProducts] = useState(false);
  const [Fitter, setFitter] = useState(false);
  const location = useLocation();
  const Navigate = useNavigate();

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };
  const marks = {
    0: <span>0VND</span>,
    100: <span className="increase">{priceFitter}VND</span>,
  };

  const onChange = async (e) => {
    setLoading(true);
    setValueCategory(e.target.value);
    setHiddenProducts(true);
    setCurrentPage(1); // Reset to first page when changing category
    setFitter(true);
    const newUrl = `${location.pathname}?category=${e.target.value}`;
    Navigate(newUrl, { replace: true });
    try {
      const res = await CategoryGenderFitterAPI(
        param.gender,
        e.target.value,
        1
      );
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds
      if (res?.data?.EC === 0) {
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);

        if (hiddenPrice && priceFitter > 0) {
          const filteredProducts = res.data.data.filter(
            (product) => Number(product.discountedPrice) >= priceFitter
          );
          SetPriceProducts(filteredProducts);
        }
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
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
  const fetchProducts = async () => {
    setLoading(true); // Set loading state first

    try {
      const res = valueCategory
        ? await CategoryGenderFitterAPI(
            param.gender,
            valueCategory,
            currentPage
          )
        : await CategoryProductsGender(param.gender, currentPage);

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds

      if (res?.data?.EC === 0) {
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);

        if (hiddenPrice && priceFitter > 0) {
          const filteredProducts = res.data.data.filter(
            (product) => Number(product.discountedPrice) >= priceFitter
          );
          SetPriceProducts(filteredProducts);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Set loading to false only after everything is done
    }
  };

  // Thay đổi dependency của useEffect
  useEffect(() => {
    fetchProducts();
  }, [param.gender, currentPage, valueCategory]);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1); // React-Paginate is zero-indexed
  };

  useEffect(() => {
    ListCategoryAPI()
      .then((res) => {
        if (res?.data?.EC === 0) {
          setCategory(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Nếu đang ở chế độ lọc giá và có giá trị lọc
    if (hiddenPrice && priceFitter > 0) {
      FilterPriceProduct(priceFitter);
    }
  }, [currentPage]); // Phụ thuộc vào sự thay đổi của trang

  const FilterPriceProduct = async (value, categoryValue = valueCategory) => {
    setLoading(true);
    setPriceFitter(value);
    const newUrl = `${location.pathname}?price=${value}`;
    Navigate(newUrl, { replace: true });
    setTimeout(async () => {
      try {
        let res;
        if (categoryValue) {
          res = await CategoryGenderFitterAPI(
            param.gender,
            categoryValue,
            currentPage
          );
        } else {
          res = await CategoryProductsGender(param.gender, currentPage);
        }

        if (res && res.data && res.data.EC === 0) {
          const filteredProducts = res.data.data.filter((product) => {
            const price = Number(product.discountedPrice);
            return price >= value;
          });

          SetHiddenPrice(true);
          SetPriceProducts(filteredProducts);
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lọc sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  useEffect(() => {
    setPriceFitter(0);
    setCurrentPage(1);
    SetHiddenPrice(false);
  }, [location.pathname]);

  const handleFitterProduct = async () => {
    setLoading(true);
    try {
      setLoading(false);
      setFitter(false);
      setValueCategory("");
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <section>
      <div className="flex colletion">
        <div className="colletion_left">
          <div>
            <h1>Loại sản phẩm</h1>
            <Radio.Group
              className="mr-5"
              onChange={onChange}
              value={valueCategory}
            >
              <Space direction="vertical">
                {Category &&
                  Category.length > 0 &&
                  Category.map((Category) => {
                    return (
                      <Radio value={Category._id} key={Category._id}>
                        {Category.name}
                      </Radio>
                    );
                  })}
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
                value={priceFitter} // Đồng bộ giá trị
                min={0}
                max={1000000}
                step={50000}
                onChange={(value) => {
                  setPriceFitter(value); // Cập nhật giá trị khi kéo thanh trượt
                  FilterPriceProduct(value); // Gọi hàm lọc sản phẩm
                }}
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
                {products.length} sản phẩm
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
                  {Fitter && (
                    <li className="male_clothing" onClick={handleFitterProduct}>
                      <span>Xóa Lọc</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {/* sản phẩm */}
            <div className="mt-3 male_left">
              <div className="flex flex-wrap gap-2">
                {hiddenProducts
                  ? loading
                    ? [...Array(12)].map((_, index) => (
                        <SkeletonCard key={index} />
                      ))
                    : products &&
                      !hiddenPrice &&
                      products.length > 0 &&
                      products.map((product, index) => {
                        return (
                          <div
                            className="main_product_male cursor-pointer mt-5"
                            key={index + 1}
                          >
                            <div className="w-10 h-10 absolute right-0">
                              <span className="percent">
                                {product.discount}%
                              </span>
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
                              <Button
                                className=""
                                onClick={() =>
                                  Navigate(`/product/${product._id}`)
                                }
                              >
                                Xem chi tiết sản phẩm
                              </Button>
                            </div>
                          </div>
                        );
                      })
                  : loading
                  ? [...Array(12)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  : products &&
                    !hiddenPrice &&
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
                            <Button
                              className=""
                              onClick={() =>
                                Navigate(`/product/${product._id}`)
                              }
                            >
                              Xem chi tiết sản phẩm
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                {/* /// */}
                {loading
                  ? [...Array(12)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  : // Kiểm tra và hiển thị sản phẩm lọc giá hoặc sản phẩm gốc
                  (hiddenPrice && priceFitter > 0 ? priceProducts : products) &&
                    hiddenPrice &&
                    (priceFitter > 0 ? priceProducts : products).length > 0
                  ? (hiddenPrice && priceFitter > 0
                      ? priceProducts
                      : products
                    ).map((product, index) => (
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
                            <span>{formatPrice(product.discountedPrice)}</span>
                          </div>
                        </div>
                        <div className="text-center m-2">
                          <Button
                            className=""
                            onClick={() => Navigate(`/product/${product._id}`)}
                          >
                            Xem chi tiết sản phẩm
                          </Button>
                        </div>
                      </div>
                    ))
                  : // Chỉ hiển thị khi có giá trị lọc mà không có sản phẩm
                    hiddenPrice &&
                    priceFitter > 0 &&
                    priceProducts.length === 0 && (
                      <>
                        <div className="flex justify-center w-full items-center mt-6">
                          <img
                            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:150:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Review-empty.png"
                            alt="loi"
                          />
                        </div>
                        <div className="flex justify-center items-center w-full mt-8">
                          <p className="font-semibold text-xl">
                            Hiện tại shop chưa tìm được sản phẩm?
                          </p>
                        </div>
                      </>
                    )}
              </div>
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
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClothingMale;
