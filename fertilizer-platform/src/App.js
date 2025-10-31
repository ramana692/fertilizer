import React, { useState, useEffect } from "react";
import "./style.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001"; // backend base URL

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="site">
      <header className="site-header">
        <div className="brand">
          <h1>AgriNova</h1>
          <small>Fertilizer Platform</small>
        </div>

        <div className="header-controls">
          <select className="lang">
            <option>English</option>
            <option>Telugu</option>
            <option>Hindi</option>
          </select>

          <div className="cart">🛒 ({cartCount})</div>
          <div className="profile">👤</div>
        </div>
      </header>

      <section className="search-area">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search fertilizers..."
        />
        <button>Search</button>
      </section>

      <main className="grid">
        {loading && <div>Loading products...</div>}
        {!loading && filtered.length === 0 && <div>No fertilizers found.</div>}
        {!loading &&
          filtered.map((p) => (
            <article key={p._id || p.id} className="card">
              {/* if backend returns '/d1.jpeg', browser will request from frontend origin (localhost:3000) */}
              <img
                src={p.image}
                alt={p.name}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
              <div className="card-body">
                <h3>{p.name}</h3>
                <div className="meta">
                  <div className="price">{p.priceLabel}</div>
                  <div>Size: {p.size}</div>
                  <div className="use">Use: {p.use}</div>
                </div>
                <div className="actions">
                  <button
                    className="btn cart"
                    onClick={() => setCartCount((c) => c + 1)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn buy"
                    onClick={() => alert(`Buying ${p.name}`)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </article>
          ))}
      </main>

      <footer className="site-footer">© {new Date().getFullYear()} AgriNova</footer>
    </div>
  );
}
