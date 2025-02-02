import { HttpStatusCode } from "axios";
import { Socket } from "socket.io";

export interface SocketError extends Error {
  message: string;
  data?: {
    [key: string]: any;
  };
  statusCode?: number;
}

function error(socket: Socket, err: Error, statusCode: HttpStatusCode, destroy?: boolean): void {
  socket._error(err);
  socket.request.statusMessage = err.message;
  socket.emit('exception', {errorMessage: err.message});
  socket.request.statusCode = statusCode;
  if ( destroy ) socket.request.destroy(err);
}

export default error;