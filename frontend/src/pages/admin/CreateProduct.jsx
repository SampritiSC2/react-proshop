import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddProduct = async (productData) => {
    const { name, description, brand, price, category, countInStock, image } = productData;
    try {
      await axios.post('/api/products', {
        name,
        description,
        brand,
        price,
        category,
        countInStock,
        image,
      });
      navigate('/admin/product-list');
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    }
    setLoading(false);
  };
  return <ProductForm onSubmit={handleAddProduct} loading={loading} error={error} />;
};

export default CreateProductPage;
