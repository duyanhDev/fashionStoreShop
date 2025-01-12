const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Thay vì "bcryptjs"

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    address: {
      city: { type: String }, // Thành phố
      district: { type: String }, // Quận/Huyện
      ward: { type: String }, // Phường/Xã
    },
    phone: { type: String },
    gender: { type: String, enum: ["Nam", "Nữ"], default: "Nam" },
    dateOfBirth: { type: Date },
    height: { type: Number },
    weight: { type: Number },
    totalPrice: { type: Number },
    isAdmin: { type: Boolean, default: false },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// so sánh
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
