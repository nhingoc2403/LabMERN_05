import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Menu extends Component {
  static contextType = MyContext;

  lnkLogoutClick = () => {
    this.context.setToken('');
    this.context.setUsername('');
  };

  render() {
    return (
      <div>
        <ul>

          <li>
            <Link to="/admin/category">Category</Link>
          </li>

          <li>
            <Link to="/admin/product">Product</Link>
          </li>

          <li>
            <Link to="/admin/customer">Customer</Link>
          </li>

          <li>
            <span>Hello <b>{this.context.username}</b></span>
          </li>

          <li>
            <Link to="/admin/login" onClick={this.lnkLogoutClick}>
              Logout
            </Link>
          </li>

        </ul>
      </div>
    );
  }
}

export default Menu;