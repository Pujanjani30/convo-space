import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { getMessages, deleteMessage } from '../../api/chat.api.js';
import DefaultPicIcon from "../../assets/default-profile-pic.jpg";

const ChatWindow = ({ selectedChat, socket, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Effect to fetch messages for the selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const { success, data } = await getMessages(user._id, selectedChat._id);
          success ? setMessages(data) : console.log("Failed to get messages");
        } catch (error) {

        }
      }
    }

    fetchMessages();
  }, [selectedChat]);

  // Effect to handle incoming messages for the selected chat
  useEffect(() => {
    // Listen for incoming messages only if a chat is selected
    if (selectedChat) {
      socket.on('receiveMessage', (newMessage) => {
        if (newMessage?.senderId === selectedChat._id || newMessage?.recipientId === selectedChat._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      // Clean up the listener when the component unmounts or selectedChat changes
      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [selectedChat, socket]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        senderId: user._id,
        recipientId: selectedChat._id,
        timestamp: new Date()
      };
      socket?.emit("sendMessage", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const handleSelectButtonClick = (msgId) => {
    setIsSelecting(!isSelecting); // Toggle select mode
    handleSelectMessage(msgId);
    setMenuOpen(false);
  };

  const handleCancelSelect = () => {
    setSelectedMessages([]); // Clear selected messages
    setIsSelecting(!isSelecting);
  };

  const handleMessageMenuClick = (msg, index) => {
    setActiveMessage(index); // Set the active message index
    setMenuOpen(!menuOpen); // Toggle menu visibility
  };

  const handleSelectMessage = (msgId) => {
    if (isSelecting) {
      setSelectedMessages([...selectedMessages, msgId]);
    }
  };

  const handleDeleteMessages = async (messages) => {
    try {
      await deleteMessage(messages);
      setMessages((prevMessages) => prevMessages.filter((msg) => !messages.includes(msg._id)));
      setSelectedMessages([]);
      setIsSelecting(!isSelecting);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex-grow bg-black flex flex-col">
      {selectedMessages.length == 0 ? (
        <div className="flex items-center space-x-4 bg-gray-900 p-2 border-b border-gray-700">
          <div className="w-10 h-10 bg-gray-700 rounded-full">
            <img
              src={selectedChat?.otherUserProfilePic || selectedChat?.user_profilePic || DefaultPicIcon}
              alt={selectedChat?.otherUser || selectedChat?.user_name}
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>
          <div>
            <div className="font-bold">{selectedChat?.otherUser || selectedChat?.user_name}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-4 bg-gray-900 p-2 border-b border-gray-700">
          <div className="text-white">{selectedMessages.length} selected</div>
          <button
            className="text-white bg-blue-700 px-4 py-1 rounded"
            onClick={() => handleDeleteMessages(selectedMessages)}
          >
            Delete
          </button>
          <button
            className="text-white bg-gray-500 px-4 py-1 rounded"
            onClick={handleCancelSelect}
          >
            Cancel
          </button>
        </div>

      )}

      <div id="chatContainer" className="flex-grow p-3 space-y-4 overflow-y-auto relative">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === user._id ? "justify-end" : "justify-start"}
            ${selectedMessages.includes(msg._id) ? "bg-gray-400" : ""}
            `}
          >
            <div>
              <div
                className={`flex justify-between space-x-4 max-w-xs px-3 py-2 rounded-lg 
                  ${msg.senderId === user._id ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}
                  ${isSelecting ? "cursor-pointer" : "cursor-default"} 
              `} // Highlight selected message
                onClick={() => handleSelectMessage(msg._id)} // Toggle selection
              >
                <div>{msg.text}</div>
                <div
                  className={`${msg.senderId === user._id ? "" : "hidden"}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering message selection
                    handleMessageMenuClick(msg, index);
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
              </div>
              <div className={`text-xs opacity-75 ${msg.senderId === user._id ? "text-right" : "text-left"}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Show menu only for the active message */}
        {menuOpen && (
          <div
            className="absolute flex flex-col top-16 right-16 bg-gray-800 px-3 py-1 rounded-lg"
            style={{
              top: `${activeMessage * 50 + 30}px`, // Position menu near the selected message
              right: '0px'
            }}
          >
            <button
              className="text-white"
              onClick={() => handleSelectButtonClick(messages[activeMessage]._id)}
            >
              Select
            </button>
            <button
              className="text-white"
              onClick={() => {
                handleDeleteMessages([messages[activeMessage]._id]);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center px-4 py-3 bg-gray-900 border-t border-gray-700">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="ml-3 px-4 py-2 bg-blue-600 rounded text-white"
          onClick={handleSendMessage}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div >
  );
};

export default ChatWindow;
