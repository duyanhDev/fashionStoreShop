const { uploadFileToCloudinary } = require("./../services/Cloudinary");
const {
  AddProducts,
  ListProducts,
  ListOneProducts,
} = require("./../services/Product");

const AddProductsAPI = async (req, res) => {
  const { name, description, category, brand, price, stock, size, color } =
    req.body;

  // Debugging output for received data
  console.log("Received data:", req.body);

  // Parse sizes and colors into arrays
  const sizeArray = Array.isArray(size)
    ? size
    : size.split(",").map((item) => item.trim());
  const colorArray = Array.isArray(color)
    ? color
    : color.split(",").map((item) => item.trim());

  // Debugging output for sizes and colors
  console.log("Size array:", sizeArray);
  console.log("Color array:", colorArray);

  let imageUrls = [];
  if (req.files && req.files.images) {
    try {
      // Convert input to an array if it's not already
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Upload each image and store the URL
      for (const file of files) {
        const resultImage = await uploadFileToCloudinary(file);
        imageUrls.push(resultImage.secure_url); // Collect the URL
      }

      console.log("Uploaded image URLs:", imageUrls);
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error uploading images" });
    }
  }
  const productData = {
    name,
    description,
    category,
    brand,
    price,
    stock,
    size: sizeArray, // Directly using the size array
    color: colorArray, // Directly using the color array
    images: imageUrls.length ? imageUrls : [],
  };

  try {
    const data = await AddProducts(productData);
    return res.status(200).json({
      EC: 0,
      data: data,
      message: "Product added successfully",
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
