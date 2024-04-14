import axios from 'axios';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';

const OrderListItem = ({ order, onMarkAsDelivered }) => {
  const [loading, setLoading] = useState(false);

  const handleMarkAsDelivered = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/orders/${id}/deliver`);
      const { order: updatedOrder } = data;
      onMarkAsDelivered(updatedOrder);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setLoading(false);
  };
  return (
    <tr key={order._id}>
      <td>{order._id}</td>
      <td>{order.user && order.user.name}</td>
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
          <Button variant='dark' className='btn-sm' type='button'>
            Details
          </Button>
        </LinkContainer>
        {!order.isDelivered && order.isPaid && (
          <Button
            variant='warning'
            className='btn-sm ms-2'
            type='button'
            onClick={() => handleMarkAsDelivered(order._id)}
            disabled={loading}
          >
            Mark Delivered
          </Button>
        )}
      </td>
    </tr>
  );
};

export default OrderListItem;
