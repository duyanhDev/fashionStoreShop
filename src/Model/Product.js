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
  care: {
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
      color: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
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
  costPrice: {
    type: Number, // Giá nhập hàng cho một sản phẩm
    required: true,
  },
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

// Virtual để tính số tiền nhập hàng (totalCost)
productSchema.virtual("totalCost").get(function () {
  return this.costPrice * this.stock;
});
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
