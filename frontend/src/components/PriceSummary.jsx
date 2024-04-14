import React from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';

const PriceSummary = ({ totalPrice, shippingPrice, taxPrice, itemsPrice, text, children }) => {
  return (
    <ListGroup variant='flush'>
      <ListGroup.Item>
        <h2>{text}</h2>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Items :</Col>
          <Col>${itemsPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Shipping :</Col>
          <Col>${shippingPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Tax :</Col>
          <Col>${taxPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Total :</Col>
          <Col>
            <strong>${totalPrice}</strong>
          </Col>
        </Row>
      </ListGroup.Item>
      {children}
    </ListGroup>
  );
};

export default PriceSummary;
