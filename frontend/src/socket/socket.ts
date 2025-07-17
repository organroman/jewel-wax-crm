import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (token: string) => {
  socket = io(process.env.NEXT_PUBLIC_API_URL, {
    auth: { token },
    autoConnect: false,
  });

  socket.connect();
  return socket;
};

export const getSocket = () => socket;
