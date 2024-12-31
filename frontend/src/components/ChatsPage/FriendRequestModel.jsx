import React, { useState, useEffect } from 'react';
import { searchUserByEmail, sendFriendRequest } from '../../api/user.api.js';
import { showSuccessToast, showErrorToast } from '../../utils/toast.js';

const FriendRequestModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Debounced API Call
  const fetchSearchResults = async (inputEmail) => {
    try {
      setIsSearching(true);
      const { data } = await searchUserByEmail(inputEmail);
      setSearchResult(data || []);
      setError('');
    } catch (err) {
      setError('Failed to search for users. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setError('');
    setSearchResult([]);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (inputEmail) {
      const timeOut = setTimeout(() => {
        fetchSearchResults(inputEmail);
      }, 500); // Debounce delay
      setTypingTimeout(timeOut);
    }
  };

  const handleSendRequest = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setIsLoading(true);

      const { statusCode, message } = await sendFriendRequest(email);

      if (statusCode === 400) {
        setError(message);
      }

      if (statusCode === 200) {
        showSuccessToast(message);
      }
      setEmail('');
      setSearchResult([]);
    } catch (err) {
      setError('Failed to send friend request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup debounce timeout on unmount
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-xl font-semibold mb-4">Send Friend Request</h2>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
          aria-label="Friend's Email"
        />
        <div>
          <ul>
            {isSearching ? (
              <li className="p-2">Searching...</li>
            ) : searchResult.length === 0 && email ? (
              <li className="p-2">No users found</li>
            ) : (
              searchResult.map((user) => (
                <li
                  key={user._id}
                  onClick={() => setEmail(user.user_email)}
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-md mb-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.user_profilePic}
                        alt={user.user_name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="flex flex-col">
                        <span>{user.user_name}</span>
                        <span>{user.user_email}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          >
            Close
          </button>
          <button
            onClick={handleSendRequest}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestModal;
