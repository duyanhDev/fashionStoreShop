import axios from "./../untils/axios";
const PostChatBotAI = async (message) => {
  return await axios.post("http://localhost:9000/api/v1/ChatAI", { message });
};

export { PostChatBotAI };
