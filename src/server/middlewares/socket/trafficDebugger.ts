import { Socket } from "socket.io";
import { prefix as consolePrefix, type as consoleType } from "@/config/console";

export default function trafficDebugger(socket: Socket): void {
  console.log(consoleType.info, consolePrefix.socket + `🟢 connected with transport ${socket.conn.transport.name} ${socket.nsp.name} (${socket.id}) from ${socket.handshake.address}`);
  
  socket.on("disconnect", (reason: string) => {
    console.log(consoleType.info, consolePrefix.socket + `⚫ Good bye ${socket.conn.transport.name} ${socket.nsp.name} (${socket.id}) from ${socket.handshake.address}\n\t↳`, reason);
  });
}