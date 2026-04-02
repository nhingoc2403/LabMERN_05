import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      loading: true,  // Loading state for async fetch
      error: null     // Error state for error handling
    };
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  // API để lấy sản phẩm mới
  apiGetNewProducts() {
    axios
      .get("/api/customer/products/new")
      .then((res) => {
        this.setState({ newprods: res.data, loading: false });
      })
      .catch((error) => {
        console.error("Error fetching new products:", error);
        this.setState({ error: "Failed to load new products", loading: false });
      });
  }

  // API để lấy sản phẩm hot
  apiGetHotProducts() {
    axios
      .get("/api/customer/products/hot")
      .then((res) => {
        this.setState({ hotprods: res.data, loading: false });
      })
      .catch((error) => {
        console.error("Error fetching hot products:", error);
        this.setState({ error: "Failed to load hot products", loading: false });
      });
  }

  renderProducts(products) {
    return products.length > 0 ? (
      products.map((item) => (
        <div key={item._id} className="product-card">
          <Link to={`/product/${item._id}`}>
            <img
              src={item.image ? `data:image/jpg;base64,${item.image}` : "/default-image.jpg"}
              alt={item.name}
            />
          </Link>
          <div className="product-info">
            <h4>{item.name}</h4>
            <p className="price">Price: {item.price}</p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center">No products available</p>
    );
  }

  render() {
    const { newprods, hotprods, loading, error } = this.state;
    
    return (
      <div className="home-container">
        {loading && <p>Loading products...</p>}  {/* Show loading state */}
        {error && <p className="error-message">{error}</p>}  {/* Show error message */}

        <div className="container">
          <h2 className="text-center">NEW PRODUCTS</h2>
          <div className="product-container">
            {this.renderProducts(newprods)}
          </div>

          <h2 className="text-center">HOT PRODUCTS</h2>
          <div className="product-container">
            {this.renderProducts(hotprods)}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
