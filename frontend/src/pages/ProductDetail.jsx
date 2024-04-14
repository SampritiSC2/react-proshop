import React, { useState } from 'react';
import { Link, json, useLoaderData } from 'react-router-dom';
import { Button, Card, Col, FormControl, Form, Image, ListGroup, Row } from 'react-bootstrap';
import Rating from '../components/Rating';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import Message from '../components/Message';
import useInput from '../hooks/useInput';
import { validateComment, validateRating } from '../utils/validators';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const {
    value: rating,
    handleChange: ratingChangeHandler,
    handleBlur: ratingBlurHandler,
    error: ratingError,
    inValid: ratingIsInvalid,
    reset: resetRating,
  } = useInput('', validateRating);
  const {
    value: comment,
    handleChange: commentChangeHandler,
    handleBlur: commentBlurHandler,
    error: commentError,
    inValid: commentIsInvalid,
    reset: resetComment,
  } = useInput('', validateComment);
  const [submittingReview, setSubmittingReview] = useState(false);

  const product = useLoaderData();
  const [reviews, setReviews] = useState(product.reviews);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        qty,
      })
    );
  };

  const formIsInvalid = ratingError || commentError;

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (formIsInvalid || !userInfo) {
      return;
    }
    const reviewData = {
      user: userInfo._id,
      name: userInfo.name,
      rating,
      comment,
    };

    setSubmittingReview(true);
    try {
      const { data } = await axios.post(`/api/products/${product._id}/reviews`, reviewData);
      const { review } = data;
      toast.success('Review submitted successfully');
      setReviews((prevReviews) => [...prevReviews, review]);
      resetRating('');
      resetComment('');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setSubmittingReview(false);
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>{product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <FormControl
                        as='select'
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((qty) => (
                          <option key={qty + 1}>{qty + 1}</option>
                        ))}
                      </FormControl>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  className='btn-block btn-dark'
                  type='button'
                  disabled={product.countInStock === 0}
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className='review'>
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant='flush'>
            {reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{new Date(review.createdAt).toDateString()}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {submittingReview && <Loader />}
              {userInfo ? (
                <Form onSubmit={handleAddReview}>
                  <Form.Group controlId='rating' className='my-2'>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as='select'
                      value={rating}
                      onChange={ratingChangeHandler}
                      onBlur={ratingBlurHandler}
                    >
                      <option value='' disabled>
                        Select Rating
                      </option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </Form.Control>
                    {ratingIsInvalid && <p className='text-danger'> {ratingError} </p>}
                  </Form.Group>
                  <Form.Group controlId='comment' className='my-2'>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as='textarea'
                      row={3}
                      value={comment}
                      onChange={commentChangeHandler}
                      onBlur={commentBlurHandler}
                    />
                    {commentIsInvalid && <p className='text-danger'>{commentError}</p>}
                  </Form.Group>
                  <Button
                    disabled={submittingReview || formIsInvalid}
                    type='submit'
                    variant='dark'
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to='/login'>Sign In</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export const loader = async ({ params }) => {
  try {
    const { id: productId } = params;
    const { data } = await axios.get(`/api/products/${productId}`);
    return data.product;
  } catch (error) {
    throw json(
      {
        title: 'Invalid Product',
        description: 'Product cannot be found',
      },
      {
        status: 500,
      }
    );
  }
};

export default ProductDetailPage;
