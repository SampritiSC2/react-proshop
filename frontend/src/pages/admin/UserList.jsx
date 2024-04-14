import axios from 'axios';
import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { json, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';

const UserListPage = () => {
  const usersData = useLoaderData();
  const [users, setUsers] = useState(usersData.users);
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete ?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };
  return (
    <>
      <h1>Users</h1>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <FaCheck style={{ color: 'green' }} />
                ) : (
                  <FaTimes style={{ color: 'red' }} />
                )}
              </td>
              <td>
                <LinkContainer to={`/admin/edit-user/${user._id}`}>
                  <Button className='btn-sm' variant='light'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
                <Button
                  className='ms-2 btn-sm'
                  variant='danger'
                  onClick={() => handleDeleteUser(user._id)}>
                  <FaTrash style={{ color: 'white' }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate
        page={usersData?.page || 1}
        pages={usersData?.pages}
        isAdmin={true}
        pageName='user-list'
      />
    </>
  );
};

export const loader = async ({ params }) => {
  try {
    const { pageNumber } = params;
    const { data } = await axios.get(`/api/users?pageNumber=${pageNumber || 1}`);
    return data;
  } catch (error) {
    throw json(
      {
        title: 'An Error Occured',
        description: error?.response?.data?.message || error.message,
      },
      { status: 500 }
    );
  }
};

export default UserListPage;
