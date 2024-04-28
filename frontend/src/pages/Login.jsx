import React, { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { validateEmail, validatePassword } from "../utils/validators";

const LoginPage = () => {
  const {
    value: email,
    error: emailError,
    handleBlur: handleEmailBlur,
    handleChange: handleEmailChange,
    inValid: emailIsInvalid,
  } = useInput("", validateEmail);

  const {
    value: password,
    error: passwordError,
    handleBlur: handlePasswordBlur,
    handleChange: handlePasswordChange,
    inValid: passwordIsInvalid,
  } = useInput("", validatePassword);
  const formIsInvalid = emailError || passwordError;

  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSumbitting] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const searchParams = new URLSearchParams(search);
  const redirect =
    searchParams.get("redirect") === "/shipping"
      ? searchParams.get("redirect")
      : "/";

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
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      dispatch(setCredentials({ ...data }));
    } catch (error) {
      toast(error?.response?.data?.message || error.message, {
        position: "top-center",
        theme: "light",
        type: "error",
        autoClose: 2000,
      });
    }
    setSumbitting(false);
  };

  return (
    <FormContainer>
      <Card className="p-3 shadow-sm border-0">
        <Card.Body>
          <h1 className="text-center">Sign In</h1>
          {submitting && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
              {emailIsInvalid && (
                <p className="mt-1 text-danger">{emailError}</p>
              )}
            </Form.Group>
            <Form.Group controlId="password" className="my-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
              />
              {passwordIsInvalid && (
                <p className="mt-1 text-danger">{passwordError}</p>
              )}
            </Form.Group>
            <Button
              type="submit"
              variant="dark"
              disabled={formIsInvalid || submitting}
            >
              Sign In
            </Button>
          </Form>
          <Row className="mt-2">
            <Col>
              New Customer ?{" "}
              <Link
                to={
                  redirect && redirect !== "/"
                    ? { pathname: "/register", search: `?redirect=${redirect}` }
                    : "/register"
                }
              >
                <strong>Register</strong>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </FormContainer>
  );
};

export default LoginPage;
