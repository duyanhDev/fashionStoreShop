const { default: mongoose } = require("mongoose");
const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
const addToCart = async (req, res) => {
  const { userId, productId, quantity, size, color } = req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Kiểm tra nếu sản phẩm có tồn tại
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Lấy giá sản phẩm
    const productPrice = productExists.discountedPrice
      ? productExists.discountedPrice
      : productExists.price;

    // Kiểm tra nếu giá sản phẩm là hợp lệ
    if (isNaN(productPrice) || productPrice <= 0) {
      return res.status(400).json({ message: "Invalid product price." });
    }

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (itemIndex > -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        cart.items[itemIndex].quantity = quantity;
        // Cập nhật lại giá trị tổng cho sản phẩm này
        cart.items[itemIndex].totalItemPrice = productPrice * quantity;
      } else {
        // Nếu sản phẩm chưa có, thêm vào giỏ hàng
        cart.items.push({
          productId,
          quantity,
          size: size, // Đảm bảo size luôn là chuỗi
          color: color, // Đảm bảo color luôn là chuỗi
          totalItemPrice: productPrice * quantity, // Tính tổng cho sản phẩm mới
        });
      }

      // Kiểm tra lại giá trị totalItemPrice của tất cả các sản phẩm trong giỏ
      cart.items.forEach((item) => {
        // Kiểm tra nếu giá trị totalItemPrice không hợp lệ và gán lại giá trị 0 nếu cần
        if (isNaN(item.totalItemPrice) || item.totalItemPrice <= 0) {
          item.totalItemPrice = 0; // Đặt lại nếu không hợp lệ
        }
      });

      // Tính toán lại tổng giá trị giỏ hàng
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + (item.totalItemPrice || 0), // Đảm bảo không cộng giá trị NaN
        0
      );

      cart.updatedAt = Date.now();
    } else {
      // Nếu chưa có giỏ hàng, tạo giỏ hàng mới
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
            size: size, // Đảm bảo size luôn là chuỗi
            color: color, // Đảm bảo color luôn là chuỗi
            totalItemPrice: productPrice * quantity, // Tính tổng cho sản phẩm đầu tiên
          },
        ],
        totalPrice: productPrice * quantity, // Tổng giá trị giỏ hàng ban đầu
      });
    }

    // Lưu giỏ hàng
    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCartProduct = async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name images",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      EC: 0,
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// xóa
const RemoveCartProductfirst = async (req, res) => {
  try {
    const { itemId, cartId } = req.params;
    const { userId } = req.body;

    const userCart = await Cart.findOne({ userId: userId });

    if (!userCart) {
      return res.status(400).json({
        EC: "User's cart not found",
      });
    }

    if (String(userCart._id) !== cartId) {
      return res.status(400).json({
        EC: "Provided cartId does not match the user's cart",
      });
    }
    // cập nhật
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: userCart._id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({
        EC: "Cart or item not found",
      });
    }

    const updatedTotalPrice = updatedCart.items.reduce(
      (total, item) => total + item.totalItemPrice,
      0
    );
    updatedCart.totalPrice = updatedTotalPrice;
    await updatedCart.save();

    return res.status(200).json({
      EC: "Xóa thành công sản phẩm",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Error removing item:", error);
    return res.status(400).json({
      EC: "Error removing item",
      error: error.message,
    });
  }
};

module.exports = { addToCart, getCartProduct, RemoveCartProductfirst };
