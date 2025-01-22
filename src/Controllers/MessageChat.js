// MessageChat.js
const Message = require("../Model/Message");
const { uploadFileToCloudinary } = require("../services/Cloudinary");
const {
  sendMessageToAdmin,
  sendMessageToCustomer,
} = require("./../services/Message");

const sendMessageCutomerAPI = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const { sender, content, isAdminChat } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        EC: 1,
        message: "Message content is required",
      });
    }

    const imageUrl = [];

    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const file of files) {
        const resultImage = await uploadFileToCloudinary(file);
        imageUrl.push(resultImage.secure_url);
      }
    }

    const newMessage = await sendMessageToAdmin(
      sender,
      content,
      imageUrl,
      isAdminChat
    );

    // Use the io instance attached to req
    const io = req.app.get("io");
    io.emit("newMessage", newMessage);

    return res.status(200).json({
      EC: 0,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      EC: 1,
      message: "An error occurred while sending the message",
      error: error.message,
    });
  }
};

const sendMessageToAdminAPI = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const { sender, recipient, content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        EC: 1,
        message: "Message content is required",
      });
    }

    const imageUrl = [];

    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const file of files) {
        const resultImage = await uploadFileToCloudinary(file);
        imageUrl.push(resultImage.secure_url);
      }
    }

    // Ensure recipient (customer) is provided
    if (!recipient) {
      return res.status(400).json({
        EC: 1,
        message: "Recipient (customer) is required",
      });
    }

    // Send message from admin to customer
    const newMessage = await sendMessageToCustomer(
      sender,
      recipient,
      content,
      imageUrl
    );

    // Use the io instance attached to req to emit the event
    const io = req.app.get("io");
    io.emit("newMessage", newMessage);

    return res.status(200).json({
      EC: 0,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      EC: 1,
      message: "An error occurred while sending the message",
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId, adminId } = req.query;

    if (!userId || !adminId) {
      return res.status(400).json({
        EC: 1,
        message: "userId and adminId are required",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: adminId },
        { sender: adminId, recipient: userId },
      ],
    }).sort({ sentAt: 1 });

    return res.status(200).json({
      EC: 0,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      EC: 1,
      message: "Unable to fetch messages",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessageCutomerAPI,
  sendMessageToAdminAPI,
  getMessages,
};
