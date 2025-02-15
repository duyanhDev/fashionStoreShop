const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  username: { type: String },
  phone: { type: Number },
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
      image: {
        type: String,
      },
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
    enum: ["credit_card", "ZaloPay", "cod", "vnpay", "momo"], // "cod" for cash on delivery (ship code)
  },

  paymentStatus: { type: String, default: "Pending" },
  orderStatus: {
    type: String,
    enum: [
      "Processing", // Chờ giao hàng
      "Delivered", // Chờ giao hàng (another state)
      "Shipping", // Giao hàng
      "Completed", // Đã xong
    ],
    default: "Processing",
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
