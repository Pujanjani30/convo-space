import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { showSuccessToast, showErrorToast } from '../utils/toast.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faPencil, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import DefaultProfilePic from '../assets/default-profile-pic.jpg';
import ChatIcon from '../assets/chat_icon.png'
import { getUserProfile, updateUserProfile } from '../api/user.api.js';
import { useNavigate } from 'react-router-dom';

// Profile Component
const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState('');

  const navigate = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object({
    userProfile: Yup.object({
      user_name: Yup.string().required('Name is required'),
      user_about: Yup.string(),
    }),
  });

  // Fetch user profile when component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { userData } = await getUserProfile();
        setUserProfile(userData);

        // Set profile picture preview if user has profile picture
        if (userData.user_profilePic) {
          setProfilePicPreview(userData.user_profilePic);
        }
      } catch (error) {
        showErrorToast(error.message);
      }
    };
    fetchUserProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate({ userProfile }, { abortEarly: false });

      setLoading(true);

      const formData = new FormData();
      formData.append('user_name', userProfile.user_name);
      formData.append('user_about', userProfile.user_about);

      if (userProfile.user_profilePic) {
        formData.append('user_profilePic', userProfile.user_profilePic);
      }

      await updateUserProfile(formData);

      setLoading(false);
      showSuccessToast('Profile updated successfully!');

      navigate('/chats');
    } catch (error) {
      setLoading(false);
      showErrorToast(error.message);
    }
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserProfile((prev) => ({ ...prev, user_profilePic: file })); // Set the selected file
      setProfilePicPreview(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full bg-black flex flex-col justify-center items-center p-10 relative ">
        <div className="flex items-center mb-10 absolute top-0 left-0 p-4">
          <div className="w-9 h-9 mr-2">
            <img src={ChatIcon} alt="Chat Icon" />
          </div>
          <h1 className="text-white text-xl font-semibold">ConvoSpace</h1>
        </div>
        <h2 className="text-white text-3xl font-semibold mb-8">Profile</h2>

        <form className="w-full max-w-sm" onSubmit={handleProfileUpdate}>
          {/* Profile Picture */}
          <div className="mb-4 flex flex-col items-center">
            {/* Profile Picture Preview */}
            <div className="relative">
              <img
                src={profilePicPreview || DefaultProfilePic}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover"
              />
              <div
                className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-full cursor-pointer"
                onClick={() => document.getElementById('profilePicInput').click()} // Trigger file input click
              >
                <FontAwesomeIcon icon={faPencil} className='cursor-pointer' />
              </div>
            </div>

            {/* Hidden File Input for Profile Picture */}
            <input
              type="file"
              id="profilePicInput"
              className="hidden"
              onChange={handleProfilePicChange} // Handle file input change
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <div className="flex mb-2">
              <label htmlFor="name" className="block text-gray-400 font-medium">
                Name
              </label>
              <span className='text-red-600 ms-1'>*</span>
            </div>
            <input
              type="text"
              id="name"
              value={userProfile.user_name || ''}
              onChange={(e) => setUserProfile({ ...userProfile, user_name: e.target.value })}
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <div className='flex justify-between mb-2'>
              <label htmlFor="email" className="block text-gray-400 font-medium mb-2">
                Email
              </label>
              <div>
                <span className='text-gray-300 text-sm'>Change email
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='ms-2 hover:text-blue-600 cursor-pointer' />
                </span>
              </div>
            </div>
            <input
              type="text"
              id="email"
              value={userProfile.user_email || ''}
              disabled
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-gray-800 text-gray-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* About */}
          <div className="mb-4">
            <label htmlFor="about" className="block text-gray-400 font-medium mb-2">
              About
            </label>
            <textarea
              id="about"
              value={userProfile.user_about || ''}
              onChange={(e) => setUserProfile({ ...userProfile, user_about: e.target.value })}
              placeholder="Tell us something about yourself"
              rows="4"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            {...(loading && { disabled: true })}
            className="w-full bg-blue-600 text-black font-medium py-2 rounded-lg
             hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' :
              <>
                Continue
                <FontAwesomeIcon icon={faArrowRight} className='ms-2' />
              </>
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
