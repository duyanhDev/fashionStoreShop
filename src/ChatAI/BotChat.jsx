import React, { useState } from "react";
import { PostChatBotAI } from "../service/ChatBot";

const BotChatAI = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là trợ lý ảo.", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

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

  const handleSendMessage = async () => {
    try {
      const res = await PostChatBotAI(inputMessage);

      if (res.data) {
        if (inputMessage.trim() === "") return;

        const newUserMessage = {
          id: messages.length + 1,
          text: inputMessage,
          sender: "user",
        };

        const botResponse = {
          id: messages.length + 2,
          text: res.data.message.content,
          sender: "bot",
        };
        console.log(botResponse);

        setMessages([...messages, newUserMessage, botResponse]);
        setInputMessage("");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
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
              {msg.text}
            </div>
            {msg.sender === "user" && <UserIcon />}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex items-center space-x-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
