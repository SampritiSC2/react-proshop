import React, { useState } from 'react';
import useInput from '../hooks/useInput';
import {
  validateProductBrand,
  validateProductCategory,
  validateProductCountInStock,
  validateProductDescription,
  validateProductName,
  validateProductPrice,
} from '../utils/validators';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { Link } from 'react-router-dom';
import FormContainer from './FormContainer';
import { toast } from 'react-toastify';
import { uploadImage } from '../api/api';

const ProductForm = ({ onSubmit, product, loading, error }) => {
  const [uploading, setUploading] = useState(false);
  const {
    value: name,
    handleChange: nameChangeHandler,
    handleBlur: nameBlurHandler,
    inValid: nameIsInvalid,
    error: nameError,
  } = useInput(product ? product.name : '', validateProductName);
  const {
    value: category,
    handleChange: categoryChangeHandler,
    handleBlur: categoryBlurHandler,
    inValid: categoryIsInvalid,
    error: categoryError,
  } = useInput(product ? product.category : '', validateProductCategory);
  const {
    value: brand,
    handleChange: brandChangeHandler,
    handleBlur: brandBlurHandler,
    inValid: brandIsInvalid,
    error: brandError,
  } = useInput(product ? product.brand : '', validateProductBrand);
  const {
    value: description,
    handleChange: descriptionChangeHandler,
    handleBlur: descriptionBlurHandler,
    inValid: descriptionIsInvalid,
    error: descriptionError,
  } = useInput(product ? product.description : '', validateProductDescription);
  const {
    value: countInStock,
    handleChange: countInStockChangeHandler,
    handleBlur: countInStockBlurHandler,
    inValid: countInStockIsInvalid,
    error: countInStockError,
  } = useInput(product ? product.countInStock : 0, validateProductCountInStock);
  const {
    value: price,
    handleChange: priceChangeHandler,
    handleBlur: priceBlurHandler,
    inValid: priceIsInvalid,
    error: priceError,
  } = useInput(product ? product.price : '', validateProductPrice);

  const [image, setImage] = useState(product ? product.image : '');

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setUploading(true);
      const image = e.target.files[0];
      uploadImage(image)
        .then((imageUrl) => {
          console.log(imageUrl);
          setImage(imageUrl);
          toast.success('Image uploaded successfully');
          setUploading(false);
        })
        .catch((error) => {
          setUploading(false);
          toast(error.message);
        });
    }
  };

  const formIsInvalid =
    nameError ||
    descriptionError ||
    categoryError ||
    countInStockError ||
    brandError ||
    priceError ||
    !image;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formIsInvalid || !image) {
      return;
    }
    const productData = {
      name,
      description,
      price,
      brand,
      category,
      countInStock,
      image,
    };
    onSubmit(productData);
  };

  return (
    <>
      <Link to='/admin/product-list' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h2 className='text-center'>{product ? 'Edit' : 'Add'} Product</h2>
        <Card className='shadow-sm p-3 border-0' onSubmit={handleSubmit}>
          <Card.Body>
            {(loading || uploading) && <Loader />}
            {error && <Message variant='danger'>{error}</Message>}
            <Form>
              <Form.Group controlId='name' className='mb-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  value={name}
                  onChange={nameChangeHandler}
                  onBlur={nameBlurHandler}
                  placeholder='Product Name'
                />
                {nameIsInvalid && <p className='text-danger'>{nameError}</p>}
              </Form.Group>
              <Form.Group controlId='category' className='mb-2'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type='text'
                  value={category}
                  onChange={categoryChangeHandler}
                  onBlur={categoryBlurHandler}
                  placeholder='Product Category'
                />
                {categoryIsInvalid && <p className='text-danger'>{categoryError}</p>}
              </Form.Group>
              <Form.Group controlId='brand' className='mb-2'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  value={brand}
                  onChange={brandChangeHandler}
                  onBlur={brandBlurHandler}
                  placeholder='Product Brand'
                />
                {brandIsInvalid && <p className='text-danger'>{brandError}</p>}
              </Form.Group>
              <Form.Group controlId='description' className='mb-2'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as='textarea'
                  placeholder='Product Description'
                  style={{ resize: ' none', height: '8rem' }}
                  value={description}
                  onChange={descriptionChangeHandler}
                  onBlur={descriptionBlurHandler}
                />
                {descriptionIsInvalid && <p className='text-danger'>{descriptionError}</p>}
              </Form.Group>
              <Form.Group controlId='image' className='mb-2'>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type='text'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <Form.Control
                  type='file'
                  onChange={handleImageChange}
                  disabled={uploading}
                  label='Choose Product Image'
                  accept='image/*'
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group controlId='price'>
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type='number'
                      value={price}
                      onChange={priceChangeHandler}
                      onBlur={priceBlurHandler}
                      min={0.0}
                      step={0.01}
                      placeholder='Product Price'
                    />
                    {priceIsInvalid && <p className='text-danger'>{priceError}</p>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId='countInStock'>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                      type='number'
                      value={countInStock}
                      onChange={countInStockChangeHandler}
                      onBlur={countInStockBlurHandler}
                      min={0}
                      placeholder='Count in Stock'
                    />
                    {countInStockIsInvalid && (
                      <p className='text-danger'>{countInStockError}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Button
                type='submit'
                className='mt-2'
                variant='dark'
                disabled={formIsInvalid || loading || uploading}
              >
                {product ? 'Edit' : 'Add'} Product
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </FormContainer>
    </>
  );
};

export default ProductForm;
