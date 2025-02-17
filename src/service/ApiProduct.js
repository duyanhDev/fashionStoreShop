import axios from "./../untils/axios";

const getListProductsAPI = async () => {
  return await axios.get("api/v1/products");
};

const ListOneProductAPI = async (id) => {
  return await axios.get(`http://localhost:9000/api/v1/products/${id}`);
};

const createProductAPI = async (
  name,
  gender,
  description,
  category,
  brand,
  care,
  price,
  discount,
  stock,
  size,
  color,
  images = [],
  costPrice
) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("gender", gender);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("brand", brand);
  formData.append("care", care);
  formData.append("price", price);
  formData.append("discount", discount);
  formData.append("stock", stock);
  formData.append("color", color);
  formData.append("size", size);
  images.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("costPrice", costPrice);

  try {
    const response = await axios.post("api/v1/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// update

const UpdateProductAPI = async (
  id,
  name,
  gender,
  description,
  category,
  brand,
  care,
  price,
  discount,
  stock,
  sold,
  size,
  color,
  images = [],
  costPrice
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("gender", gender);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("brand", brand);
  formData.append("care", care);
  formData.append("price", price);
  formData.append("discount", discount);
  formData.append("stock", stock);
  formData.append("sold", sold);
  formData.append("color", color);
  formData.append("size", size);
  images.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("costPrice", costPrice);

  try {
    const response = await axios.put(`api/v1/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const PutFeedbackProductAPI = async (id, userId, rating, review) => {
  return await axios.post("http://localhost:9000/api/v1/feedback", {
    id,
    userId,
    rating,
    review,
  });
};

const toggleLikeRatingAPI = async (productId, ratingId, userId) => {
  return await axios.post("http://localhost:9000/api/v1/like", {
    productId,
    ratingId,
    userId,
  });
};

// tìm kiếm

const searchProductsByNameAPI = async (keyword, page = 1) => {
  return await axios.get(`/api/v1/search/${page}`, {
    params: { keyword },
  });
};

//đánh giá nhiều sản phẩm
const feeckacksProductsAPI = async (id, userId, rating, review) => {
  return await axios.post("http://localhost:9000/api/v1/feedbacks-products", {
    id,
    userId,
    rating,
    review,
  });
};
export {
  createProductAPI,
  getListProductsAPI,
  ListOneProductAPI,
  UpdateProductAPI,
  PutFeedbackProductAPI,
  toggleLikeRatingAPI,
  searchProductsByNameAPI,
  feeckacksProductsAPI,
};
