import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import axios from "axios";
import { toast } from "react-toastify";
import { uploadImage } from "../../api/api";

const ProductEditPage = () => {
  const product = useLoaderData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEditProduct = async (productData) => {
    setLoading(true);
    console.log(productData);
    try {
      //we initialize the imageUrl variable with the existing image url of the product
      let imageUrl = product.image;

      //In case of edit mode, if we edit the image
      if (productData.image) {
        imageUrl = await uploadImage(productData.image);
      }
      await axios.put(`/api/products/${product._id}`, {
        ...productData,
        image: imageUrl,
      });
      toast.success("Product Updated Successfully");
      navigate("/admin/product-list");
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
