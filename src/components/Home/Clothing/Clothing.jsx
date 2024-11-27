import "./Clothing.css";
import { Flex, Rate, Skeleton, Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Clothing({ ListProducts }) {
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  // Separate state for each category's pagination
  const [currentPageAo, setCurrentPageAo] = useState(0);
  const [currentPageQuan, setCurrentPageQuan] = useState(0);
  const [currentPageGiay, setCurrentPageGiay] = useState(0);

  const itemsPerPage = 5;

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
          ? [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
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
        previousLabel={"Previous"}
        nextLabel={"Next"}
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
