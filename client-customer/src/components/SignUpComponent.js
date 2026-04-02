import React, { Component } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom"; // Dùng Navigate để chuyển hướng sau khi đăng ký

class SignUpComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      name: "",
      phone: "",
      email: "",
      message: "",
      token: "",
      redirect: false, // Để chuyển hướng sau khi đăng ký thành công
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Kiểm tra thông tin nhập vào trước khi gửi lên server
  validateInput = () => {
    const { username, password, name, phone, email } = this.state;
    if (!username || !password || !name || !phone || !email) {
      this.setState({ message: "All fields are required." });
      return false;
    }
    // Kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      this.setState({ message: "Please enter a valid email." });
      return false;
    }
    return true;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin trước khi gửi lên server
    if (!this.validateInput()) {
      return;
    }

    const { username, password, name, phone, email } = this.state;

    try {
      // Cập nhật URL API với URL động từ `window.location.origin`
      const response = await axios.post(
        `${window.location.origin}/api/customer/signup`, // Sử dụng URL gốc của ứng dụng
        {
          username,
          password,
          name,
          phone,
          email,
        },
      );

      if (response.data.success) {
        this.setState({
          message:
            "Sign-up successful! Please check your email to activate your account.",
          token: response.data.token, // Lưu token từ server vào state
        });
        // Lưu token vào localStorage để sử dụng trong trang kích hoạt
        localStorage.setItem("activationToken", response.data.token);

        // Điều hướng đến trang login hoặc trang kích hoạt
        this.setState({ redirect: true });
      } else {
        this.setState({ message: "Sign-up failed, try again." });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      this.setState({ message: "Error during sign-up, please try again." });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/login" />; // Sau khi đăng ký thành công, chuyển hướng đến trang login
    }

    const { username, password, name, phone, email, message, token } =
      this.state;

    return (
      <div className="signup-container">
        <h2 className="text-center">SIGN-UP</h2>
        {message && <p className="message">{message}</p>}
        {token && (
          <div>
            <p>
              <strong>Token:</strong> {token}
            </p>{" "}
            {/* Hiển thị token khi đăng ký thành công */}
          </div>
        )}
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit">SIGN-UP</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    );
  }
}

export default SignUpComponent;
