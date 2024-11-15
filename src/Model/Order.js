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
      name: { type: String },
      quantity: { type: Number, required: true, min: 1 },
      size: { type: String },
      color: { type: String },
      price: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    fullAddress: { type: String },
    city: { type: String }, // Thành phố
    district: { type: String }, // Quận/Huyện
    ward: { type: String }, // Phường/Xã
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["credit_card", "paypal", "cod", "vnpay"], // "cod" for cash on delivery (ship code)
  },

  paymentStatus: { type: String, default: "Pending" },
  orderStatus: { type: String, default: "Processing" }, // e.g., "Processing", "Shipped", "Delivered"
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
