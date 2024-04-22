import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { uploadImage } from "../../api/api";
import { toast } from "react-toastify";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddProduct = async (productData) => {
    const { name, description, brand, price, category, countInStock, image } =
      productData;
    try {
      setLoading(true);
      const imageUrl = await uploadImage(image);
      await axios.post("/api/products", {
        name,
        description,
        brand,
        price,
        category,
        countInStock,
        image: imageUrl,
      });
      toast.success("Product added successfully");
      navigate("/admin/product-list");
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
    }
    setLoading(false);
  };
  return (
    <ProductForm onSubmit={handleAddProduct} loading={loading} error={error} />
  );
};

export default CreateProductPage;
