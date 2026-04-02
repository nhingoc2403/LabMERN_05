import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div>

        <Link to="/mycart">
          My cart have <b>{this.context.mycart.length}</b> items
        </Link>

      </div>
    );
  }
}

export default Inform;