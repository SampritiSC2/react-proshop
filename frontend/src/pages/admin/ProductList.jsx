import React, { useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { Button, Col, Image, Row, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';

const ProductListPage = () => {
  const productsData = useLoaderData();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(productsData.products);
  const { pageNumber } = useParams();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete ?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
        toast.success('Product Deleted Successfully');
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <LinkContainer to='/admin/new-product'>
            <Button className='btn-sm m-3' variant='dark'>
              <FaEdit /> Create Product
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loading && <Loader />}
      <Table striped hover responsive className='table-sm mb-3'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>IMAGE</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>
                <Image
                  src={product.image}
                  style={{ width: '80px', height: '60px' }}
                  rounded
                  fluid
                  alr={product.name}
                />
              </td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <LinkContainer to={`/admin/edit-product/${product._id}`}>
                  <Button className='btn btn-sm' variant='light'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
                <Button
                  variant='danger'
                  className='ms-2'
                  onClick={() => deleteHandler(product._id)}>
                  <FaTrash style={{ color: 'white' }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginate
        page={pageNumber || 1}
        pages={productsData.pages}
        isAdmin={true}
        pageName='product-list'
      />
    </>
  );
};

export default ProductListPage;
