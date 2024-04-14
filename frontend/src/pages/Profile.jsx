import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { validateEmail, validateName } from '../utils/validators';
import { setCredentials } from '../store/slices/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [myOrders, setMyOrders] = useState([]);
  const {
    value: name,
    handleChange: handleNameChange,
    handleBlur: handleNameBlur,
    error: nameError,
    inValid: nameIsInValid,
  } = useInput(userInfo.name || '', validateName);
  const {
    value: email,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
    error: emailError,
    inValid: emailIsInValid,
  } = useInput(userInfo.email || '', validateEmail);
  const formIsInValid = nameError || emailError;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const fetchMyOrders = async () => {
      const { data } = await axios.get('/api/orders/myOrders');
      setMyOrders(data.orders);
      setOrdersLoading(false);
    };
    setOrdersLoading(true);
    fetchMyOrders().catch((error) => {
      setError(error.message);
      setOrdersLoading(false);
    });
  }, []);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put('/api/users/profile', {
        name,
        email,
      });
      dispatch(setCredentials(data.user));
      toast.success('Profile Updated Successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  return (
    <Row>
      <Col md={3}>
        <h2 className='mb-3 text-center'>User Profile</h2>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
            />
            {nameIsInValid && <p className='text-danger'>{nameError}</p>}
          </Form.Group>
          <Form.Group controlId='email' className='my-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email address'
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
            {emailIsInValid && <p className='text-danger'>{emailError}</p>}
          </Form.Group>
          <Button variant='dark' type='submit' disabled={formIsInValid || loading}>
            Update
          </Button>
          {loading && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2 className='mb-3 text-center'>My Orders</h2>
        {ordersLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='dark'>{error}</Message>
        ) : (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      new Date(order.paidAt).toDateString()
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      new Date(order.deliveredAt).toDateString()
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='dark'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
