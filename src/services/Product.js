const Products = require("./../Model/Product");

const AddProducts = async (productData) => {
  try {
    const data = await Products.create(productData);
    const populatedProduct = await Products.findById(data._id).populate(
      "category",
      "name"
    );

    return populatedProduct;
  } catch (error) {
    console.log("Add products error:", error);
    throw error;
  }
};

const ListProducts = async () => {
  try {
    const data = await Products.find({}).populate("category", "name");
    return data;
  } catch (error) {
    console.log("list products error:", error);
    throw error;
  }
};

module.exports = {
  AddProducts,
  ListProducts,
};
