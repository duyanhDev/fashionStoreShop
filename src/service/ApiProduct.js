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

const ListOneProductAPI = async (id) => {
  return await axios.get(`http://localhost:9000/api/v1/products/${id}`);
};

export { creatProductAPI, getListProductsAPI, ListOneProductAPI };
