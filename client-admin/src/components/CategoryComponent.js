import React, { Component } from 'react';
import CategoryDetail from './CategoryDetailComponent';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import 'bootstrap/dist/css/bootstrap.min.css';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  updateCategories = (categories) => {
    this.setState({ categories });
  };

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config)
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  render() {
    return (
      <div className="container mt-5">
        <h2 className="text-danger fw-bold text-center">Danh Mục Sản Phẩm</h2>
        <div className="row">
          <div className="col-md-7">
            <table className="table table-bordered table-hover shadow">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {this.state.categories.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-warning me-2" 
                        onClick={() => this.setState({ itemSelected: item })}>
                        Chỉnh sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-5">
            <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
          </div>
        </div>
      </div>
    );
  }
}

export default Category;
