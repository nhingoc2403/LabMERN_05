import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter"; // assuming this HOC exists

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    const { cid, keyword } = this.props.params;

    if (cid) {
      this.apiGetProductsByCatID(cid);
    } else if (keyword) {
      this.apiGetProductsByKeyword(keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const { cid, keyword } = this.props.params;
    
    if (cid && cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(cid);
    } else if (keyword && keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios
      .get(`/api/customer/products/category/${cid}`)
      .then((res) => {
        this.setState({ products: res.data, loading: false });
      })
      .catch((error) => {
        console.error("Error fetching products by category:", error);
        this.setState({ error: "Failed to load products", loading: false });
      });
  }

  apiGetProductsByKeyword(keyword) {
    axios
      .get(`/api/customer/products/search/${keyword}`)
      .then((res) => {
        this.setState({ products: res.data, loading: false });
      })
      .catch((error) => {
        console.error("Error searching products:", error);
        this.setState({ error: "Failed to load products", loading: false });
      });
  }

  render() {
    const { products, loading, error } = this.state;

    return (
      <div className="product-page">
        {loading && <p>Loading products...</p>}
        {error && <p className="error-message">{error}</p>}

        <h2 className="text-center">Product List</h2>
        <div className="product-container">
          {products.length > 0 ? (
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
            <p>No products found</p>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Product);
