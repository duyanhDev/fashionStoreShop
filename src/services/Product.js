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
      { new: true } // Trả về sản phẩm đã được cập nhật
    );

    return feedback;
  } catch (error) {
    console.log(error);
    throw error; // Ném lỗi ra ngoài nếu cần xử lý thêm
  }
};

const CategoryGender = async (gender) => {
  try {
    const data = await Products.find({ gender: gender });
    return data;
  } catch (error) {}
};

module.exports = {
  AddProducts,
  ListProducts,
  ListOneProducts,
  UpdateProducts,
  PutFeedbackProduct,
  CategoryGender,
};