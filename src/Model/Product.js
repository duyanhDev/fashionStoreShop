const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  discountedPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  size: [
    {
      type: String,
    },
  ],
  color: [
    {
      type: String,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware để tự động cập nhật `updatedAt` và tính `discountedPrice`
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  this.discountedPrice = this.price * (1 - this.discount / 100);
  next();
});

module.exports = mongoose.model("Product", productSchema);
