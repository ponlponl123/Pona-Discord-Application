import { Socket } from "socket.io";

export default function default_message(socket: Socket) {

  // OnMessage: Help
  // Emits: help
  // Receives: None.
  // Sends: help message with general information about WebSocket API.
  socket.on("help", () => {
    socket.emit("help", `Hello!, ${socket.id}. Welcome to Pona! WebSocket API. Here are general available messages:
- help: Display this message.
- ping: This will return Pong!.
- heartbeat: This will make your socket get more priority because heartbeat message will tell api to know your socket is still alive, but if you send too much heartbeat that mean your socket not healthy. your socket will be decrease priority or die.`);
  });

  // OnMessage: Ping
  // Emits: pong
  // Receives: None.
  // Sends: Pong!.
  socket.on("ping", () => {
    socket.emit("pong", "Pong!")
  });
}