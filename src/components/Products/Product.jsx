import { Table, Button, Tag, Image, Flex } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getListProductsAPI } from "../../service/ApiProduct";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [dataProducts, setDataProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // const arr1 = selectedRowKeys.join(",");
  // console.log(arr1);

  const getRandomColor = () => {
    const colors = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const navigate = useNavigate();
  const handleNavigate = (id) => {
    navigate(`uploadproducts/${id}`);
  };
  const handleViewNavigate = (id) => {
    navigate(`viewproduct/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListProductsAPI();

        const products = response.data.data.map((product, index) => ({
          key: product._id,
          Index: index + 1,
          name: product.name,
          description: product.description,
          category: <Tag color={getRandomColor()}>{product.category.name}</Tag>,
          brand: product.brand,
          price: formatPrice(product.price),
          stock: product.stock,
          size: (
            <div className="flex flex-wrap items-center gap-1 w-52">
              {product.size.slice(0, 10).map((item, index) => (
                <Tag key={index} color={getRandomColor()}>
                  {item}
                </Tag>
              ))}
            </div>
          ),
          color: (
            <div className="flex gap-3 items-center">
              {product.color.map((color) => {
                if (color === "đen") {
                  return (
                    <div
                      key={color}
                      className="w-5 h-5 bg-black rounded-full"
                    ></div>
                  );
                } else if (color === "vàng") {
                  return (
                    <div
                      key={color}
                      className="w-5 h-5 bg-yellow-500 rounded-full "
                    ></div>
                  );
                } else if (color === "trắng") {
                  return (
                    <div
                      key={color}
                      className="w-5 h-5 bg-white border border-black-300 rounded-full "
                    ></div>
                  );
                }

                return null;
              })}
            </div>
          ),
          image: (
            <div className="flex">
              {product.images
                .filter((image) => image !== null) // Filter out null values
                .map((image, index) => (
                  <Image
                    key={index} // Use index as key (consider using a unique ID if available)
                    src={image}
                    alt={`${product.name} image ${index + 1}`} // More descriptive alt text
                    width={50}
                    height={50}
                    style={{
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "path/to/placeholder/image.jpg"; // Use a placeholder image on error
                    }}
                  />
                ))}
            </div>
          ),

          Action: (
            <div className="flex items-center gap-5">
              <Button
                icon={<EyeOutlined />}
                onClick={() => handleViewNavigate(product._id)}
              />
              <Button
                icon={<EditOutlined />}
                onClick={() => handleNavigate(product._id)}
              />
              <Button icon={<DeleteOutlined />} />
            </div>
          ),
        }));
        setDataProducts(products);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: "Index", dataIndex: "Index", key: "Index" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Color", dataIndex: "color", key: "color" },
    { title: "Image", dataIndex: "image", key: "image" },
    { title: "Action", dataIndex: "Action", key: "Action" },
  ];

  const paginatedData = dataProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const onChangeAllSelection = () => {
    if (selectedRowKeys.length === dataProducts.length) {
      setSelectedRowKeys([]);
    } else {
      const allProductKeys = dataProducts.map((product) => product.key);
      setSelectedRowKeys(allProductKeys);
    }
  };

  return (
    <div className="w-full">
      {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      <div className="flex gap-3">
        <Button type="primary" block onClick={() => navigate("addproduct")}>
          Add Product
        </Button>

        <Button type="primary" block onClick={() => onChangeAllSelection()}>
          All Delete Products
        </Button>
      </div>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        dataSource={paginatedData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: dataProducts.length,
          onChange: (page) => setCurrentPage(page), // Cập nhật trang hiện tại
        }}
      />
    </div>
  );
};

export default Products;
