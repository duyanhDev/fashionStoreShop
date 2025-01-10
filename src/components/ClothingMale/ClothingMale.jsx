import { useEffect, useState } from "react";
import "./ClothingMale.css";
import { Radio, Space, Slider, Button, Card, Skeleton } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ListCategoryAPI } from "../../service/ApiCategory";
import ReactPaginate from "react-paginate";
import { fetchProducts } from "../../redux/actions/filterAction";
import SliderComponent from "../Slider/Slider";
const ClothingMale = () => {
  const param = useParams();

  const location = useLocation();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [hidden, setHidden] = useState(false);
  const [checkFiltter, setCheckFilter] = useState(false);
  const [ListCategory, setListCategory] = useState([]);
  const [valueId, setValueId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const {
    products,
    loading,
    totalPages,
    category,
    selectedSize,
    selectedColor,
    sortPrice,
  } = useSelector((state) => state.filter);

  const queryParams = new URLSearchParams(location.search);
  const savedSortPrice = queryParams.get("sortPrice") || "";
  const saveCateogry = queryParams.get("Category");
  const savedCurrentPage = parseInt(queryParams.get("currentPage")) || 1; // Default to page 1

  const currentPage = useSelector((state) => state.filter.currentPage);

  useEffect(() => {
    const params = {
      gender: param.gender,
      category:
        valueId ||
        (saveCateogry
          ? ListCategory.find((cat) => cat.name === saveCateogry)?._id
          : ""),
      sortPrice: savedSortPrice,
      currentPage: savedCurrentPage,
    };

    dispatch(fetchProducts(params));
  }, [
    // dispatch,
    valueId,
    param.gender,
    savedSortPrice,
    savedCurrentPage,
    saveCateogry,
    ListCategory,
  ]);

  useEffect(() => {
    const FetchListCategoryAndInitialize = async () => {
      try {
        const res = await ListCategoryAPI();
        if (res && res.data) {
          const categories = res.data.data;
          setListCategory(categories);

          // Xử lý giá trị ban đầu từ URL
          const categoryFromURL = queryParams.get("Category");
          if (categoryFromURL) {
            const foundCategory = categories.find(
              (cat) => cat.name === categoryFromURL
            );
            if (foundCategory) {
              setValueId(foundCategory._id);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    FetchListCategoryAndInitialize();
  }, []);

  useEffect(() => {
    if (ListCategory.length > 0) {
      const params = {
        gender: param.gender,
        category:
          valueId ||
          (saveCateogry
            ? ListCategory.find((cat) => cat.name === saveCateogry)?._id
            : ""),
        sortPrice: savedSortPrice,
        currentPage: savedCurrentPage,
      };

      dispatch(fetchProducts(params));
    }
  }, [valueId, param.gender, savedSortPrice, savedCurrentPage]);

  const handlePageClick = (page) => {
    const pageNumber = page.selected + 1;

    const queryParams = new URLSearchParams(location.search);
    queryParams.set("currentPage", pageNumber);
    Navigate(`${location.pathname}?${queryParams.toString()}`);

    dispatch(
      fetchProducts({
        gender: param.gender,
        category: valueId,
        sortPrice: savedSortPrice,
        currentPage: pageNumber,
      })
    );
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };
  const marks = {
    0: <span>0VND</span>,
    // 100: <span className="increase">{priceFitter}VND</span>,
  };

  // lấy danh sách sản phẩm category

  const onChange = async (e) => {
    const selectedValue = e.target.value;
    setValueId(selectedValue);

    // Tìm danh mục tương ứng với giá trị đã chọn
    const selectedCategory = ListCategory.find(
      (category) => category._id === selectedValue
    );

    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
    }
    setHidden(true);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("Category", selectedCategory.name);
    Navigate(`${location.pathname}?${queryParams.toString()}`);
    dispatch(
      fetchProducts({
        gender: param.gender,
        category: selectedValue,
        sortPrice: savedSortPrice,
        currentPage: 1,
      })
    );
  };

  const handleCheckboxChange = (e) => {};

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

  const handleSortDesAndAsc = (value) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("sortPrice", value);
    queryParams.set("currentPage", 1);

    Navigate(`${location.pathname}?${queryParams.toString()}`); // Update URL

    // Gọi API sau khi URL đã thay đổi
    const params = {
      gender: param.gender,
      category: valueId,
      sortPrice: value,
      currentPage: 1,
    };
    setCheckFilter(true);
    dispatch(fetchProducts(params));
  };

  const handleFitterProduct = async () => {
    try {
      setValueId("");
      const params = {
        gender: param.gender,
        category: "",
        sortPrice: "",
      };
      dispatch(fetchProducts(params));
      setHidden(false);
      const newUrl = `${location.pathname}`;
      Navigate(newUrl, { replace: true });
    } catch (error) {
      console.log(error);
    }
    setCheckFilter(false);
  };

  const SortDateProduct = () => {};

  const SortBestselling = () => {};

  return (
    <section>
      <SliderComponent />
      <div className="flex colletion">
        <div className="colletion_left">
          <div>
            <h1>Loại sản phẩm</h1>
            <Radio.Group className="mr-5" onChange={onChange} value={valueId}>
              <Space direction="vertical">
                {ListCategory &&
                  ListCategory.length > 0 &&
                  ListCategory.map((Category) => {
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
            <Radio.Group className="mr-5" onChange={onChange} value={1}>
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
                value={1} // Đồng bộ giá trị
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
            {/* lọc sản phẩm theo price , day*/}
            <div className="ml-10 mt-5 ">
              <div className="relative ">
                <ul className="flex items-center gap-3">
                  <div>
                    <li
                      className="male_clothing"
                      onClick={() => setCheckFilter((prev) => !prev)}
                    >
                      <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
                        <span className="absolute  inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a2aeff_0%,#3749be_50%,#a2aeff_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-[#ffffff] px-8 py-1 text-sm font-medium dark:text-gray-50 text-black backdrop-blur-3xl">
                          SẮP XẾP THEO
                        </span>
                      </button>
                    </li>

                    {checkFiltter && (
                      <ul className="top-12 absolute z-40 sort_products">
                        <li onClick={SortDateProduct}>Mới nhất</li>
                        <li onClick={() => handleSortDesAndAsc("asc")}>
                          Giá : thấp - cao
                        </li>
                        <li onClick={() => handleSortDesAndAsc("desc")}>
                          Giá : cao - thấp
                        </li>
                        <li onClick={SortBestselling}>Bán chạy nhất</li>
                      </ul>
                    )}
                  </div>

                  {hidden && (
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
                              src={product.variants[0]?.images[0]?.url}
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
              </div>
              <div className="mt-10 flex justify-center items-center">
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
                      <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" />
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
                      <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
                    </svg>
                  }
                  breakLabel={null}
                  pageCount={totalPages}
                  marginPagesDisplayed={3}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName="flex items-center gap-2"
                  pageLinkClassName="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  activeLinkClassName="bg-blue-500 text-white"
                  previousClassName="p-2"
                  nextClassName="p-2"
                  disabledClassName="opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClothingMale;
