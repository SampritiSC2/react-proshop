import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductEditPage = () => {
  const product = useLoaderData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEditProduct = async (productData) => {
    setLoading(true);
    try {
      await axios.put(`/api/products/${product._id}`, productData);
      toast.success('Product Updated Successfully');
      navigate('/admin/product-list');
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  return (
    <ProductForm
      product={product}
      loading={loading}
      error={error}
      onSubmit={handleEditProduct}
    />
  );
};

export default ProductEditPage;
