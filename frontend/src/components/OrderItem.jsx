import React from 'react';
import { Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OrderItem = ({ item }) => {
  return (
    <ListGroup.Item>
      <Row className='align-items-center'>
        <Col md={2}>
          <Image src={item.image} alt={item.name} fluid rounded />
        </Col>
        <Col>
          <Link to={`/product/${item.product}`}>{item.name}</Link>
        </Col>
        <Col md={4}>
          {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default OrderItem;
