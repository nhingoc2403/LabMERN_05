import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter"; // assuming this HOC exists

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: "",
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // Fetch categories from API
  apiGetCategories() {
    axios
      .get("/api/customer/categories")
      .then((res) => {
        const result = res.data;
        this.setState({ categories: result });
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  handleChange = (e) => {
    this.setState({ txtKeyword: e.target.value });
  };

  btnSearchClick = (e) => {
    e.preventDefault();
    this.props.navigate(`/product/search/${this.state.txtKeyword}`);
  };

  render() {
    const { categories, txtKeyword } = this.state;

    return (
      <div className="menu-container">
        {/* Navigation Bar */}
        <div className="navbar">
          <ul className="menu">
            <li className="menu-item">
              <Link to="/" className="menu-link">
                Home
              </Link>
            </li>

            {/* Render categories */}
            {categories.map((item) => (
              <li key={item._id} className="menu-item">
                <Link to={`/product/category/${item._id}`} className="menu-link">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search Bar */}
          <div className="search-container">
            <form className="search-form" onSubmit={this.btnSearchClick}>
              <input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="search-input"
                value={txtKeyword}
                onChange={this.handleChange}
              />
              <button type="submit" className="search-button">
                <i className="fa fa-search"></i>Tìm 
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Menu);
