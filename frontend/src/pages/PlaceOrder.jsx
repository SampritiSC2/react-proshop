import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, ListGroup, Image, Card, Row } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from 'axios';
import { clearCartItems } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import PriceSummary from '../components/PriceSummary';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, shippingAddress, paymentMethod]);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
      dispatch(clearCartItems());
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      setError(error);
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Row className='justify-content-md-center'>
        <Col md={6}>
          <CheckoutSteps activeStep={3} />
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className='mb-2'>
              <h3 className='mb-2'>Shipping</h3>
              <p>
                <strong className='me-2'>Address:</strong>
                {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
              </p>
            </ListGroup.Item>
            <ListGroup.Item className='mb-2'>
              <h3 className='mb-2'>Payment Method</h3>
              <p>
                <strong className='me-2'>Method:</strong>
                {paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3 className='mb-2'>Order Items</h3>
              {cartItems.length === 0 ? (
                <Message variant='danger'>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        {cartItems.length > 0 && (
          <Col md={4}>
            <Card className='border-0 shadow-sm p-3'>
              <Card.Body>
                <PriceSummary
                  text='Order Summary'
                  totalPrice={cart.totalPrice}
                  taxPrice={cart.taxPrice}
                  shippingPrice={cart.shippingPrice}
                  itemsPrice={cart.itemsPrice}
                >
                  {error && (
                    <ListGroup.Item>
                      <Message variant='danger'>{error}</Message>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn-block'
                      variant='dark'
                      disabled={cartItems.length === 0}
                      onClick={placeOrderHandler}
                    >
                      Place Order
                    </Button>
                    {loading && <Loader />}
                  </ListGroup.Item>
                </PriceSummary>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default PlaceOrderPage;
