import axios from "./../untils/axios";

const getListProductsAPI = async () => {
  return axios.get("api/v1/products");
};

const createProductAPI = async (
  name,
  description,
  category,
  brand,
  price,
  stock,
  size, // Mảng size
  color,
  images = [] // Default to an empty array if no images are provided
) => {
  const formData = new FormData();

  // Append product data to FormData
  formData.append("name", name);
  formData.append("description", description);
  formData.append("category", category); // If category is an ObjectId, ensure it's a string
  formData.append("brand", brand);
  formData.append("price", price);
  formData.append("stock", stock);
  formData.append("color", color);
  formData.append("size", size);
  // Append size array to FormData

  // Append images to FormData
  images.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await axios.post("api/v1/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for FormData
      },
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Error creating product:", error);
    throw error; // Propagate error to the caller
  }
};

const ListOneProductAPI = async (id) => {
  return await axios.get(`http://localhost:9000/api/v1/products/${id}`);
};

export { createProductAPI, getListProductsAPI, ListOneProductAPI };
