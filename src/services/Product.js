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
    const products = await Products.find({}).populate("category", "name");

    // Chuyển đổi từng sản phẩm để bao gồm virtual fields
    const data = products.map((product) => product.toJSON());

    return data;
  } catch (error) {
    console.log("list products error:", error);
    throw error;
  }
};

// oneupdate
const ListOneProducts = async (id) => {
  try {
    const data = await Products.findOne({ _id: id })
      .populate("category", "name")
      .populate({
        path: "ratings.userId", // Lấy thông tin userId trong ratings
        select: "name avatar", // Chỉ lấy trường name từ model Users
      });

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
        costPrice: productData.costPrice,
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

// đánh giá
const PutFeedbackProduct = async (id, userId, rating, review) => {
  try {
    const feedback = await Products.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          ratings: {
            userId,
            rating,
            review,
          },
        },
      },
      { new: true }
    );

    return feedback;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const toggleLikeRating = async (productId, ratingId, userId) => {
  // Find the product by ID
  const product = await Products.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Find the rating by ID within the product's ratings
  const rating = product.ratings.id(ratingId);
  if (!rating) {
    throw new Error("Rating not found");
  }

  const isLiked = rating.likes.includes(userId);
  if (isLiked) {
    rating.likes = rating.likes.filter((id) => id.toString() !== userId);
  } else {
    rating.likes.push(userId);
  }

  await product.save();

  return {
    product,
    action: isLiked ? "unliked" : "liked",
  };
};

const CategoryGender = async (gender, page) => {
  try {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const [products, count] = await Promise.all([
      Products.find({ gender }).skip(skip).limit(perPage),
      Products.countDocuments({ gender }),
    ]);

    const totalPages = Math.ceil(count / perPage);

    return { products, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching products by gender:", error);
    throw new Error("Error fetching products");
  }
};

const CategoryGenderFitter = async (gender, category, page) => {
  try {
    const perPage = 10;
    const skip = (page - 1) * perPage;

    const [products, count] = await Promise.all([
      Products.find({ gender, category }).skip(skip).limit(perPage),
      Products.countDocuments({ gender, category }),
    ]);

    const totalPages = Math.ceil(count / perPage);

    return { products, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching products by gender and category:", error);
    throw new Error("Error fetching products");
  }
};

module.exports = {
  AddProducts,
  ListProducts,
  ListOneProducts,
  UpdateProducts,
  PutFeedbackProduct,
  CategoryGender,
  CategoryGenderFitter,
  toggleLikeRating,
};
