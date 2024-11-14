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

// oneupdate
const ListOneProducts = async (id) => {
  try {
    const data = await Products.findOne({ _id: id }).populate(
      "category",
      "name"
    );
    return data;
  } catch (error) {
    console.log("list products error:", error);
    throw error;
  }
};

const UpdateProducts = async (productData) => {
  try {
    const updateData = await Products.findByIdAndUpdate(
      productData.id,
      {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        brand: productData.brand,
        care: productData.care,
        price: productData.price,
        discount: productData.discount,
        stock: productData.stock,
        size: productData.size,
        color: productData.color,
        images: productData.images,
      },
      { new: true } // Trả về document sau khi update
    );

    if (!updateData) {
      throw new Error("Product not found");
    }

    return updateData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  AddProducts,
  ListProducts,
  ListOneProducts,
  UpdateProducts,
};
