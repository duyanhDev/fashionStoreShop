const express = require("express");
const RouterAPI = express.Router();
const {
  AddProductsAPI,
  ListProductsAPI,
} = require("./../Controllers/Products");
const { CreateCategoryAPI } = require("../Controllers/Category");

RouterAPI.get("/users", (req, res) => {
  return res.send("Create users successfully");
}),
  RouterAPI.get("/products", ListProductsAPI);

RouterAPI.post("/products", AddProductsAPI);

// Category

RouterAPI.post("/category", CreateCategoryAPI);

module.exports = RouterAPI;
