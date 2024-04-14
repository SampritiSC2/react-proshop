import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from 'axios';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import OrderItem from '../components/OrderItem';
import PriceSummary from '../components/PriceSummary';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const [order, setOrder] = useState(null);
  const { id: orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [{ isPending }, payPalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    const fetchOrderById = async () => {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data.order);
      setLoading(false);
    };

    fetchOrderById().catch((error) => {
      setError(error?.response?.data?.message || error.message);
      setLoading(false);
    });
  }, [orderId]);

  useEffect(() => {
    const fetchPayPalClientId = async () => {
      const { data } = await axios.get('/api/config/paypal');
      return data.clientId;
    };

    fetchPayPalClientId()
      .then((clientId) => {
        const loadPayPalScript = async () => {
          payPalDispatch({
            type: 'resetOptions',
            value: {
              'client-id': clientId,
              currency: 'USD',
            },
          });

          payPalDispatch({
            type: 'setLoadingStatus',
            value: 'pending',
          });
        };

        if (order && !order.isPaid) {
          if (!window.paypal) {
            loadPayPalScript();
          }
        }
      })
      .catch((error) => {
        setError(error?.response?.data?.message || error.message);
      });
  }, [order, payPalDispatch]);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        const { data } = await axios.put(`/api/orders/${order._id}/pay`, {
          ...details,
        });
        toast.success('Payment Successfull');
        setOrder(data.order);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    });
  };

  const onError = (error) => {
    toast.error(error.message);
  };
  return (
    <>
      {loading && <Loader />}
      {error && <Message variant='danger'>{error}</Message>}
      {order && (
        <>
          <h2 className='mb-3 text-center'>Order: {order._id}</h2>
          <Row>
            <Col md={7}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h4 className='mb-3'>Shipping</h4>
                  <p>
                    <strong>Name: </strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong> {order.user.email}
                  </p>
                  <p>
                    <strong>Address: </strong>{' '}
                    {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
                  </p>
                  {order.isDelivered ? (
                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4 className='mb-3'>Payment Method</h4>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant='success'>Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4 className='mb-2'>Order Items</h4>
                  {order.orderItems.map((item, index) => (
                    <OrderItem key={index} item={item} />
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={5}>
              <Card className='border-0 shadow-sm p-3'>
                <Card.Body>
                  <PriceSummary
                    text='Order Summary'
                    totalPrice={order.totalPrice}
                    itemsPrice={order.itemsPrice}
                    taxPrice={order.taxPrice}
                    shippingPrice={order.shippingPrice}
                  />
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {isPending ? (
                        <Loader />
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          />
                        </div>
                      )}
                    </ListGroup.Item>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderPage;
