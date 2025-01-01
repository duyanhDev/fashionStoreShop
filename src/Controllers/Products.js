const { uploadFileToCloudinary } = require("./../services/Cloudinary");
const {
  AddProducts,
  ListProducts,
  ListOneProducts,
  UpdateProducts,
  PutFeedbackProduct,
  CategoryGender,
  CategoryGenderFitter,
  toggleLikeRating,
} = require("./../services/Product");
const Products = require("./../Model/Product");

// const AddProductsAPI = async (req, res) => {
//   const {
//     name,
//     description,
//     category,
//     brand,
//     care,
//     price,
//     discount,
//     stock,
//     size,
//     color,
//   } = req.body;

//   // Parse sizes and colors into arrays
//   const sizeArray = Array.isArray(size)
//     ? size
//     : size.split(",").map((item) => item.trim());
//   const colorArray = Array.isArray(color)
//     ? color
//     : color.split(",").map((item) => item.trim());

//   let imageUrls = [];
//   if (req.files && req.files.images) {
//     try {
//       const files = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];

//       // Upload each image and store the URL
//       for (const file of files) {
//         const resultImage = await uploadFileToCloudinary(file);
//         imageUrls.push(resultImage.secure_url); // Collect the URL
//       }

//       console.log("Uploaded image URLs:", imageUrls);
//     } catch (uploadError) {
//       console.error("Error uploading images:", uploadError.message);
//       return res
//         .status(500)
//         .json({ success: false, message: "Error uploading images" });
//     }
//   }
//   const productData = {
//     name,
//     description,
//     category,
//     brand,
//     care,
//     price,
//     discount,
//     stock,
//     size: sizeArray, // Directly using the size array
//     color: colorArray, // Directly using the color array
//     images: imageUrls.length ? imageUrls : [],
//   };

//   try {
//     const data = await AddProducts(productData);
//     return res.status(200).json({
//       EC: 0,
//       data: data,
//       message: "Product added successfully",
//     });
//   } catch (error) {
//     console.error("Error adding product:", error.message);
//     return res
//       .status(500)
//       .json({ success: false, message: "Error adding product" });
//   }
// };
const AddProductsAPI = async (req, res) => {
  const {
    name,
    gender,
    description,
    category,
    brand,
    care,
    price,
    discount,
    stock,
    size,
    color,
    costPrice,
  } = req.body;

  // Parse sizes and colors into arrays
  const sizeArray = Array.isArray(size)
    ? size
    : size.split(",").map((item) => item.trim());
  const colorArray = Array.isArray(color)
    ? color
    : color.split(",").map((item) => item.trim());

  // Upload images and associate them with colors
  let images = [];
  if (req.files && req.files.images) {
    try {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Ensure the number of colors matches the number of uploaded images
      if (files.length !== colorArray.length) {
        return res.status(400).json({
          success: false,
          message: "Number of images must match the number of colors",
        });
      }

      // Upload each image and associate it with the corresponding color
      for (let i = 0; i < files.length; i++) {
        const resultImage = await uploadFileToCloudinary(files[i]);
        images.push({ color: colorArray[i], url: resultImage.secure_url });
      }
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error uploading images" });
    }
  }

  const productData = {
    name,
    gender,
    description,
    category,
    brand,
    care,
    price,
    discount,
    stock,
    size: sizeArray,
    color: colorArray,
    images,
    costPrice,
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

const UpdateProductsAPI = async (req, res) => {
  try {
    const {
      name,
      gender,
      description,
      category,
      brand,
      care,
      price,
      stock,
      size,
      color,
      costPrice,
    } = req.body;
    const { id } = req.params;

    // Lấy thông tin sản phẩm cũ từ database
    const existingProduct = await Products.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Xử lý size: giữ lại giá trị cũ nếu không có giá trị mới
    const sizeArray = size
      ? Array.isArray(size)
        ? size
        : size.split(",").map((item) => item.trim())
      : existingProduct.size;

    // Xử lý color: giữ lại giá trị cũ nếu không có giá trị mới
    const colorArray = color
      ? Array.isArray(color)
        ? color
        : color.split(",").map((item) => item.trim())
      : existingProduct.color;

    // Xử lý hình ảnh
    let images = [...existingProduct.images];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Xử lý màu mới và ảnh tương ứng
      try {
        const existingColors = existingProduct.color || [];
        const newColors = colorArray.filter(
          (color) => !existingColors.includes(color)
        );

        if (files.length !== newColors.length) {
          return res.status(400).json({
            success: false,
            message:
              "Số lượng ảnh mới phải khớp với số lượng màu mới được thêm vào",
          });
        }

        // Gắn ảnh mới với màu mới
        for (let i = 0; i < newColors.length; i++) {
          const resultImage = await uploadFileToCloudinary(files[i]);
          images.push({ color: newColors[i], url: resultImage.secure_url });
        }
      } catch (uploadError) {
        console.error("Lỗi khi tải lên hình ảnh:", uploadError.message);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi tải lên hình ảnh",
        });
      }
    }

    // Tạo object chứa các trường cần update
    const updateFields = {
      name: name || existingProduct.name,
      gender: gender || existingProduct.gender,
      description: description || existingProduct.description,
      category: category || existingProduct.category,
      brand: brand || existingProduct.brand,
      care: care || existingProduct.care,
      price: price ? Number(price) : existingProduct.price,
      stock: stock ? Number(stock) : existingProduct.stock,
      size: sizeArray,
      color: colorArray,
      images: images,
      costPrice: costPrice || existingProduct.costPrice,
    };

    // Update sản phẩm
    const updatedProduct = await Products.findByIdAndUpdate(id, updateFields, {
      new: true, // Trả về document sau khi update
    });

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
    });
  }
};

// sửa feeckack
const PutFeedbackProductAPI = async (req, res) => {
  try {
    const { id, userId, rating, review } = req.body;
    const data = await PutFeedbackProduct(id, userId, rating, review);

    return res.status(200).json({
      EC: "cập nhật thành công",
      data: data,
    });
  } catch (error) {}
};

const CategoryGenderAPI = async (req, res) => {
  const page = parseInt(req.params.page || "1", 10); // Ensure page is an integer
  const { gender } = req.params;

  try {
    const { products, totalPages, currentPage } = await CategoryGender(
      gender,
      page
    );

    return res.status(200).json({
      EC: 0,
      data: products,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error("Error in CategoryGenderAPI:", error);
    return res.status(500).json({
      EC: 1,
      message: "Internal Server Error",
    });
  }
};

const toggleLikeRatingAPI = async (req, res) => {
  try {
    const { productId, ratingId, userId } = req.body;

    // Call the toggleLikeRating function
    const { product, action } = await toggleLikeRating(
      productId,
      ratingId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: `Rating successfully ${action}`,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const CategoryGenderFitterAPI = async (req, res) => {
  const page = parseInt(req.params.page || "1", 10); // Ensure page is an integer
  const { gender, category } = req.params;
  try {
    const { products, totalPages, currentPage } = await CategoryGenderFitter(
      gender,
      category,
      page
    );
    return res.status(200).json({
      EC: 0,
      data: products,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error("Error in CategoryGenderAPI:", error);
    return res.status(500).json({
      EC: 1,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  AddProductsAPI,
  ListProductsAPI,
  ListOneProductAPI,
  UpdateProductsAPI,
  PutFeedbackProductAPI,
  CategoryGenderAPI,
  CategoryGenderFitterAPI,
  toggleLikeRatingAPI,
};
