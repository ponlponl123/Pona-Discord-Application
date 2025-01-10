import { Socket } from "socket.io";
import default_message from "./on/default";

export default function register(socket: Socket) {
  
  // Regis Default OnMessage function
  default_message(socket);

}