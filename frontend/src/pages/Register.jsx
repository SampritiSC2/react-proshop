import React, { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validators';

const RegisterPage = () => {
  const {
    value: name,
    error: nameError,
    handleBlur: handleNameBlur,
    handleChange: handleNameChange,
    inValid: nameIsInvalid,
  } = useInput('', validateName);

  const {
    value: email,
    error: emailError,
    handleBlur: handleEmailBlur,
    handleChange: handleEmailChange,
    inValid: emailIsInvalid,
  } = useInput('', validateEmail);

  const {
    value: password,
    error: passwordError,
    handleBlur: handlePasswordBlur,
    handleChange: handlePasswordChange,
    inValid: passwordIsInvalid,
  } = useInput('', validatePassword);

  const {
    value: confirmPassword,
    error: confirmPasswordError,
    handleBlur: handleConfirmPasswordBlur,
    handleChange: handleConfirmPasswordChange,
    inValid: confirmPasswordIsInvalid,
  } = useInput('', (value) => validateConfirmPassword(value, password));

  const formIsInvalid = emailError || passwordError || nameError || confirmPasswordError;

  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSumbitting] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const searchParams = new URLSearchParams(search);
  const redirect =
    searchParams.get('redirect') === '/shipping' ? searchParams.get('redirect') : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formIsInvalid) return;
    try {
      setSumbitting(true);
      const { data } = await axios.post('/api/users', {
        name,
        email,
        password,
      });

      dispatch(setCredentials({ ...data.user }));
    } catch (error) {
      toast(error?.response?.data?.message || error.message, {
        position: 'top-center',
        theme: 'light',
        type: 'error',
        autoClose: 2000,
      });
    }
    setSumbitting(false);
  };

  return (
    <FormContainer>
      <Card className='p-3 shadow-sm border-0'>
        <Card.Body>
          <h1 className='text-center'>Register</h1>
          {submitting && <Loader />}
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
              {nameIsInvalid && <p className='mt-1 text-danger'>{nameError}</p>}
            </Form.Group>
            <Form.Group controlId='email' className='my-2'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
              {emailIsInvalid && <p className='mt-1 text-danger'>{emailError}</p>}
            </Form.Group>
            <Form.Group controlId='password' className='my-2'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
              />
              {passwordIsInvalid && <p className='mt-1 text-danger'>{passwordError}</p>}
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='my-2'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
              />
              {confirmPasswordIsInvalid && (
                <p className='mt-1 text-danger'>{confirmPasswordError}</p>
              )}
            </Form.Group>
            <Button type='submit' variant='dark' disabled={formIsInvalid || submitting}>
              Register
            </Button>
          </Form>
          <Row className='mt-2'>
            <Col>
              Already registered ?
              <Link
                to={
                  redirect && redirect !== '/'
                    ? { pathname: '/login', search: `/login?redirect=${redirect}` }
                    : '/login'
                }
              >
                <strong> Login</strong>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </FormContainer>
  );
};

export default RegisterPage;
