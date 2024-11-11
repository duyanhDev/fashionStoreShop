const Cart = require("../Model/Cart");
const Product = require("../Model/Product");

const addToCart = async (req, res) => {
  const { userId, productId, quantity, size, color, totalPrice } = req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Lấy giá của sản phẩm

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Kiểm tra sản phẩm đã có trong giỏ hay chưa
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (itemIndex > -1) {
        // Nếu sản phẩm đã có, thay đổi quantity thay vì cộng dồn
        cart.items[itemIndex].quantity = quantity;
      } else {
        // Thêm sản phẩm mới vào giỏ
        cart.items.push({ productId, quantity, size, color });
      }

      // Cập nhật lại tổng giá
      cart.totalPrice = totalPrice;
      cart.updatedAt = Date.now();
    } else {
      // Nếu chưa có giỏ hàng, tạo mới
      cart = new Cart({
        userId,
        items: [{ productId, quantity, size, color }],
        totalPrice: totalPrice, // Tính tổng giá ban đầu
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

    console.log(userId);

    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Hàm tính tổng giá

module.exports = { addToCart, getCartProduct };
