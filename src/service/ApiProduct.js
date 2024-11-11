import axios from "./../untils/axios";

const getListProductsAPI = async () => {
  return await axios.get("api/v1/products");
};

const ListOneProductAPI = async (id) => {
  return await axios.get(`http://localhost:9000/api/v1/products/${id}`);
};

const createProductAPI = async (
  name,
  description,
  category,
  brand,
  price,
  discount,
  stock,
  size,
  color,
  images = []
) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("brand", brand);
  formData.append("price", price);
  formData.append("discount", discount);
  formData.append("stock", stock);
  formData.append("color", color);
  formData.append("size", size);
  images.forEach((file) => {
    formData.append("images", file);
  });

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
  description,
  category,
  brand,
  price,
  stock,
  size,
  color,
  images = []
) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("brand", brand);
  formData.append("price", price);
  formData.append("stock", stock);
  formData.append("color", color);
  formData.append("size", size);
  images.forEach((file) => {
    formData.append("images", file);
  });

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

export {
  createProductAPI,
  getListProductsAPI,
  ListOneProductAPI,
  UpdateProductAPI,
};
