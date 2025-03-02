import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SpotifyCallback from './pages/SpotifyCallback.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Chat from './pages/Chat/Chat.jsx';
import MakePlaylist from './pages/MakePlaylist/MakePlaylist';
import SinglePlaylist from './pages/SinglePlaylist';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import Signup from './pages/Signup/Signup.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/makeplaylist',
        element: <ProtectedRoute element={<MakePlaylist />} />,
      },
      {
        path: '/playlist/:id',
        element: <ProtectedRoute element={<SinglePlaylist />} />,
      },
      {
        path: '/chat',
        element: <ProtectedRoute element={<Chat />} />,
      },
      {
        path: '/Signup',
        element: <Signup />,
      },
      {
        path: '/spotify-callback',
        element: <SpotifyCallback />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
