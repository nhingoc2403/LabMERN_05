import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  btnLoginClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;

    if (txtUsername && txtPassword) {
      const account = { username: txtUsername, password: txtPassword };
      this.apiLogin(account);
    } else {
      alert('Vui lòng nhập tài khoản và mật khẩu!');
    }
  };

  apiLogin = (account) => {
    axios.post(`/api/admin/login`, account)
      .then((res) => {
        const result = res.data;
        if (result.success === true) {
          this.context.setToken(result.token);
          this.context.setUsername(account.username);
        } else {
          alert(result.message);
        }
      });
  };

  render() {
    if (this.context.token === '') {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="p-4 bg-white shadow rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="text-center mb-4">
              <img src="1.png" alt="Logo" style={{ width: '60px' }} />
              <h3 className="fw-bold text-danger mt-2">ĐĂNG NHẬP ADMIN</h3>
              <p className="text-muted small">Quản lý sản phẩm, đơn hàng</p>
            </div>

            <form>
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control rounded-3 shadow-sm" 
                  placeholder="Tên đăng nhập" 
                  value={this.state.txtUsername} 
                  onChange={(e) => this.setState({ txtUsername: e.target.value })} 
                />
              </div>

              <div className="mb-4">
                <input 
                  type="password" 
                  className="form-control rounded-3 shadow-sm" 
                  placeholder="Mật khẩu" 
                  value={this.state.txtPassword} 
                  onChange={(e) => this.setState({ txtPassword: e.target.value })} 
                />
              </div>

              <button 
                className="btn btn-danger w-100 py-2 fw-bold rounded-3 shadow" 
                onClick={this.btnLoginClick}
              >
                ĐĂNG NHẬP
              </button>
            </form>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default Login;
