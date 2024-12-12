import React, { useState } from "react";
import { PostChatBotAI } from "../service/ChatBot";
import { useOutletContext } from "react-router-dom";

const BotChatAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý ảo. một số gợi ý để biết thông tin về trang web hoặc sản phẩm : người viết ra trang web này là ai ? : gợi ý sản phẩm",
      sender: "bot",
    },
  ]);
  const { user, ListProducts } = useOutletContext();

  const [inputMessage, setInputMessage] = useState("");

  // Icons for user and bot
  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const BotIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z"
      />
    </svg>
  );

  const SendIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />
    </svg>
  );

  // Handle sending messages
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newUserMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    const lowerCaseMessage = inputMessage.trim().toLowerCase();

    // Hàm kiểm tra từ khóa
    const checkKeywords = (keywords) =>
      keywords.some((keyword) => lowerCaseMessage.includes(keyword));

    // Nhóm từ khóa
    const keywordGroups = {
      products: ["sản phẩm", "list", "danh sách", "hàng hóa"],
      highPriceProducts: ["giá cao", "cao cấp", "đắt tiền", "premium"],
      author: ["người viết", "tác giả", "sáng lập", "creator"],
    };

    // Xử lý sản phẩm
    if (checkKeywords(keywordGroups.products)) {
      const productSuggestions = ListProducts.map(
        (product, index) => `
          <li>
            <strong>${index + 1}. ${product.name}</strong>
            <p>Giá: ${product.price.toLocaleString()}đ</p>
          </li>`
      ).join("");

      const botResponse = {
        id: Date.now() + 1,
        text: `
          <strong>🛒 Danh sách sản phẩm của chúng tôi:</strong>
          <ul>${productSuggestions}</ul>
        `,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botResponse]);
      return;
    }

    // Xử lý sản phẩm cao cấp
    if (checkKeywords(keywordGroups.highPriceProducts)) {
      const productPricesMax = ListProducts.filter(
        (product) => product.price > 2000000
      )
        .map(
          (product, index) => `
        <li>
          <strong>${index + 1}. ${product.name}</strong>
          <p>Giá: ${product.price.toLocaleString()}đ</p>
        </li>`
        )
        .join("");

      const productRes = {
        id: Date.now() + 2,
        text:
          productPricesMax.length > 0
            ? `
            <strong>💎 Sản phẩm cao cấp của chúng tôi:</strong>
            <ul>${productPricesMax}</ul>
          `
            : "🔍 Hiện tại không có sản phẩm cao cấp nào.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, productRes]);
      return;
    }

    // Xử lý thông tin tác giả
    if (checkKeywords(keywordGroups.author)) {
      const authorProfile = {
        name: "Đặng Trinh Duy Anh",
        education: "Đại học Thủ Dầu Một",
        skills: [
          "Phát triển ứng dụng web hiện đại",
          "Thành thạo React và Node.js",
          "Quản lý cơ sở dữ liệu với MongoDB",
          "Xây dựng hệ thống API mạnh mẽ",
        ],
        bio: "Một lập trình viên đầy nhiệt huyết với tầm nhìn đổi mới công nghệ. Luôn tìm cách học hỏi, sáng tạo và áp dụng những công nghệ mới để giải quyết các bài toán phức tạp.",
        contact: "duyanh@gmail.com",
        socialMedia: {
          github: "https://github.com/duyanh",
          linkedin: "https://linkedin.com/in/duyanh",
        },
        relationshipStatus: "Độc thân",
      };

      const authorResponse = {
        id: Date.now() + 3,
        text: `
          <strong>👨‍💻 Giới thiệu người sáng lập:</strong>
          <ul>
            <li><strong>Họ và tên:</strong> ${authorProfile.name}</li>
            <li><strong>Học vấn:</strong> ${authorProfile.education}</li>
            <li>
              <strong>Kỹ năng nổi bật:</strong>
              <ul>
                ${authorProfile.skills
                  .map((skill) => `<li>✅ ${skill}</li>`)
                  .join("")}
              </ul>
            </li>
            <li><strong>Tiểu sử:</strong> ${authorProfile.bio}</li>
            <li>
              <strong>Liên hệ:</strong> 
              <p>📧 Email: ${authorProfile.contact}</p>
              <p>🔗 GitHub: ${authorProfile.socialMedia.github}</p>
              <p>🔗 LinkedIn: ${authorProfile.socialMedia.linkedin}</p>
            </li>
            <li><strong>Trạng thái:</strong> ${
              authorProfile.relationshipStatus
            }</li>
          </ul>
        `,
        sender: "bot",
      };

      setMessages((prev) => [...prev, authorResponse]);
      return;
    }

    // Xử lý tin nhắn AI nếu không khớp các từ khóa
    try {
      const res = await PostChatBotAI(inputMessage.trim());

      if (res.data?.message?.content) {
        const formattedContent = res.data.message.content
          .replace(/(?:\*|[*] )(.*)/g, "<li>$1</li>")
          .replace(/(?:[*]{2})(.*)(?:[*]{2})/g, "<strong>$1</strong>");

        const botResponse = {
          id: Date.now() + 1,
          text: formattedContent,
          sender: "bot",
        };

        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "❌ Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Message list */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && <BotIcon />}
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {/* Render content conditionally */}
              {msg.sender === "bot" ? (
                <ul
                  dangerouslySetInnerHTML={{
                    __html: `<ul>${msg.text}</ul>`,
                  }}
                />
              ) : (
                msg.text
              )}
            </div>
            {msg.sender === "user" && (
              <div className="flex items-center space-x-2">
                <UserIcon />
                <p className="text-sm text-gray-600">
                  {user?.name || "Người dùng"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-4 bg-white border-t flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Nhập tin nhắn..."
          className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default BotChatAI;
