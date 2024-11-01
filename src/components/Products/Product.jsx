import { Table, Button, Tag, Image } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getListProductsAPI } from "../../service/ApiProduct";
import { useEffect, useState } from "react";

const Products = () => {
  const [dataProducts, setDataProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

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
    // Chuyển giá trị thành chuỗi và thêm dấu phân cách cho hàng ngàn
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  useEffect(() => {
    // Fetch product data from the API
    const fetchData = async () => {
      try {
        const response = await getListProductsAPI();
        console.log(response);
        const products = response.data.data.map((product, index) => ({
          key: index + 1,
          Index: index + 1,
          name: product.name,
          description: product.description,
          category: <Tag color={getRandomColor()}>{product.category.name}</Tag>,
          brand: product.brand,
          price: formatPrice(product.price),
          stock: product.stock,
          size: (
            <div className="flex items-center gap-2">
              {product.size.slice(0, 3).map((item, index) => (
                <Tag key={index} color={getRandomColor()}>
                  {item}
                </Tag>
              ))}
            </div>
          ),
          color: product.color,
          image: <Image src={product.images} alt={product.name} width={50} />,
          Features: (
            <div className="flex items-center gap-5">
              <Button icon={<EyeOutlined />} />
              <Button icon={<EditOutlined />} />
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
    { title: "Features", dataIndex: "Features", key: "Features" },
  ];

  const paginatedData = dataProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full">
      <Table
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
