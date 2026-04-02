import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { FaPlusCircle, FaSave, FaTrashAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id || '',
        txtName: this.props.item.name || ''
      });
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  btnAddClick = (e) => {
    e.preventDefault();
    const { txtName } = this.state;
    if (!txtName) return alert('Vui lòng nhập tên danh mục');
    this.apiPostCategory({ name: txtName });
  };

  btnUpdateClick = (e) => {
    e.preventDefault();
    const { txtID, txtName } = this.state;
    if (!txtID || !txtName) return alert('Vui lòng chọn danh mục và nhập tên');
    this.apiPutCategory(txtID, { name: txtName });
  };

  btnDeleteClick = (e) => {
    e.preventDefault();
    const { txtID } = this.state;
    if (!txtID) return alert('Vui lòng chọn danh mục để xóa');
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      this.apiDeleteCategory(txtID);
    }
  };

  apiPostCategory = (category) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', category, config)
      .then(() => {
        alert('✅ Thêm danh mục thành công!');
        this.apiGetCategories();
        this.setState({ txtID: '', txtName: '' });
      })
      .catch(() => alert('❌ Lỗi khi thêm danh mục.'));
  };

  apiPutCategory = (id, category) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/categories/${id}`, category, config)
      .then(() => {
        alert('✅ Cập nhật thành công!');
        this.apiGetCategories();
      })
      .catch(() => alert('❌ Cập nhật thất bại.'));
  };

  apiDeleteCategory = (id) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/categories/${id}`, config)
      .then(() => {
        alert('🗑️ Đã xóa danh mục.');
        this.apiGetCategories();
        this.setState({ txtID: '', txtName: '' });
      })
      .catch(() => alert('❌ Xóa thất bại.'));
  };

  apiGetCategories = () => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config)
      .then(res => this.props.updateCategories(res.data));
  };

  render() {
    return (
      <div className="p-4 bg-white rounded shadow-sm">
        <h4 className="text-center text-danger mb-4 fw-bold">📋 Chi Tiết Danh Mục</h4>
        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold">Mã danh mục</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={this.state.txtID}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Tên danh mục</label>
            <input
              type="text"
              name="txtName"
              className="form-control form-control-sm"
              value={this.state.txtName}
              onChange={this.handleInputChange}
              placeholder="Nhập tên danh mục..."
            />
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-success px-4" onClick={this.btnAddClick}>
              <FaPlusCircle className="me-2" /> Thêm Mới
            </button>
            <button className="btn btn-warning px-4" onClick={this.btnUpdateClick}>
              <FaSave className="me-2" /> Cập Nhật
            </button>
            <button className="btn btn-danger px-4" onClick={this.btnDeleteClick}>
              <FaTrashAlt className="me-2" /> Xóa
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CategoryDetail;
