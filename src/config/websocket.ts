const { HTTP_PORT, WEBSOCKET_SECRET_ROOT_AUTHORIZED_KEY } = process.env;

var toPort = Number(HTTP_PORT);

if (!HTTP_PORT || !toPort) 
  throw new Error("Missing environment variables");

export const config = {
  WEBSOCKET_PORT: toPort,
  WEBSOCKET_SECRET_ROOT_AUTHORIZED_KEY
};