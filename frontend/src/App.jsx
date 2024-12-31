import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthContextProvider from './context/AuthContextProvider';
import { SocketProvider } from './context/SocketContext';
import Cookies from 'js-cookie';

const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      setUser(JSON.parse(userData));
      // setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContextProvider>
      <Toaster />
      {/* {isLoggedIn ? ( */}
      <SocketProvider userId={user?._id}>
        <Outlet />
      </SocketProvider>
      {/* ) : (
        <Outlet />
      )} */}
    </AuthContextProvider>
  );
};

export default App;