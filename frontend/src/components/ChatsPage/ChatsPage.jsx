import React, { useState, useEffect, useContext } from "react";
import { useSocket } from "../../context/SocketContext";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import AuthContext from "../../context/AuthContext.js";
import { getChats } from "../../api/chat.api.js";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const { socket, isSocketReady } = useSocket();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSocketReady || !socket) return; // Wait until socket is ready

    setIsLoading(true);

    getChats()
      .then((res) => {
        if (res.success) {
          setChats(res.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setChats([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Listen for updates to the sidebar
    socket.on("updateSidebar", (data) => {
      setChats(data);
    });

    // // update user's last seen
    // socket.on("updateLastSeen", ({ userId, lastSeen }) => {
    //   if (user._id === userId) {
    //     setUser((prevUser) => ({ ...prevUser, user_lastSeen: lastSeen }));
    //   }
    // });

    // update user's status to online when connected
    socket.on("userOnline", (userId) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === userId) {
            return { ...chat, isOnline: true };
          }
          return chat;
        });
      });
    });

    // update user's status to offline when disconnected
    socket.on("userOffline", (userId) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === userId) {
            return { ...chat, isOnline: false };
          }
          return chat;
        });
      });
    });

    return () => {
      if (socket) {
        socket.off("updateSidebar");
        // socket.off("updateLastSeen");
        socket.off("userOnline");
        socket.off("userOffline");
      }
    };

  }, [socket, isSocketReady]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {isSocketReady && isLoading ? (
        <div className="flex items-center justify-center text-gray-400 h-full">
          Loading...
        </div>
      ) : (
        <>
          <Sidebar chats={chats} onChatSelect={handleChatSelect} />
          {selectedChat ? (
            <ChatWindow selectedChat={selectedChat} socket={socket} user={user} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat to start messaging
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ChatPage;