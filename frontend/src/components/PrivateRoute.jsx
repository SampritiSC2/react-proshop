import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const auth = useSelector((state) => state.auth);
  const { userInfo } = auth;
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
