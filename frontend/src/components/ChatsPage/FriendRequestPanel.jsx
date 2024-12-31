import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRefresh, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getFriends, getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../api/user.api.js';
import DefaultPicIcon from "../../assets/default-profile-pic.jpg";

const FriendRequestPanel = ({ isOpen, onClose, onFriendSelect }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");

  const fetchFriendRequests = async () => {
    try {
      setIsLoading(true);
      const { success, data } = await getFriendRequests();

      if (success) {
        setFriendRequests(data);
      }

    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const { success, data } = await getFriends();
      if (success) {
        setFriends(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "requests") {
      fetchFriendRequests();
    } else {
      fetchFriends();
    }
  }, [activeTab]);

  const refetch = () => {
    if (activeTab === "requests") {
      fetchFriendRequests();
    } else {
      fetchFriends();
    }
  };

  const handleAcceptRequest = async (senderId) => {
    try {
      const { success } = await acceptFriendRequest(senderId);
      if (success) {
        setFriendRequests(friendRequests.filter((request) => request._id !== senderId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectRequest = async (senderId) => {
    try {
      const { success } = await rejectFriendRequest(senderId);
      if (success) {
        setFriendRequests(friendRequests.filter((request) => request._id !== senderId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-gray-800 shadow-lg 
        transition-transform duration-300 ease-in-out 
        transform ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-2xl font-bold text-white">Friend Menu</p>
        <div className="flex items-center space-x-5">
          <button onClick={refetch}>
            <FontAwesomeIcon icon={faRefresh} className="text-white h-5 cursor-pointer" />
          </button>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="text-white h-6 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="flex space-x-4 border-b-2 border-gray-700">
        <button
          onClick={() => setActiveTab("requests")}
          className={`text-white w-1/2 px-3 py-2 
            ${activeTab === "requests" ? "bg-blue-600" : ""}`}
        >
          Friend Requests
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`text-white w-1/2   px-3 py-2 
            ${activeTab === "friends" ? "bg-blue-600" : ""}`}
        >
          Friends
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        {isLoading && <p className="text-white p-4">Loading...</p>}
        {error && <p className="text-red-500 p-4">{error.message}</p>}

        {activeTab === "requests" ? (
          <>
            {friendRequests.length === 0 && !isLoading ? (
              <p className="text-white p-4">No friend requests</p>
            ) : (
              friendRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-full">
                    <img
                      src={request.user_profilePic || DefaultPicIcon}
                      alt={request.user_name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="font-medium text-white">{request.user_name}</div>
                    <div className="text-sm text-gray-400">{request.user_email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600"
                    >
                      <FontAwesomeIcon icon={faCheck} className="text-white cursor-pointer h-4" />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-white cursor-pointer h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            {friends.length === 0 && !isLoading ? (
              <p className="text-white p-4">No friends added yet</p>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend._id}
                  onClick={() => {
                    onFriendSelect(friend);
                    console.log(friend);
                  }}
                  className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-full">
                    <img
                      src={friend.user_profilePic || DefaultPicIcon}
                      alt={friend.user_name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="font-medium text-white">{friend.user_name}</div>
                    <div className="text-sm text-gray-400">{friend.user_email}</div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FriendRequestPanel;
