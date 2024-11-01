const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      size: { type: String },
      color: { type: String },
      price: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  paymentMethod: { type: String, required: true }, // e.g., "credit_card", "paypal"
  paymentStatus: { type: String, default: "Pending" },
  orderStatus: { type: String, default: "Processing" }, // e.g., "Processing", "Shipped", "Delivered"
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
