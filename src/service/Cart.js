import axios from "./../untils/axios";

const AddCartAPI = async (userId, productId, quantity, size, color) => {
  return await axios.post("http://localhost:9000/api/v1/cart", {
    userId,
    productId,
    quantity,
    size,
    color,
  });
};

const CartListProduct = async (userId) => {
  return await axios.get(`http://localhost:9000/api/v1/cart/${userId}`);
};
const RemoveCartOnePorduct = async (cartId, itemId, userId) => {
  try {
    const response = await axios.put(
      `http://localhost:9000/api/v1/cart/${cartId}/${itemId}`,
      { userId }
    );
    return response;
  } catch (error) {
    console.error(
      "Error removing product from cart:",
      error.response?.data || error.message
    );
    throw error; // Re-throw to handle error where the function is called
  }
};

export { AddCartAPI, CartListProduct, RemoveCartOnePorduct };
