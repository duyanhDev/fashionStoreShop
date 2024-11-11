import "./Clothing.css";
import { Flex, Rate, Skeleton, Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Clothing({ ListProducts }) {
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();
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
      style={{ width: 272.2 }}
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
  return (
    <div className="bg-white ">
      <div className="flex gap-7 flex-wrap mx-4  ">
        {loading
          ? [...Array(15)].map((_, index) => <SkeletonCard />)
          : ListProducts &&
            ListProducts.length > 0 &&
            ListProducts.map((product) => {
              return (
                <div
                  className="content_dosin "
                  key={product._id}
                  onClick={() => handleDetails(product._id)}
                >
                  <div className="border-b">
                    <img
                      className="w-full h-64 object-cover"
                      src={product.images[0]}
                      alt={product.name}
                    />
                  </div>
                  <div className="item_content">
                    <p>{product.brand}</p>
                  </div>
                  <div className="item_content">
                    <span>{product.name}</span>
                  </div>
                  {product.discount ? (
                    <div className="item_content">
                      <>
                        <span className="text_span line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="ml-2 text_span text-red-600">
                          -{product.discount}%
                        </span>
                      </>
                    </div>
                  ) : (
                    <>
                      <div className="item_content"></div>
                    </>
                  )}
                  <div className="item_content">
                    {product.discountedPrice ? (
                      <span className="text_span ">
                        {formatPrice(product.discountedPrice)}
                      </span>
                    ) : (
                      <span className="text_span ">
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
              );
            })}
      </div>

      <div className="ml-4 mt-3 text-xl font-bold">ÁO</div>
      <div className="flex gap-7 flex-wrap mx-4  ">
        {loading
          ? [...Array(15)].map((_, index) => <SkeletonCard />)
          : ListProducts &&
            ListProducts.length > 0 &&
            ListProducts.map((product) => {
              return (
                product.category.name === "Áo" && (
                  <div
                    className="content_dosin "
                    key={product._id}
                    onClick={() => handleDetails(product._id)}
                  >
                    <div className="border-b">
                      <img
                        className="w-full h-64 object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                    <div className="item_content">
                      <p>{product.brand}</p>
                    </div>
                    <div className="item_content">
                      <span>{product.name}</span>
                    </div>
                    {product.discount ? (
                      <div className="item_content">
                        <>
                          <span className="text_span line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="ml-2 text_span text-red-600">
                            -{product.discount}%
                          </span>
                        </>
                      </div>
                    ) : (
                      <>
                        <div className="item_content"></div>
                      </>
                    )}
                    <div className="item_content">
                      {product.discountedPrice ? (
                        <span className="text_span ">
                          {formatPrice(product.discountedPrice)}
                        </span>
                      ) : (
                        <span className="text_span ">
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
                )
              );
            })}
      </div>
      {/*  QUẦN */}
      <div className="ml-4 mt-3 text-xl font-bold">QUẦN</div>
      <div className="flex gap-7 flex-wrap mx-4  ">
        {loading
          ? [...Array(15)].map((_, index) => <SkeletonCard />)
          : ListProducts &&
            ListProducts.length > 0 &&
            ListProducts.map((product) => {
              return (
                product.category.name === "Quần" && (
                  <div
                    className="content_dosin "
                    key={product._id}
                    onClick={() => handleDetails(product._id)}
                  >
                    <div className="border-b">
                      <img
                        className="w-full h-64 object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                    <div className="item_content">
                      <p>{product.brand}</p>
                    </div>
                    <div className="item_content">
                      <span>{product.name}</span>
                    </div>
                    {product.discount ? (
                      <div className="item_content">
                        <>
                          <span className="text_span line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="ml-2 text_span text-red-600">
                            -{product.discount}%
                          </span>
                        </>
                      </div>
                    ) : (
                      <>
                        <div className="item_content"></div>
                      </>
                    )}
                    <div className="item_content">
                      {product.discountedPrice ? (
                        <span className="text_span ">
                          {formatPrice(product.discountedPrice)}
                        </span>
                      ) : (
                        <span className="text_span ">
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
                )
              );
            })}
      </div>

      {/*  GIAYF */}
      <div className="ml-4 mt-3 text-xl font-bold">GIÀY</div>
      <div className="flex gap-7 flex-wrap mx-4  ">
        {loading
          ? [...Array(15)].map((_, index) => <SkeletonCard />)
          : ListProducts &&
            ListProducts.length > 0 &&
            ListProducts.map((product) => {
              return (
                product.category.name === "Giày" && (
                  <div
                    className="content_dosin "
                    key={product._id}
                    onClick={() => handleDetails(product._id)}
                  >
                    <div className="border-b">
                      <img
                        className="w-full h-64 object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                    <div className="item_content">
                      <p>{product.brand}</p>
                    </div>
                    <div className="item_content">
                      <span>{product.name}</span>
                    </div>
                    {product.discount ? (
                      <div className="item_content">
                        <>
                          <span className="text_span line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="ml-2 text_span text-red-600">
                            -{product.discount}%
                          </span>
                        </>
                      </div>
                    ) : (
                      <>
                        <div className="item_content"></div>
                      </>
                    )}
                    <div className="item_content">
                      {product.discountedPrice ? (
                        <span className="text_span ">
                          {formatPrice(product.discountedPrice)}
                        </span>
                      ) : (
                        <span className="text_span ">
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
                )
              );
            })}
      </div>
    </div>
  );
}
