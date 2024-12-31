import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
  createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate
} from 'react-router-dom';
import {
  Login, Profile, ChatsPage
} from './components/index.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import Cookies from 'js-cookie';

const resolveUserRedirect = () => {
  let user = Cookies.get('user');
  if (!user) {
    return '/login';
  }

  user = JSON.parse(user);
  return user.user_isNew ? '/profile' : '/chats';
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={
        <Navigate to={resolveUserRedirect()} replace />
      } />
      <Route path='/login' element={<Login />} />

      <Route path='/profile' element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path='/chats' element={
        <ProtectedRoute>
          <ChatsPage />
        </ProtectedRoute>
      } />
    </Route>
  ),
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>,
)
