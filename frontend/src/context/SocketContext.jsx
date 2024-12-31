import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    if (userId) {

      const socketInstance = io("http://localhost:8000", {
        withCredentials: true,
        query: { userId }
      });

      socketInstance.on("connect", () => {
        setIsSocketReady(true);
      });

      setSocket(socketInstance);

      socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setIsSocketReady(false);
      };
    } else {
      setSocket(null);
      setIsSocketReady(false);
    }
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isSocketReady }}>
      {children}
    </SocketContext.Provider>
  );
};