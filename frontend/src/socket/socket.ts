import { io, Socket } from "socket.io-client";

let socket: Socket;

const getSocketBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL!;
  return url.replace(/\/api\/?$/, "");
};

export const connectSocket = (token: string) => {
  socket = io(getSocketBaseUrl(), {
    path: "/socket.io",
    transports: ["websocket"],
    auth: { token },
    autoConnect: false,
  });

  socket.connect();
  return socket;
};

export const getSocket = () => socket;
