const Order = require("./../Model/Order");
const Users = require("./../Model/User");
const Product = require("../Model/Product");
const Cart = require("../Model/Cart");
const qs = require("qs");
const crypto = require("crypto");
const moment = require("moment");
require("dotenv").config();
const nodemailer = require("nodemailer");
const axios = require("axios");

const CreateOrder = async (req, res) => {
  try {
    const {
      userId,
      username,
      phone,
      items,
      shippingAddress,
      paymentMethod,
      email,
      CartId,
      productId,
    } = req.body;

    // Validate input data
    if (!userId || !items || !paymentMethod || !shippingAddress) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const checkUser = await Users.findOne({ _id: userId });
    if (!checkUser) {
      return res.status(400).json({ message: "User does not exist." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items must be a non-empty array." });
    }

    let totalAmount = 0;
    let emailContent = `<div>THÔNG TIN ĐƠN HÀNG - DÀNH CHO NGƯỜI MUA:</div><ul>`;

    const formatPrice = (price) => {
      if (price === undefined || price === null) {
        return "0đ"; // Return fallback value if price is not valid
      }
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };
    for (const item of items) {
      if (!item.productId || !item.price || isNaN(item.price)) {
        throw new Error("Each item must have a valid productId and price.");
      }

      // Fetch product details (including image)
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error("Product not found.");
      }
      console.log(item.price);

      // Calculate total amount for the order
      totalAmount += item.price;

      // Add product details to the email content
      emailContent += `
        <li>
          <img src="${product.images[0].url}" alt="${
        product.name
      }" width="100px" /> <br>
          <span>Tên sản phẩm:</span> ${product.name} <br>
          <span>Số lượng:</span> ${item.quantity} <br>
          <span>Size:</span> ${item.size} <br>
          <span>Màu sắc:</span> ${item.color} <br>
          <span>Giá :</span> ${formatPrice(item.price)} VND <br>
        
  

        </li>
      `;
    }

    emailContent += `</ul>`;
    emailContent += `<h4><span>Tổng giá tiền thanh toán:</span> ${formatPrice(
      totalAmount
    )} VND</h4>`;

    // Create new order
    const newOrder = new Order({
      userId,
      username,
      phone,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });
    await newOrder.save();

    // Send email with the order details
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "dangtrinhduyanh100202@gmail.com",
        pass: "qfmc zizc ppdg ldjg", // Ensure to replace this with a proper way to store secrets
      },
    });

    const mailOptions = {
      from: "dangtrinhduyanh100202@gmail.com",
      to: email,
      subject: "Your Order Confirmation",
      html: emailContent, // Send HTML content
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const CartItem = await Cart.findOne({ _id: CartId });

    if (!CartItem) {
      throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    const idsToDelete = productId; // productId là mảng các _id cần xóa

    // Sử dụng $pull để xóa các phần tử trong mảng items
    const resultCart = await Cart.updateOne(
      { _id: CartId },
      { $pull: { items: { productId: { $in: idsToDelete } } } }
    );

    if (resultCart.modifiedCount > 0) {
      console.log(`${idsToDelete.length} sản phẩm đã được xóa khỏi giỏ hàng.`);
    } else {
      console.log("Không có sản phẩm nào được xóa.");
    }
    // Handle VNPay payment method
    if (paymentMethod === "vnpay") {
      const { vnp_TmnCode, vnp_HashSecret, vnp_ReturnUrl } = process.env;

      if (!vnp_TmnCode || !vnp_HashSecret || !vnp_ReturnUrl) {
        return res
          .status(500)
          .json({ message: "Missing VNPay configuration." });
      }

      const createDate = moment().format("YYYYMMDDHHmmss");
      const orderId = moment().format("DDHHmmss");
      const amount = totalAmount * 100; // Convert to smallest VND unit

      let vnp_Params = {
        vnp_Amount: amount,
        vnp_Command: "pay",
        vnp_CreateDate: createDate,
        vnp_CurrCode: "VND",
        vnp_IpAddr: "127.0.0.1", // Dynamically set IP address
        vnp_Locale: "vn",
        vnp_OrderInfo: encodeURIComponent(
          `Thanh toan don hang : ${orderId}`
        ).replace(/%20/g, "+"),
        vnp_OrderType: "other",
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_TmnCode: vnp_TmnCode,
        vnp_TxnRef: orderId,
        vnp_Version: "2.1.0",
      };
      newOrder.paymentStatus = "Completed";
      await newOrder.save();

      // Sort parameters alphabetically
      vnp_Params = sortObject(vnp_Params);

      // Generate the secure hash
      const signData = qs.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac("sha512", vnp_HashSecret);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;

      // Build the VNPay URL
      const vnpUrl = `${process.env.vnp_Url}?${qs.stringify(vnp_Params, {
        encode: false,
      })}`;

      return res.status(200).json({
        EC: 0,
        message: "Order created successfully. Redirecting to VNPay.",
        vnpUrl: vnpUrl,
      });
    } else if (paymentMethod === "cod") {
      return res.status(200).json({
        EC: 0,
        message:
          "Order created successfully. Payment will be made upon delivery.",
      });
    } else if (paymentMethod === "momo") {
      const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
      const accessKey = "F8BBA842ECF85";
      const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const orderInfo = "pay with MoMo";
      const partnerCode = "MOMO";
      const redirectUrl =
        "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
      const ipnUrl =
        "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
      const requestType = "payWithMethod";
      const amount = totalAmount;
      const orderId = partnerCode + new Date().getTime(); // Generate a unique order ID
      const requestId = orderId; // Generate a unique request ID
      const extraData = ""; // Pass empty or encode base64 JSON string if needed
      const partnerName = "MoMo Payment";
      const storeId = "Test Store";
      const orderGroupId = "";
      const autoCapture = true;
      const lang = "vi";

      // Create the raw signature string
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      // Sign the signature string using HMAC SHA256
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      // Create the payload for the request
      const payload = {
        partnerCode,
        partnerName,
        storeId,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
      };
      newOrder.paymentStatus = "Completed";
      await newOrder.save();
      try {
        // Send the request to MoMo API
        const response = await axios.post(endpoint, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Only send the response data back to the client
        return res.status(200).json({
          EC: 0,
          data: response.data, // Extracting only the response data
        });
      } catch (error) {
        console.error("Error creating MoMo payment:", error);
        // Optionally, return an error response to the client
        return res.status(500).json({
          EC: 1,
          message: "Failed to create MoMo payment",
          error: error.message, // Provide error details (optional)
        });
      }
    } else {
      return res.status(400).json({
        message:
          "Invalid payment method. Only VNPay and COD are supported for this integration.",
      });
    }
  } catch (error) {
    console.error("Error creating order:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const listOderUserId = async (req, res) => {
  try {
    let { userId } = req.params;

    let data = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return res.status(500).json({
      EC: "1",
      message: "Internal server error",
    });
  }
};
const UpDateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOneAndUpdate(
      { _id: id },
      {
        orderStatus: "Delivered",
        paymentStatus: "Completed",
      },
      { new: true } // Chỉ định trả về đối tượng đã cập nhật
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = Math.max(product.stock - item.quantity, 0);
        await product.save();
      } else {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });
      }
    }

    res
      .status(200)
      .json({ message: "Order status updated and stock updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalProductsSold = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalProductsSold = orders.reduce((total, order) => {
      return (
        total +
        order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0)
      );
    }, 0);

    res.status(200).json({
      message: "Total products sold retrieved successfully",
      totalProductsSold,
    });
  } catch (error) {
    console.error("Error retrieving total products sold:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// lấy tổng số lương sản pjhaamr bán
const getTotalProductsSoldByType = async (req, res) => {
  try {
    const orders = await Order.find();

    const productSales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity;
        } else {
          productSales[item.productId] = {
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
          };
        }
      });
    });

    const salesArray = Object.values(productSales);

    res.status(200).json({
      message: "Total products sold by type retrieved successfully",
      productsSold: salesArray,
    });
  } catch (error) {
    console.error("Error retrieving total products sold by type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ListOderProducts = async (req, res) => {
  try {
    let data = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Order.findOne({ _id: id });
    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CreateOrder,
  listOderUserId,
  UpDateOrder,
  getTotalProductsSold,
  getTotalProductsSoldByType,
  ListOderProducts,
  getOrderOneProduct,
};
