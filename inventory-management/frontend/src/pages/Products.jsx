import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductModal from '../components/AddProductModal';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error("Unable to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Unable to delete product:", error);
      alert("Unable to delete product.");
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts((currentProducts) => [...currentProducts, newProduct]);
  };

  return (
    <div>
      <h1>Products</h1>
      <button onClick={() => setIsModalOpen(true)}>Add New Product</button>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <span>{product.name} - ${product.price}</span>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default Products;