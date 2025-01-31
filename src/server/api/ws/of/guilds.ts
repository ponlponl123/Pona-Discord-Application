import { Server } from "socket.io";

export default function dynamicGuildNamespace(io: Server) {
  io.of(/^\/guilds\/\d+$/).on("connection", (socket) => {
    const namespace = socket.nsp.name.split('/')[2]; // newNamespace.name === "/dynamic-101"
  
    console.log('namespace', namespace);
  });
}