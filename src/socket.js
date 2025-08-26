import { io } from "socket.io-client";

// chỉ khởi tạo 1 socket duy nhất
const socket = io("http://localhost:9000", {
  autoConnect: true,
});

export default socket;
