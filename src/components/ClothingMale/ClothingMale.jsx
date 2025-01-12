import { useCallback, useEffect, useRef, useState } from "react";
import "./ClothingMale.css";
import { Radio, Space, Slider, Button, Card, Skeleton, Flex, Rate } from "antd";
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

  const menuRef = useRef(null);
  // xử khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setCheckFilter(false); // Ẩn menu khi click bên ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { products, loading, totalPages } = useSelector(
    (state) => state.filter
  );

  const queryParams = new URLSearchParams(location.search);
  const savedSortPrice = queryParams.get("sortPrice") || "";
  const saveCateogry = queryParams.get("Category");
  const savedCurrentPage = parseInt(queryParams.get("currentPage")) || 1;
  const savedSortDate = queryParams.get("sortDate") || "";
  const savedsortSold = queryParams.get("sortSold") || "";
  const currentPage = useSelector((state) => state.filter.currentPage);

  const getFetchParams = useCallback(() => {
    return {
      gender: param.gender,
      category:
        valueId ||
        (saveCateogry
          ? ListCategory.find((cat) => cat.name === saveCateogry)?._id
          : ""),
      sortPrice: savedSortPrice,
      sortDate: savedSortDate,
      sortSold: savedsortSold,
      currentPage: savedCurrentPage,
    };
  }, [
    param.gender,
    valueId,
    saveCateogry,
    ListCategory,
    savedSortPrice,
    savedSortDate,
    savedsortSold,
    savedCurrentPage,
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
      const params = getFetchParams();
      dispatch(fetchProducts(params));
    }
  }, [dispatch, getFetchParams, ListCategory.length]);

  const handlePageClick = (page) => {
    console.log(page);

    const pageNumber = page.selected + 1;
    const newParams = new URLSearchParams(location.search);
    newParams.set("currentPage", pageNumber);

    Navigate(`${location.pathname}?${newParams.toString()}`);

    const fetchParams = {
      ...getFetchParams(),
      currentPage: pageNumber,
    };
    dispatch(fetchProducts(fetchParams));
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
    const selectedCategory = ListCategory.find(
      (category) => category._id === selectedValue
    );

    if (selectedCategory) {
      setValueId(selectedValue);
      setHidden(true);

      const newParams = new URLSearchParams(location.search);
      newParams.set("Category", selectedCategory.name);
      newParams.set("currentPage", "1");
      Navigate(`${location.pathname}?${newParams.toString()}`);

      dispatch(
        fetchProducts({
          ...getFetchParams(),
          category: selectedValue,
          currentPage: 1,
        })
      );
    }
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
    setHidden(true);
    setCheckFilter(false);
    dispatch(fetchProducts(params));
  };

  const handleSortDate = (value) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("sortDate", value);
    queryParams.set("currentPage", 1);

    Navigate(`${location.pathname}?${queryParams.toString()}`); // Update URL

    // Gọi API sau khi URL đã thay đổi
    const params = {
      gender: param.gender,
      category: valueId,
      sortDate: value,
      currentPage: 1,
    };
    setCheckFilter(false);
    setHidden(true);
    dispatch(fetchProducts(params));
  };

  const handleSortSold = (value) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("sortSold", value);
    queryParams.set("currentPage", 1);

    Navigate(`${location.pathname}?${queryParams.toString()}`); // Update URL

    // Gọi API sau khi URL đã thay đổi
    const params = {
      gender: param.gender,
      category: valueId,
      sortSold: value,
      currentPage: 1,
    };
    setHidden(true);
    setCheckFilter(false);
    dispatch(fetchProducts(params));
  };

  // reset Data
  const handleFitterProduct = async () => {
    try {
      setValueId("");
      const params = {
        gender: param.gender,
        category: "",
        sortPrice: "",
        sortDate: "",
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
              <p className="text-xl text-black font-bold">
                Một số sản phẩm bán chạy
              </p>
            </div>

            <div className="mt-5 flex gap-4 items-center flex-nowrap border-b border-gray-200 p-2 sm:flex-wrap lg:flex-nowrap ">
              <div className="flex gap-4 ml-6">
                {products &&
                  products.length > 0 &&
                  products
                    .slice(0, 8)
                    .sort((a, b) => {
                      return b.sold - a.sold;
                    })
                    .map((product) => (
                      <div key={product.id} className="w-32">
                        <div>
                          <img
                            className="img_male"
                            src={product.variants[0]?.images[0]?.url}
                            alt="lỗi"
                          />
                        </div>
                        <div className="text-center">
                          <p>{product.name}</p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
            {/* lọc sản phẩm theo price , day*/}
            <div className="ml-10 mt-5 ">
              <div className="relative ">
                <ul className="flex items-center gap-3">
                  <div ref={menuRef}>
                    <li
                      className="male_clothing"
                      onClick={() => setCheckFilter((prev) => !prev)}
                    >
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-[#ffffff] px-8 py-1 text-sm font-medium dark:text-gray-50 text-black backdrop-blur-3xl">
                        SẮP XẾP THEO
                      </span>
                    </li>

                    {checkFiltter && (
                      <ul className="top-12 absolute z-40 sort_products">
                        <li onClick={() => handleSortDate("newest")}>
                          Mới nhất
                        </li>
                        <li onClick={() => handleSortDesAndAsc("asc")}>
                          Giá : thấp - cao
                        </li>
                        <li onClick={() => handleSortDesAndAsc("desc")}>
                          Giá : cao - thấp
                        </li>
                        <li onClick={() => handleSortSold("hot")}>
                          Bán chạy nhất
                        </li>
                      </ul>
                    )}
                  </div>

                  {hidden && (
                    <li className="male_clothing" onClick={handleFitterProduct}>
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-[#ffffff] px-8 py-1 text-sm font-medium dark:text-gray-50 text-black backdrop-blur-3xl">
                        XÓA LỌC
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {/* sản phẩm */}
            <div className="mt-3 male_left">
              <div className="flex flex-wrap gap-2">
                {loading
                  ? [...Array(20)].map((_, index) => (
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
                            <h1 className=" main_product_male_h1 text-center">
                              {product.name}
                            </h1>
                            <div className="flex gap-5 items-center justify-center">
                              <span className="line-through text-red-500">
                                {formatPrice(product.costPrice)}
                              </span>
                              <span>
                                {formatPrice(product.discountedPrice)}
                              </span>
                            </div>
                            <div className="flex gap-0 mx-4 items-center justify-between">
                              <span className="line-through text-red-500 ">
                                <Rate
                                  disabled
                                  defaultValue={5}
                                  style={{ fontSize: "14px" }}
                                />
                              </span>
                              <span style={{ fontSize: "14px" }}>
                                Đã bán {product.sold}
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
                  initialPage={savedCurrentPage - 1}
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
