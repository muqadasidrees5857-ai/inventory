
import { Link } from "react-router-dom";
import { ArrowRight, Package, ShieldCheck, Truck } from "lucide-react";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">

          <span className="home-eyebrow">
            INVENTORY STORE
          </span>

          <h1>
            Everything you need,
            <br />
            all in one place.
          </h1>

          <p>
            Discover quality products at great prices.
            Browse our collection and find exactly what
            you are looking for.
          </p>

          <div className="home-hero-actions">

            <Link to="/products" className="home-primary-btn">
              Shop Products
              <ArrowRight size={18} />
            </Link>

            <Link to="/products" className="home-secondary-btn">
              Explore Collection
            </Link>

          </div>

        </div>

        <div className="home-hero-visual">
          <Package size={120} strokeWidth={1} />
        </div>
      </section>


      {/* Features */}
      <section className="home-features">

        <div className="home-feature-card">
          <div className="home-feature-icon">
            <Truck size={25} />
          </div>

          <div>
            <h3>Fast Delivery</h3>
            <p>
              Get your products delivered quickly.
            </p>
          </div>
        </div>


        <div className="home-feature-card">
          <div className="home-feature-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h3>Secure Shopping</h3>
            <p>
              Your shopping experience is safe and secure.
            </p>
          </div>
        </div>


        <div className="home-feature-card">
          <div className="home-feature-icon">
            <Package size={25} />
          </div>

          <div>
            <h3>Quality Products</h3>
            <p>
              We provide reliable and quality products.
            </p>
          </div>
        </div>

      </section>


      {/* CTA */}
      <section className="home-cta">

        <div>
          <span>READY TO SHOP?</span>

          <h2>
            Find your next favorite product.
          </h2>

          <p>
            Explore our complete product collection.
          </p>
        </div>

        <Link to="/products" className="home-cta-btn">
          View Products
          <ArrowRight size={18} />
        </Link>

      </section>

    </div>
  );
}

export default Home;

