import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    user ? setUserId(user._id) : setUserId(null);
  }, [user]);

  useEffect(() => {
    if (userId) {

      const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
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
