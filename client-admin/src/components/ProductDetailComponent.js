import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { FaPlusCircle, FaSave, FaTrashAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: '',
      cmbCategory: '',
      imgProduct: '',
      loading: false
    };
  }

  render() {
    const { categories, txtID, txtName, txtPrice, cmbCategory, imgProduct, loading } = this.state;

    return (
      <div className="container mt-4 p-4 bg-white rounded shadow-sm">
        <h2 className="text-center text-danger mb-4">📋 Product Detail</h2>

        {loading &&
          <div className="text-center mb-3">
            <div className="spinner-border text-danger"></div>
          </div>
        }

        <form>

          <div className="mb-3">
            <label className="form-label fw-bold">Product ID</label>
            <input
              type="text"
              className="form-control"
              value={txtID}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={txtName}
              onChange={(e) => this.setState({ txtName: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Price</label>
            <input
              type="number"
              className="form-control"
              value={txtPrice}
              onChange={(e) => this.setState({ txtPrice: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={this.previewImage}
            />

            {imgProduct &&
              <img
                src={imgProduct}
                alt="preview"
                className="mt-3 border"
                width="200"
              />
            }
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <select
              className="form-control"
              value={cmbCategory}
              onChange={(e) => this.setState({ cmbCategory: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cate) => (
                <option key={cate._id} value={cate._id}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">

            <button
              className="btn btn-success"
              onClick={(e) => this.btnAddClick(e)}
              disabled={loading}
            >
              <FaPlusCircle className="me-2" />
              Add New
            </button>

            <button
              className="btn btn-warning"
              onClick={(e) => this.btnUpdateClick(e)}
              disabled={loading}
            >
              <FaSave className="me-2" />
              Update
            </button>

            <button
              className="btn btn-danger"
              onClick={(e) => this.btnDeleteClick(e)}
              disabled={loading}
            >
              <FaTrashAlt className="me-2" />
              Delete
            </button>

          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category ? this.props.item.category._id : '',
        imgProduct: "data:image/jpeg;base64," + this.props.item.image
      });
    }
  }

  previewImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      this.setState({
        imgProduct: evt.target.result
      });
    };

    reader.readAsDataURL(file);
  };

  btnAddClick = (e) => {
    e.preventDefault();

    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;

    if (!txtName || !txtPrice || !cmbCategory || !imgProduct) {
      alert("Please input name, price, category and image");
      return;
    }

    const image = imgProduct.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const prod = {
      name: txtName,
      price: parseInt(txtPrice),
      category: cmbCategory,
      image: image
    };

    this.apiPostProduct(prod);
  };

  btnUpdateClick = (e) => {
    e.preventDefault();

    const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;

    if (!txtID) {
      alert("Please select a product first");
      return;
    }

    const image = imgProduct.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const prod = {
      name: txtName,
      price: parseInt(txtPrice),
      category: cmbCategory,
      image: image
    };

    this.apiPutProduct(txtID, prod);
  };

  btnDeleteClick = (e) => {
    e.preventDefault();

    const { txtID } = this.state;

    if (!txtID) {
      alert("No product selected!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      this.apiDeleteProduct(txtID);
    }
  };

  apiPostProduct(prod) {
    const config = {
      headers: { "x-access-token": this.context.token }
    };

    this.setState({ loading: true });

    axios.post("/api/admin/products", prod, config)
      .then((res) => {
        this.setState({ loading: false });
        alert("Product added successfully!");
        this.apiGetProducts();
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("Failed to add product");
      });
  }

  apiPutProduct(id, prod) {
    const config = {
      headers: { "x-access-token": this.context.token }
    };

    this.setState({ loading: true });

    axios.put(`/api/admin/products/${id}`, prod, config)
      .then((res) => {
        this.setState({ loading: false });
        alert("Product updated successfully!");
        this.apiGetProducts();
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("Failed to update product");
      });
  }

  apiDeleteProduct(id) {
    const config = {
      headers: { "x-access-token": this.context.token }
    };

    this.setState({ loading: true });

    axios.delete(`/api/admin/products/${id}`, config)
      .then((res) => {
        this.setState({ loading: false });
        alert("Product deleted successfully!");
        this.apiGetProducts();
      })
      .catch((err) => {
        this.setState({ loading: false });
        alert("Failed to delete product");
      });
  }

  apiGetCategories() {
    const config = {
      headers: { "x-access-token": this.context.token }
    };

    axios.get("/api/admin/categories", config)
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  apiGetProducts() {
    const config = {
      headers: { "x-access-token": this.context.token }
    };

    axios.get(`/api/admin/products?page=${this.props.curPage}`, config)
      .then((res) => {
        this.props.updateProducts(res.data.products, res.data.noPages);
      });
  }
}

export default ProductDetail;