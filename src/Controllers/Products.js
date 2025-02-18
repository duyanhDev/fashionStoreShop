const { uploadFileToCloudinary } = require("./../services/Cloudinary");
const {
  AddProducts,
  ListProducts,
  ListOneProducts,
  UpdateProducts,
  PutFeedbackProduct,
  PutFeedbackProducts,
  ProductFilter,
  CategoryGenderFitter,
  toggleLikeRating,
} = require("./../services/Product");
const Products = require("./../Model/Product");

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
  const quantity = 100;
  // Parse sizes and colors into arrays
  const sizeArray = Array.isArray(size)
    ? size
    : size.split(",").map((item) => item.trim());
  const colorArray = Array.isArray(color)
    ? color
    : color.split(",").map((item) => item.trim());

  // Upload images and associate them with colors
  let variants = [];

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

      // Process each color and its associated image
      for (let i = 0; i < colorArray.length; i++) {
        const resultImage = await uploadFileToCloudinary(files[i]);
        const variant = {
          color: colorArray[i],
          sizes: sizeArray.map((size) => ({
            size,
            quantity: quantity,
            sold: 0,
          })),
          images: [{ url: resultImage.secure_url }],
        };
        variants.push(variant);
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
    variants,
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

// const UpdateProductsAPI = async (req, res) => {

//   try {
//     const {
//       name,
//       gender,
//       description,
//       category,
//       brand,
//       care,
//       price,
//       stock,
//       sold,
//       size,
//       color,
//       costPrice,
//     } = req.body;
//     const { id } = req.params;

//     // Lấy thông tin sản phẩm cũ từ database
//     const existingProduct = await Products.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy sản phẩm",
//       });
//     }

//     // Xử lý size: giữ lại giá trị cũ nếu không có giá trị mới
//     const sizeArray = size
//       ? Array.isArray(size)
//         ? size
//         : size.split(",").map((item) => item.trim())
//       : existingProduct.size;

//     // Xử lý color: giữ lại giá trị cũ nếu không có giá trị mới
//     const colorArray = color
//       ? Array.isArray(color)
//         ? color
//         : color.split(",").map((item) => item.trim())
//       : existingProduct.color;

//     // Xử lý hình ảnh
//     let images = [...existingProduct.images];
//     if (req.files && req.files.images) {
//       const files = Array.isArray(req.files.images)
//         ? req.files.images
//         : [req.files.images];

//       // Xử lý màu mới và ảnh tương ứng
//       try {
//         const existingColors = existingProduct.color || [];
//         const newColors = colorArray.filter(
//           (color) => !existingColors.includes(color)
//         );

//         if (files.length !== newColors.length) {
//           return res.status(400).json({
//             success: false,
//             message:
//               "Số lượng ảnh mới phải khớp với số lượng màu mới được thêm vào",
//           });
//         }

//         // Gắn ảnh mới với màu mới
//         for (let i = 0; i < newColors.length; i++) {
//           const resultImage = await uploadFileToCloudinary(files[i]);
//           images.push({ color: newColors[i], url: resultImage.secure_url });
//         }
//       } catch (uploadError) {
//         console.error("Lỗi khi tải lên hình ảnh:", uploadError.message);
//         return res.status(500).json({
//           success: false,
//           message: "Lỗi khi tải lên hình ảnh",
//         });
//       }
//     }

//     // Tạo object chứa các trường cần update
//     const updateFields = {
//       name: name || existingProduct.name,
//       gender: gender || existingProduct.gender,
//       description: description || existingProduct.description,
//       category: category || existingProduct.category,
//       brand: brand || existingProduct.brand,
//       care: care || existingProduct.care,
//       price: price ? Number(price) : existingProduct.price,
//       stock: stock ? Number(stock) : existingProduct.stock,
//       sold: sold ? Number(sold) : existingProduct.sold,
//       size: sizeArray,
//       color: colorArray,
//       images: images,
//       costPrice: costPrice || existingProduct.costPrice,
//     };

//     // Update sản phẩm
//     const updatedProduct = await Products.findByIdAndUpdate(id, updateFields, {
//       new: true, // Trả về document sau khi update
//     });

//     return res.status(200).json({
//       success: true,
//       data: updatedProduct,
//       message: "Cập nhật sản phẩm thành công",
//     });
//   } catch (error) {
//     console.error("Lỗi cập nhật sản phẩm:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Lỗi khi cập nhật sản phẩm",
//     });
//   }
// };

// sửa feeckack

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
      discount,
      stock,
      sold,
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

    // Xử lý size và color thành mảng
    const sizeArray = size
      ? Array.isArray(size)
        ? size
        : size.split(",").map((item) => item.trim())
      : [];
    const colorArray = color
      ? Array.isArray(color)
        ? color
        : color.split(",").map((item) => item.trim())
      : [];

    // Xử lý hình ảnh và variants
    let variants = [...existingProduct.variants]; // Bản sao của variants cũ

    if (req.files && req.files.images) {
      try {
        const files = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        // Kiểm tra số lượng ảnh khớp với số màu mới
        if (files.length !== colorArray.length) {
          return res.status(400).json({
            success: false,
            message: "Số lượng ảnh phải khớp với số màu mới",
          });
        }

        // Xử lý từng màu và ảnh tương ứng
        for (let i = 0; i < colorArray.length; i++) {
          const resultImage = await uploadFileToCloudinary(files[i]);

          // Tạo hoặc cập nhật variant mới
          const existingVariant = variants.find(
            (variant) => variant.color === colorArray[i]
          );

          if (existingVariant) {
            // Cập nhật hình ảnh và kích thước của variant cũ
            existingVariant.images.push({ url: resultImage.secure_url });
            existingVariant.sizes = sizeArray.map((size) => ({
              size,
              quantity:
                existingVariant.sizes.find((s) => s.size === size)?.quantity ||
                100,
              sold:
                existingVariant.sizes.find((s) => s.size === size)?.sold || 0,
            }));
          } else {
            // Tạo variant mới
            const newVariant = {
              color: colorArray[i],
              sizes: sizeArray.map((size) => ({
                size,
                quantity: 100,
                sold: 0,
              })),
              images: [{ url: resultImage.secure_url }],
            };
            variants.push(newVariant);
          }
        }
      } catch (uploadError) {
        console.error("Lỗi khi tải lên hình ảnh:", uploadError.message);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi tải lên hình ảnh",
        });
      }
    }
    const finalCostPrice = costPrice || existingProduct.costPrice;
    const finalDiscount = discount || existingProduct.discount;
    const discountedPrice = finalCostPrice * (1 - finalDiscount / 100);
    // Tạo object chứa các trường cần update
    const updateFields = {
      name: name || existingProduct.name,
      gender: gender || existingProduct.gender,
      description: description || existingProduct.description,
      category: category || existingProduct.category,
      brand: brand || existingProduct.brand,
      care: care || existingProduct.care,
      price: price ? Number(price) : existingProduct.price,
      discount: discount || existingProduct.discount,
      stock: stock ? Number(stock) : existingProduct.stock,
      sold: sold ? Number(sold) : existingProduct.sold,
      costPrice: costPrice || existingProduct.costPrice,
      discountedPrice: discountedPrice || existingProduct.discountedPrice,
      variants, // Cập nhật variants
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
    console.error("Lỗi cập nhật sản phẩm:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
    });
  }
};

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

const PutFeedbackProductsAPI = async (req, res) => {
  try {
    const { id, userId, rating, review } = req.body;
    console.log(id, userId, rating, review);
    const data = await PutFeedbackProducts(id, userId, rating, review);
    console.log(data);

    return res.status(200).json({
      EC: "cập nhật thành công",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};
const CategoryGenderAPI = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10); // Đảm bảo page là số nguyên
  const {
    gender,
    category,
    minPrice,
    maxPrice,
    sortName,
    sortPrice,
    sortDate,
    sortSold,
  } = req.query;

  try {
    const { products, totalPages, currentPage } = await ProductFilter({
      gender,
      category,
      minPrice,
      maxPrice,
      sortName,
      sortPrice,
      sortDate,
      sortSold,
      page,
    });

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
  PutFeedbackProductsAPI,
  CategoryGenderAPI,
  CategoryGenderFitterAPI,
  toggleLikeRatingAPI,
};
