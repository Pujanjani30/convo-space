import React, { useState, useEffect, useContext } from "react";
import { useSocket } from "../../context/SocketContext";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import AuthContext from "../../context/AuthContext.js";
import { getChats } from "../../api/chat.api.js";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useContext(AuthContext);
  const { socket, isSocketReady } = useSocket();

  useEffect(() => {
    if (!isSocketReady || !socket) return; // Wait until socket is ready

    getChats()
      .then((res) => {
        if (res.success) {
          setChats(res.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });


    socket.on("updateSidebar", (data) => {
      setChats(data);
    });

    return () => {
      socket.off("updateSidebar");
    };
  }, [socket, isSocketReady]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar chats={chats} onChatSelect={handleChatSelect} />
      {selectedChat ? (
        <ChatWindow selectedChat={selectedChat} socket={socket} user={user} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}

export default ChatPage;