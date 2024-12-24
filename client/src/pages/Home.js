import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../componets/Sidebar';
import logo from '../assets/logo.png';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios.get(URL, { withCredentials: true });
      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
    } catch (error) {
      toast.error('Failed to fetch user details. Please try again.'); 
      navigate('/email');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
        auth: { token },
      });

      socketConnection.on('onlineUser', (data) => {
        dispatch(setOnlineUser(data));
      });

      dispatch(setSocketConnection(socketConnection));

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [dispatch]);

  const isBasePath = location.pathname === '/';

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      {/* Sidebar */}
      <section className={`bg-white ${!isBasePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>

      {/* Message Component */}
      <section className={`${isBasePath && 'hidden'}`}>
        <Outlet />
      </section>

      {/* Default Prompt */}
      {isBasePath && (
        <div className="justify-center items-center flex-col gap-2 lg:flex hidden">
          <div>
            <img src={logo} width={250} alt="logo" />
          </div>
          <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
        </div>
      )}
    </div>
  );
};

export default Home;
