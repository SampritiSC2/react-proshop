import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Link, json, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useInput from '../../hooks/useInput';
import axios from 'axios';
import { validateEmail, validateName } from '../../utils/validators';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';

const UserEditPage = () => {
  const user = useLoaderData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    value: name,
    handleChange: handleNameChange,
    handleBlur: handleNameBlur,
    error: nameError,
    inValid: nameIsInvalid,
  } = useInput(user.name, validateName);
  const {
    value: email,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
    error: emailError,
    inValid: emailIsInValid,
  } = useInput(user.email, validateEmail);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const navigate = useNavigate();

  const formIsInvalid = nameError || emailError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formIsInvalid || loading) {
      return;
    }
    try {
      setLoading(true);
      await axios.put(`/api/users/${user._id}`, {
        name,
        email,
        isAdmin,
      });
      toast.success('User updated successfully');
      navigate('/admin/user-list');
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Link to='/admin/user-list' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h2 className='text-center'>Edit User</h2>
        <Card className='shadow-sm p-3 border-0'>
          <Card.Body>
            {loading && <Loader />}
            {error && <Message variant='danger'>{error}</Message>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='name' className='mb-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  placeholder='Enter Name'
                />
                {nameIsInvalid && <p className='text-danger'>{nameError}</p>}
              </Form.Group>
              <Form.Group controlId='email' className='mb-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='text'
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder='Enter email'
                />
                {emailIsInValid && <p className='text-danger'>{emailError}</p>}
              </Form.Group>
              <Form.Group controlId='isAdmin' className='mb-2'>
                <Form.Check
                  type='checkbox'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  label='Is Admin'
                />
              </Form.Group>
              <Button
                type='submit'
                className='mt-2'
                variant='dark'
                disabled={formIsInvalid || loading}
              >
                Update User
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </FormContainer>
    </>
  );
};

export const loader = async ({ params }) => {
  const { id: userId } = params;
  try {
    const { data } = await axios.get(`/api/users/${userId}`);
    const { user } = data;
    return user;
  } catch (error) {
    throw json(
      {
        title: 'User not found',
        message: 'The user was not found',
      },
      {
        status: 500,
      }
    );
  }
};

export default UserEditPage;
