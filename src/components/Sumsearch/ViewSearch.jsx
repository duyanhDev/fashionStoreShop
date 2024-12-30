import { useDispatch, useSelector } from "react-redux";
import "./Style.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchProductsByNameAPI } from "../../service/ApiProduct";
import { logout, Search as SearchAction } from "../../redux/actions/Auth";
const ViewSearch = ({}) => {
  const { data, totalpage } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const [DataProducts, setDataProducts] = useState(data);
  const [page, setPage] = useState(1);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchKeyword = params.get("q") || ""; // Lấy giá trị của `q`
  console.log(searchKeyword);

  const handleAPISerchData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    try {
      const res = await searchProductsByNameAPI(searchKeyword, nextPage);
      if (res?.data) {
        setDataProducts((prev) => [...prev, ...res.data.data]);
        dispatch(SearchAction(res.data.data, res.data.totalPages));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    // Only reset DataProducts when search keyword changes
    setDataProducts(data);
    setPage(1);
  }, [searchKeyword]);

  return (
    <div className="m-10">
      <span className="text-black font-bold">Sản phẩm</span>
      <div className="mt-2 flex flex-wrap items-center gap-10 ">
        {DataProducts && DataProducts.length > 0 ? (
          DataProducts.map((product) => {
            return (
              <div className="product-header-search-1 " key={product.id}>
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : "fallback-image-url.jpg"
                  }
                  alt={product.name || "Sản phẩm"}
                  className="product-header-search-img object-cover"
                  style={{
                    width: "263px",
                    height: "300px",
                    borderRadius: "5px",
                  }}
                />
                <p className="text-product">{product.name}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {formatPrice(product.discountedPrice)}
                  </span>
                  <span className="bg-blue-500 px-2 text-white rounded-lg text-discount">
                    {product.discount}%
                  </span>
                  <span className="line-through text-[#c4c4c4]">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </div>

      {totalpage > page && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAPISerchData}
        >
          Xem thêm
        </button>
      )}
    </div>
  );
};

export default ViewSearch;
