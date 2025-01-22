import axios from "./../untils/axios";

const getMessages = async (userId, adminId) => {
  try {
    const response = await axios.get(`http://localhost:9000/api/v1/message`, {
      params: { userId, adminId }, // Sử dụng đối tượng { key: value } cho params
    });
    return response.data; // Trả về dữ liệu tin nhắn
  } catch (error) {
    console.error("Error fetching messages:", error.message); // Log lỗi nếu xảy ra
    throw error; // Ném lỗi để xử lý ở nơi khác (nếu cần)
  }
};

const sendMessageCutomer = async (sender, content, image, isAdminChat) => {
  const formData = new FormData();
  formData.append("sender", sender); // Người gửi
  formData.append("content", content); // Nội dung tin nhắn
  if (image) {
    formData.append("image", image); // Nếu có hình ảnh thì gửi cùng
  }
  formData.append("isAdminChat", isAdminChat); // Đánh dấu đây là tin nhắn từ admin hay khách hàng

  // If isAdminChat is false, do not append recipient

  try {
    const response = await axios.post(
      "http://localhost:9000/api/v1/customer/send", // Đường dẫn API của bạn
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export { getMessages, sendMessageCutomer };
