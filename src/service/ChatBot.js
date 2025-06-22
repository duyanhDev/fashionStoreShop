import axios from "./../untils/axios";
const PostChatBotAI = async (message) => {
  return await axios.post("api/v1/genminiAi", { message });
};

export { PostChatBotAI };
