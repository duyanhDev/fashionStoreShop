import axios from "./../untils/axios";

const getListProductsAPI = async () => {
  return axios.get("api/v1/products");
};

const creatProductAPI = async (
  name,
  description,
  category,
  brand,
  price,
  stock,
  size,
  color,
  Features,
  image
) => {
  const productData = {
    name,
    description,
    category,
    brand,
    price,
    stock,
    size, // Mảng size
    color,
    Features,
    image,
  };

  return axios.post("api/v1/products", productData);
};

export { creatProductAPI, getListProductsAPI };
