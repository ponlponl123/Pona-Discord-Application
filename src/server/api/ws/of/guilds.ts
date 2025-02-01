import trafficDebugger from "@/server/middlewares/socket/trafficDebuger";
import { Server } from "socket.io";
import { discordClient as self } from '@/index';
import eventManager from '@/events';
import { FetchUserByOAuth } from "@/utils/oauth";
import { HttpStatusCode } from "axios";

export default async function dynamicGuildNamespace(io: Server) {
  const io_guild = io.of(/^\/guilds\/\d+$/);

  io_guild.on("connection", async (socket) => {
    trafficDebugger(socket);
    const guildId = socket.nsp.name.split('/')[2];

    if (
      !Number.isInteger(guildId) ||
      !socket.handshake.auth.type ||
      !socket.handshake.auth.token
    ) {
      const err = Error("Invalid guild ID or authentication details");
      socket._error(err);
      socket.request.statusMessage = err.message;
      socket.emit('exception', {errorMessage: err.message});
      socket.request.statusCode = HttpStatusCode.Unauthorized;
      return socket.request.destroy(err);
    }

    const OauthType = socket.handshake.auth.type;
    const accessToken = socket.handshake.auth.token;
    const guild = self.client.guilds.cache.get(guildId);
    const user = await FetchUserByOAuth(OauthType, accessToken);

    if (
      !user ||
      !guild ||
      (user && !guild.members.cache.has(user.id))
    ) {
      const err = Error("User not found or not a member of the guild");
      socket._error(err);
      socket.request.statusMessage = err.message;
      socket.emit('exception', {errorMessage: err.message});
      socket.request.statusCode = HttpStatusCode.NotFound;
      return socket.request.destroy(err);
    }

    const events = new eventManager();
    // soon.. i will sleep now :)

    socket.join(guildId);
    io_guild.to(guildId).emit("hello");
  });
}