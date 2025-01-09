import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getMessages, deleteMessage } from '../../api/chat.api.js';
import DefaultPicIcon from "../../assets/default-profile-pic.jpg";
import ConfirmDialog from "../common/ConfirmDialog.jsx";

const ChatWindow = ({ selectedChat, socket, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [isOnline, setIsOnline] = useState(false);

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

      // // Update user status to online when connected
      // socket.on('userOnline', (userId) => {
      //   if (selectedChat._id === userId) {
      //     setIsOnline(true);
      //   }
      // });

      // // Update user status to offline when disconnected
      // socket.on('userOffline', (userId) => {
      //   if (selectedChat._id === userId) {
      //     setIsOnline(false);
      //   }
      // });

      // Clean up the listener when the component unmounts or selectedChat changes
      return () => {
        socket.off('receiveMessage');
        // socket.off('userOnline');
        // socket.off('userOffline');
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
    // handleSelectMessage(msgId);
    setMenuOpen(false);
  };

  const handleCancelSelect = () => {
    setSelectedMessages([]); // Clear selected messages
    setIsSelecting(!isSelecting);
  };

  const handleMessageMenuClick = (msg, index) => {
    if (isSelecting) return; // Disable menu in select mode
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
      setIsDialogOpen(false);
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
            {/* <div className="text-sm text-gray-400">
              {isOnline ? "Online" : "Offline"}
            </div> */}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-4 bg-gray-900 p-3 border-b border-gray-700">
          <div className="text-white">{selectedMessages.length} selected</div>
          <button
            className="text-white bg-blue-700 px-4 py-1 rounded"
            onClick={() => setIsDialogOpen(true)}
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

      <div id="chatContainer" className="flex-grow py-3 space-y-4 overflow-y-auto relative"
        onClick={menuOpen ? () => setMenuOpen(false) : null} // Close menu on outside click
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            id={`message-${index}`} // Unique ID for each message
            className={`flex px-3 ${msg.senderId === user._id ? "justify-end" : "justify-start"}
            ${selectedMessages.includes(msg._id) ? "bg-gray-400" : ""}
            `}
          >
            <div>
              <div
                className={`flex justify-between space-x-4 max-w-xs px-3 py-2 rounded-lg relative
                  ${msg.senderId === user._id ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}
                  ${isSelecting ? "cursor-pointer" : "cursor-default"} 
              `} // Highlight selected message
                onClick={() => handleSelectMessage(msg._id)} // Toggle selection
                onContextMenu={(e) => {
                  e.preventDefault(); // Prevent default right-click menu
                  handleMessageMenuClick(msg, index); // Show message menu
                }
                }
              >
                <div>{msg.text}</div>
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
            className="absolute flex flex-col bg-gray-800 rounded-lg"
            style={{
              top: document.getElementById(`message-${activeMessage}`).offsetTop + 20,
              right: document.getElementById(`message-${activeMessage}`).offsetLeft + 20
            }}
          >
            <button
              className="text-white border-b px-4 py-1 hover:bg-gray-700 hover:rounded-t-lg"
              onClick={() => {
                handleSelectButtonClick(messages[activeMessage]._id);
                setSelectedMessages([...selectedMessages, messages[activeMessage]._id]);
              }}
            >
              Select
            </button>
            <button
              className="text-white px-4 py-1 hover:bg-gray-700 hover:rounded-lg"
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

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Delete Messages?"
        message="This has no effect on your recipient's chats."
        confirmBtnStyle={"bg-red-600 hover:bg-red-700"}
        onConfirm={() => handleDeleteMessages(selectedMessages)}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div >
  );
};

export default ChatWindow;
