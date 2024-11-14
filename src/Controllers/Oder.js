const Order = require("./../Model/Order");
const Users = require("./../Model/User");

const CreateOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;
    console.log(userId, items, shippingAddress, paymentMethod);

    // Basic validation
    if (!userId || !items || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const checkUser = await Users.findOne({ _id: userId });
    if (!checkUser) {
      return res.status(400).json({ message: "User does not exist." });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items must be a non-empty array." });
    }

    // Calculate total amount (just sum the prices as you've already passed the total for each item)
    let totalAmount = 0;
    for (const item of items) {
      // Check for required fields in each item
      if (!item.productId || !item.price) {
        return res.status(400).json({
          message: "Each item must have productId and price.",
        });
      }

      // Add the price of each item (you've already passed the price for 3 products)
      totalAmount += item.price;
    }

    console.log("Total Amount for Order:", totalAmount);

    // Ensure shippingAddress is provided (if required)
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required." });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Return the saved order
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { CreateOrder };
