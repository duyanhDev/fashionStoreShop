import axios from "./../untils/axios";

const listOderUserIdAPI = async (userId) => {
  return await axios.get(`http://localhost:9000/api/v1/order/${userId}`);
};

// tạo hóa đơn
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
  productId
) => {
  try {
    const formattedItems = items.map((item) => ({
      productId: item.productId, // productId must be provided
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color, // quantity must be provided
      price: item.price,
      image: item.imageUrl, // price must be provided
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

// giao hàng

const updateShipping = async (id) => {
  try {
    const response = await axios.post(
      "http://localhost:9000/api/v1/check-orderShipping",
      { id: id }
    );

    return response.data; // Trả về dữ liệu từ API nếu thành công
  } catch (error) {
    console.error(
      "Error updating shipping status:",
      error.response?.data || error.message
    );

    return {
      error: true,
      message: error.response?.data?.message || "Failed to update shipping",
    };
  }
};

// hoàn thành
const UpDateCompleted = async (id) => {
  return await axios.post("http://localhost:9000/api/v1/check-orderCompleted", {
    id: id,
  });
};
const ListAllSumProduct = async () => {
  return await axios.get("http://localhost:9000/api/v1/get-quantity-all");
};

// sum price oder one proudct
const ListOderProductsAll = async () => {
  return await axios.get("http://localhost:9000/api/v1/get-order-all");
};

// xác nhận đơn hàng
const UpDateOrderProductAPI = async (id, totalPrice) => {
  return await axios.put(`http://localhost:9000/api/v1/order/${id}`, {
    totalPrice,
  });
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
  updateShipping,
  UpDateCompleted,
};
