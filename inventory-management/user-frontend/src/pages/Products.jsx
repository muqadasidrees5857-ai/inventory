
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";

import { useEffect, useState } from "react";
import axios from "axios";

import { Search, Package } from "lucide-react";


const productImages = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",

  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",

  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",

  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",

  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",

  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
];


function Products() {

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);


  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5001/api/products"
      );

      setProducts(
        response.data.products || []
      );

    } catch (error) {

      console.error(
        "Unable to fetch products:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // LOAD PRODUCTS
  // =========================================

  useEffect(() => {

    fetchProducts();

  }, []);


  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredProducts = products.filter(
    (product) =>
      product.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );


  return (

    <div className="products-page">


      {/* =========================================
          HEADER
      ========================================= */}

      <div className="products-header">

        <div>

          <span className="products-eyebrow">
            OUR COLLECTION
          </span>

          <h1>
            Products
          </h1>

          <p>
            Browse our latest products and find
            something you love.
          </p>

        </div>


        {/* Search */}

        <div className="user-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (

        <Loading />

      ) : filteredProducts.length === 0 ? (


        /* =========================================
           NO PRODUCTS
        ========================================= */

        <div className="products-loading">

          <Package size={40} />

          <h3>
            No products found
          </h3>

          <p>
            Try another search or check back later.
          </p>

        </div>


      ) : (


        /* =========================================
           PRODUCTS GRID
        ========================================= */

        <div className="products-grid">

          {filteredProducts.map(
            (product, index) => (

              <ProductCard
                key={product.id}
                product={{
                  ...product,

                  /*
                    Use product image if available.
                    Otherwise use fallback image.
                  */

                  image:
                    product.image ||
                    productImages[
                      index %
                      productImages.length
                    ],
                }}
              />

            )
          )}

        </div>

      )}

    </div>

  );

}


export default Products;
