const express = require("express");
const RouterAPI = express.Router();
const {
  AddProductsAPI,
  ListProductsAPI,
  ListOneProductAPI,
} = require("./../Controllers/Products");
const {
  CreateCategoryAPI,
  ListCategoryAPI,
  ListCategoryOneAPI,
  UpdateOneCatogryAPI,
} = require("../Controllers/Category");

RouterAPI.get("/users", (req, res) => {
  return res.send("Create users successfully");
}),
  RouterAPI.get("/products", ListProductsAPI);

RouterAPI.post("/products", AddProductsAPI);

RouterAPI.get("/products/:id", ListOneProductAPI);

// Category

RouterAPI.post("/category", CreateCategoryAPI);

RouterAPI.get("/category", ListCategoryAPI);

RouterAPI.get("/category/:id", ListCategoryOneAPI);

RouterAPI.put("/category/:id", UpdateOneCatogryAPI);

module.exports = RouterAPI;
