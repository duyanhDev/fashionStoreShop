import axios from "./../untils/axios";

const listOderUserIdAPI = async (userId) => {
  return await axios.get(`http://localhost:9000/api/v1/order/${userId}`);
};

const createOrder = async (
  userId,
  username,
  phone,
  items, // Ensure items passed has productId, quantity, and price
  fullAddress,
  city,
  district,
  ward,
  paymentMethod,
  email,
  CartId,
  productId,
  isAdmin
) => {
  try {
    // Ensure items are in the correct format (each item should have productId, quantity, and price)
    const formattedItems = items.map((item) => ({
      productId: item.productId, // productId must be provided
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color, // quantity must be provided
      price: item.price, // price must be provided
    }));

    const response = await axios.post("http://localhost:9000/api/v1/order", {
      userId,
      username,
      phone,
      items: formattedItems, // Ensure items are formatted correctly
      shippingAddress: {
        fullAddress,
        city,
        district,
        ward,
      },
      paymentMethod,
      email,
      CartId,
      productId,
      isAdmin,
    });

    return response;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// all order

// sum all price all product

const ListAllSumProduct = async () => {
  return await axios.get("http://localhost:9000/api/v1/get-quantity-all");
};

// sum price oder one proudct
const ListOderProductsAll = async () => {
  return await axios.get("http://localhost:9000/api/v1/get-order-all");
};

const UpDateOrderProductAPI = async (id) => {
  return await axios.put(`http://localhost:9000/api/v1/order/${id}`);
};

const OrderStatusOneProduct = async (id) => {
  return await axios.get(`http://localhost:9000/api/v1/get-order-one/${id}`);
};

export {
  listOderUserIdAPI,
  createOrder,
  ListOderProductsAll,
  UpDateOrderProductAPI,
  ListAllSumProduct,
  OrderStatusOneProduct,
};
