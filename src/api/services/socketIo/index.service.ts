import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

const setupSocket = (server: HttpServer): IOServer => {
  const io = new IOServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });
  });

  return io;
};

export default setupSocket;
