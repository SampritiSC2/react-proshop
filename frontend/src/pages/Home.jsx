import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { json, useLoaderData, useParams } from 'react-router-dom';
import { fetchProducts } from '../api/api';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomePage = () => {
  const { products, pages } = useLoaderData();
  const { pageNumber } = useParams();
  return (
    <>
      <h1 className='text-center my-2'>Latest Products</h1>
      <Row className='mt-2'>
        <Col>
          <ProductCarousel />
        </Col>
      </Row>
      <Row>
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginate page={pageNumber || 1} pages={pages} />
    </>
  );
};

export const loader = async ({ params }) => {
  try {
    const { pageNumber } = params;
    const data = await fetchProducts(pageNumber);
    return data;
  } catch (error) {
    console.log(error);
    throw json(
      {
        title: 'Failed to fetch Products',
        description: 'There was an error fetching products',
      },
      {
        status: 500,
      }
    );
  }
};

export default HomePage;
