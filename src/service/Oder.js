import axios from "./../untils/axios";

const createOrder = async (
  userId,
  items, // Ensure items passed has productId, quantity, and price
  fullAddress,
  city,
  district,
  ward,
  paymentMethod
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
      items: formattedItems, // Ensure items are formatted correctly
      shippingAddress: {
        fullAddress,
        city,
        district,
        ward,
      },
      paymentMethod,
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

export { createOrder };
