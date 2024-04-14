import axios from 'axios';
import React from 'react';
import { Outlet, redirect } from 'react-router-dom';

const AdminRoute = () => {
  return <Outlet />;
};

export const loader = async () => {
  try {
    const { data } = await axios.get('/api/users/profile');
    const { user } = data;
    if (!user.isAdmin) {
      return redirect('/');
    }
    return user;
  } catch (error) {
    if (error?.response?.status === 401) {
      return redirect('/login');
    }
    return redirect('/');
  }
};

export default AdminRoute;
