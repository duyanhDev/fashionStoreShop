import "./Clothing.css";
import { Flex, Rate, Skeleton, Card, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Clothing({ ListProducts }) {
  console.log(ListProducts);

  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  // Separate state for each category's pagination
  const [currentPageAo, setCurrentPageAo] = useState(0);
  const [currentPageQuan, setCurrentPageQuan] = useState(0);
  const [currentPageGiay, setCurrentPageGiay] = useState(0);

  const itemsPerPage = 10;

  const aoProducts = ListProducts.filter(
    (product) => product.category.name === "Áo"
  );
  const quanProducts = ListProducts.filter(
    (product) => product.category.name === "Quần"
  );
  const giayProducts = ListProducts.filter(
    (product) => product.category.name === "Giày"
  );

  const aoOffset = currentPageAo * itemsPerPage;
  const quanOffset = currentPageQuan * itemsPerPage;
  const giayOffset = currentPageGiay * itemsPerPage;

  const currentAoProducts = aoProducts.slice(aoOffset, aoOffset + itemsPerPage);
  const currentQuanProducts = quanProducts.slice(
    quanOffset,
    quanOffset + itemsPerPage
  );
  const currentGiayProducts = giayProducts.slice(
    giayOffset,
    giayOffset + itemsPerPage
  );

  // Page count calculations
  const aoPageCount = Math.ceil(aoProducts.length / itemsPerPage);
  const quanPageCount = Math.ceil(quanProducts.length / itemsPerPage);
  const giayPageCount = Math.ceil(giayProducts.length / itemsPerPage);

  // Separate page change handlers for each category
  const handlePageClickAo = (event) => {
    setCurrentPageAo(event.selected);
  };

  const handlePageClickQuan = (event) => {
    setCurrentPageQuan(event.selected);
  };

  const handlePageClickGiay = (event) => {
    setCurrentPageGiay(event.selected);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handleRate = (id, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [id]: value,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleDetails = (id) => {
    navigate(`product/${id}`);
  };

  const renderProductSection = (
    title,
    products,
    pageCount,
    handlePageClick
  ) => (
    <>
      <div className="ml-4 mt-3 text-xl font-bold">{title}</div>
      <div className="flex gap-7 flex-wrap mx-4">
        {loading
          ? [...Array(12)].map((_, index) => <SkeletonCard key={index} />)
          : products.map((product) => (
              <div
                className="content_dosin"
                key={product._id}
                onClick={() => handleDetails(product._id)}
              >
                <div className="border-b">
                  <img
                    className="w-full h-64 object-cover"
                    src={product.images[0].url}
                    alt={product.name}
                  />
                </div>
                <div className="item_content">
                  <p>{product.brand}</p>
                </div>
                <div className="item_content" style={{ maxWidth: "200px" }}>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                    {product.name}
                  </span>
                </div>
                {product.discount ? (
                  <div className="item_content">
                    <span className="text_span line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="ml-2 text_span text-red-600">
                      -{product.discount}%
                    </span>
                  </div>
                ) : (
                  <div className="item_content"></div>
                )}
                <div className="item_content">
                  {product.discountedPrice ? (
                    <span className="text_span">
                      {formatPrice(product.discountedPrice)}
                    </span>
                  ) : (
                    <span className="text_span">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <div className="item_content">
                  <Flex gap="middle" vertical>
                    <Rate
                      tooltips={desc}
                      onChange={(value) => handleRate(product._id, value)}
                      value={ratings[product._id] || 0}
                    />
                  </Flex>
                </div>
              </div>
            ))}
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
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </>
  );

  return (
    <div className="bg-white">
      {/* Danh sách tất cả sản phẩm */}
      <div className="flex gap-7 flex-wrap mx-4">
        {loading
          ? [...Array(15)].map((_, index) => <SkeletonCard key={index} />)
          : ListProducts.map((product) => (
              <div
                className="content_dosin"
                key={product._id}
                onClick={() => handleDetails(product._id)}
              >
                <div className="border-b">
                  <img
                    className="w-full h-64 object-cover"
                    src={product.images[0].url}
                    alt={product.name}
                  />
                </div>
                <div className="item_content">
                  <p>{product.brand}</p>
                </div>
                <div className="item_content" style={{ maxWidth: "200px" }}>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                    {product.name}
                  </span>
                </div>
                {product.discount ? (
                  <div className="item_content">
                    <span className="text_span line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="ml-2 text_span text-red-600">
                      -{product.discount}%
                    </span>
                  </div>
                ) : (
                  <div className="item_content"></div>
                )}
                <div className="item_content">
                  {product.discountedPrice ? (
                    <span className="text_span">
                      {formatPrice(product.discountedPrice)}
                    </span>
                  ) : (
                    <span className="text_span">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <div className="item_content">
                  <Flex gap="middle" vertical>
                    <Rate
                      tooltips={desc}
                      onChange={(value) => handleRate(product._id, value)}
                      value={ratings[product._id] || 0}
                    />
                  </Flex>
                </div>
              </div>
            ))}
      </div>

      {/* Các section sản phẩm theo danh mục với phân trang riêng */}
      {renderProductSection(
        "ÁO",
        currentAoProducts,
        aoPageCount,
        handlePageClickAo
      )}
      {renderProductSection(
        "QUẦN",
        currentQuanProducts,
        quanPageCount,
        handlePageClickQuan
      )}
      {renderProductSection(
        "GIÀY",
        currentGiayProducts,
        giayPageCount,
        handlePageClickGiay
      )}
    </div>
  );
}
