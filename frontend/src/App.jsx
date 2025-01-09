import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthContextProvider from './context/AuthContextProvider';
import { SocketProvider } from './context/SocketContext';

const App = () => {
  return (
    <AuthContextProvider>
      <Toaster />
      <SocketProvider>
        <Outlet />
      </SocketProvider>
    </AuthContextProvider>
  );
};

export default App;