import React, { useState } from 'react';
import { fetchTopProducts } from '../api/api';
import Loader from './Loader';
import Message from './Message';
import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCarousel = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useState(() => {
    const getTopProducts = async () => {
      setLoading(true);
      const { products } = await fetchTopProducts();
      setTopProducts(products);
      setLoading(false);
    };

    getTopProducts().catch((error) => {
      setLoading(false);
      setError(error?.response?.data?.message || error.message);
    });
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Carousel pause='hover' className='bg-dark mb-4'>
          {topProducts.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.image} alt={product.name} fluid />
                <Carousel.Caption className='carousel-caption'>
                  <h2 className='mb-3'>
                    {product.name} (${product.price})
                  </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default ProductCarousel;
