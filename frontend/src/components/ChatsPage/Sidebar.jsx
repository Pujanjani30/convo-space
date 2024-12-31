import React, { useState, useContext } from "react";
import { faSquarePlus, faGear, faRightFromBracket, faUserPlus, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthContext";
import FriendRequestModal from "./FriendRequestModel";
import FriendRequestPanel from "./FriendRequestPanel";
import DefaultPicIcon from "../../assets/default-profile-pic.jpg";

const Sidebar = ({ chats, onChatSelect }) => {
  const { logout } = useContext(AuthContext);
  const [modelOpen, setModelOpen] = useState(false);
  const [FriendRequestPanelOpen, setFriendRequestPanelOpen] = useState(false);

  const handleFriendSelect = (friend) => {
    console.log(friend);
    onChatSelect(friend);
  }

  return (
    <div className="w-1/4 bg-gray-800 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-gray-300">
        <p className="text-2xl font-bold">Chats</p>
        <button onClick={() => setModelOpen(true)}>
          <FontAwesomeIcon icon={faUserPlus} className="text-white ml-2 cursor-pointer h-5" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {chats.map((chat, index) => (
          <div
            key={index}
            onClick={() => onChatSelect(chat)}  // Pass the chat ID to parent
            className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700"
          >
            <div className="w-10 h-10 bg-gray-700 rounded-full">
              <img src={chat.otherUserProfilePic || DefaultPicIcon}
                alt={chat.otherUser}
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div className="ml-3 flex-grow flex justify-between items-center">
              <div className="">
                <span className="font-bold">{chat.otherUser}</span>
                <div className="text-sm text-gray-400 truncate">
                  <pre className="wrap">{chat?.lastMessage || ''}</pre>
                </div>
              </div>
              <div className="text-sm text-gray-400">{new Date(chat?.lastTimestamp).toLocaleTimeString() || ''}</div>
            </div>
            {/* <div>
              {chat.unseenMessages > 0 && (
                <span className="ml-2 text-xs text-red-500 bg-gray-700 px-2 py-1 rounded-full">
                  {chat.unseenMessages}
                </span>
              )}
            </div> */}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-around border-t border-gray-700 px-4 py-3">
        <button onClick={() => setFriendRequestPanelOpen(true)}>
          <FontAwesomeIcon icon={faUserGroup} className="text-white h-5" />
        </button>
        <button>
          <FontAwesomeIcon icon={faGear} className="text-white h-5" />
        </button>
        <button onClick={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} className="text-white h-5 ml-4" />
        </button>
      </div>

      {
        modelOpen && (
          <FriendRequestModal
            isOpen={modelOpen}
            onClose={() => setModelOpen(false)}
          />
        )
      }

      {
        FriendRequestPanelOpen && (
          <FriendRequestPanel
            isOpen={FriendRequestPanelOpen}
            onClose={() => setFriendRequestPanelOpen(false)}
            onFriendSelect={handleFriendSelect}
          />
        )
      }
    </div >


  );
};

export default Sidebar;

