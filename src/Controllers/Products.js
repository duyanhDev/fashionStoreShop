const { uploadFileToCloudinary } = require("./../services/Cloudinary");
const {
  AddProducts,
  ListProducts,
  ListOneProducts,
} = require("./../services/Product");

const AddProductsAPI = async (req, res) => {
  const {
    name,
    description,
    category,
    brand,
    price,
    stock,
    size,
    color,
    Features,
  } = req.body;

  console.log(
    name,
    description,
    category,
    brand,
    price,
    stock,
    size,
    color,
    Features
  );

  let imageUrl = "";

  if (req.files && req.files.images) {
    try {
      const resultImage = await uploadFileToCloudinary(req.files.images);
      imageUrl = resultImage.secure_url;
      console.log(imageUrl);
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error uploading image" });
    }
  }

  try {
    const data = await AddProducts({
      name,
      description,
      category,
      brand,
      price,
      stock,
      size,
      color,
      images: imageUrl || null,
      Features,
    });

    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error adding product" });
  }
};

const ListProductsAPI = async (req, res) => {
  try {
    const data = await ListProducts();
    return res.status(201).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Error list product:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error adding product" });
  }
};

const ListOneProductAPI = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const data = await ListOneProducts(id);

    console.log(data);

    return res.status(201).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Error list product:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Error adding product" });
  }
};
module.exports = {
  AddProductsAPI,
  ListProductsAPI,
  ListOneProductAPI,
};
