"use client";

import { connectSocket, getSocket } from "@/socket/socket";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext<ReturnType<typeof getSocket> | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) throw new Error("Socket not available");
  return context;
};

export function SocketProvider({
  token,
  children,
}: {
  token?: string;
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<ReturnType<typeof getSocket> | null>(
    null
  );

  useEffect(() => {
    if (token) {
      const sock = connectSocket(token);
      setSocket(sock);

      return () => {
        sock.disconnect();
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
