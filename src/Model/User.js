const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } }
);

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
