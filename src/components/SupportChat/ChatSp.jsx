import "./ChatSp.css";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  getMessages,
  sendMessageAdmin,
  getMessagesList,
  UpdateIsReadAPI,
} from "../../service/Message";
import { useSelector } from "react-redux";

const socket = io("http://localhost:9000", {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
});
const ChatSp = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [data, SetData] = useState([]);
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [senderId, setSenderId] = useState("");
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Gửi tin nhắn cho server
      const sentTime = new Date().toISOString(); // Lấy thời gian hiện tại

      await sendMessageAdmin(user?._id, senderId, newMessage, null, sentTime); // Truyền sentTime

      // Thêm tin nhắn vào state ngay lập tức mà không cần phải reload
      const newMsg = {
        _id: new Date().getTime(), // Dùng thời gian làm _id tạm thời
        sender: user?._id,
        recipient: senderId,
        content: newMessage,
        sentAt: sentTime,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchgetMess = async () => {
    if (!user?._id) return;

    try {
      let res = await getMessages(user._id, senderId);
      if (res?.data) {
        setMessages(res.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchgetMessList = async () => {
    if (!user?._id) return;

    try {
      let res = await getMessagesList(user._id);
      if (res?.data) {
        SetData(res.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
      fetchgetMess();
      fetchgetMessList();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...(prevMessages || []), message]);
      fetchgetMess();
      fetchgetMessList();
      scrollToBottom();
    });

    fetchgetMess();
    fetchgetMessList();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newMessage");
    };
  }, [user?._id, senderId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleChangeSetId = (id) => {
    setSenderId(id);
  };

  const onChangeIsread = async () => {
    try {
      let data = await UpdateIsReadAPI(senderId, user._id);

      if (data) {
        fetchgetMessList();
        fetchgetMess();
      }
    } catch (error) {}
  };
  const allMessages = [...data, ...messages].map((item) => {
    return item;
  }); // Sắp xếp mới nhất
  console.log("x", messages);
  console.log("data", data);

  return (
    <div className="chat_container ">
      <div className="flex justify-between m-6 main_chat">
        <div className="w-1/5 main_chat-users">
          <h1 className="text_main-h1 text-center">Tất cả</h1>
          {data
            .filter(
              (item, index, self) =>
                item.sender?._id && // Kiểm tra item.recipient và item.recipient._id
                index ===
                  self.findIndex((t) => t.sender?._id === item.sender?._id)
            )
            .map(
              (item) =>
                item.sender?._id !== user._id && (
                  <div
                    key={item.sender._id}
                    className="mt-5 cursor-pointer"
                    onClick={onChangeIsread}
                  >
                    <div
                      className="flex justify-center gap-3 items-center "
                      onClick={() => handleChangeSetId(item.sender._id)}
                    >
                      <img
                        src={item.sender.avatar}
                        className="w-12 h-12 rounded-full "
                        alt="avatar"
                      />
                      <div className="w-32">
                        <span>{item.sender.name}</span>
                        <p
                          className={`${
                            item.isRead
                              ? "text-blue-400"
                              : "text-black font-bold"
                          }`}
                        >
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )
            )}
        </div>

        <div className="w-4/5">
          <div className="flex flex-col mess_users-cl mt-4">
            <div className="text-white flex justify-between items-center">
              <h1 className="text-xl font-bold text-black">
                {data
                  .filter(
                    (item, index, self) =>
                      item.sender?._id && // Kiểm tra item.recipient và item.recipient._id
                      index ===
                        self.findIndex((t) => t.sender?._id === senderId)
                  )
                  .map(
                    (item) =>
                      item.sender?._id !== user._id && (
                        <div
                          key={item.sender._id}
                          className="mt-5 cursor-pointer"
                        >
                          <div
                            className="flex justify-center gap-3 items-center "
                            onClick={() => handleChangeSetId(item.sender._id)}
                          >
                            <img
                              src={item.sender.avatar}
                              className="w-12 h-12 rounded-full "
                              alt="avatar"
                            />
                            <div>
                              <span>{item.sender.name}</span>
                            </div>
                          </div>
                        </div>
                      )
                  )}
              </h1>
              <h1 className="text-xl font-bold text-black">
                <CloseOutlined />
              </h1>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {Array.isArray(messages) &&
                messages.map((message, index) => (
                  <div
                    key={message?._id || index}
                    className={`flex ${
                      message.sender?._id === user?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender?._id === user?._id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="flex  items-center gap-1">
                        <img
                          className="w-12 h-12 rounded-full"
                          src={
                            message?.sender?.avatar || "default-avatar-url.jpg"
                          } // URL ảnh mặc định nếu không có avatar
                          alt="Avatar"
                        />

                        <span>{message?.sender?.name}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {message.sentAt &&
                          new Date(message.sentAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t">
              <form
                onSubmit={handleSend}
                className="relative flex items-end space-x-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    onClick={onChangeIsread}
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500 resize-none min-h-[40px] max-h-[150px] overflow-y-auto"
                    style={{ lineHeight: "20px" }}
                  />
                </div>
                <div className="flex-shrink-0 self-center">
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="h-10 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                  >
                    Gửi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSp;
