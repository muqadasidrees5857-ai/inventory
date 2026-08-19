const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/products/${id}`,
);

const products =
  response.data.products || [];

const foundProduct =
  products.find(
    (item) =>
      String(item.id) === String(id)
  );

if (!foundProduct) {

  setError("Product not found.");

  return;

}

setProduct(foundProduct);