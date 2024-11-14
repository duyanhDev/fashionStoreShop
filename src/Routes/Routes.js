const express = require("express");
const RouterAPI = express.Router();
const {
  AddProductsAPI,
  ListProductsAPI,
  ListOneProductAPI,
  UpdateProductsAPI,
} = require("./../Controllers/Products");
const {
  CreateCategoryAPI,
  ListCategoryAPI,
  ListCategoryOneAPI,
  UpdateOneCatogryAPI,
  DeleteOneCategoryAPI,
} = require("../Controllers/Category");

const { RegisterUserAPI, LoginUserAPI } = require("./../Controllers/Auth");
const {
  addToCart,
  getCartProduct,
  RemoveCartProductfirst,
} = require("./../Controllers/Cart");
const { CreateOrder } = require("../Controllers/Oder");
//product

RouterAPI.get("/products", ListProductsAPI);

RouterAPI.post("/products", AddProductsAPI);

RouterAPI.get("/products/:id", ListOneProductAPI);

RouterAPI.put("/products/:id", UpdateProductsAPI);

// Category

RouterAPI.post("/category", CreateCategoryAPI);

RouterAPI.get("/category", ListCategoryAPI);

RouterAPI.get("/category/:id", ListCategoryOneAPI);

RouterAPI.put("/category/:id", UpdateOneCatogryAPI);

RouterAPI.delete("/category/:id", DeleteOneCategoryAPI);

// Auth

RouterAPI.post("/register", RegisterUserAPI);
RouterAPI.post("/login", LoginUserAPI);

// Cart
RouterAPI.post("/cart", addToCart);
RouterAPI.get("/cart/:userId", getCartProduct);
RouterAPI.put("/cart/:cartId/:itemId", RemoveCartProductfirst);

RouterAPI.post("/order", CreateOrder);
module.exports = RouterAPI;
