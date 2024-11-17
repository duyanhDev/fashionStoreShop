const Order = require("./../Model/Order");
const Users = require("./../Model/User");
const Product = require("../Model/Product");
const qs = require("qs");
const crypto = require("crypto");
const moment = require("moment");
require("dotenv").config();
const nodemailer = require("nodemailer");

const CreateOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, email } = req.body;

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
    let emailContent = `<h3>Your order details:</h3><ul>`; // Declare and initialize email content here

    for (const item of items) {
      if (!item.productId || !item.price || isNaN(item.price)) {
        throw new Error("Each item must have a valid productId and price.");
      }

      // Fetch product details (including image)
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error("Product not found.");
      }

      // Calculate total amount for the order
      totalAmount += item.price * item.quantity;
      console.log(product.images[0]);

      // Add product details to the email content
      emailContent += `
        <li>
          <strong>Product:</strong> ${product.name} <br>
          <strong>Quantity:</strong> ${item.quantity} <br>
          <strong>Size:</strong> ${item.size} <br>
          <strong>Color:</strong> ${item.color} <br>
          <strong>Price:</strong> ${item.price} VND <br>
          <strong>Total:</strong> ${item.price * item.quantity} VND <br>
          <img src="${product.images[0]}" alt="${product.name}" width="100px" />

        </li>
      `;
    }

    emailContent += `</ul>`;
    emailContent += `<h4><strong>Total Order Amount:</strong> ${totalAmount} VND</h4>`;

    // Create new order
    const newOrder = new Order({
      userId,
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

    // Use find to get all orders for the given userId
    let data = await Order.find({ userId: userId });

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

module.exports = { CreateOrder, listOderUserId };
