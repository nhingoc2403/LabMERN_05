import React, { Component } from 'react';
import axios from 'axios';

class ActiveAccountComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      token: localStorage.getItem('activationToken') || '',  // Lấy token từ localStorage
      message: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id, token } = this.state;

    try {
      const response = await axios.post('http://localhost:3000/api/customer/active', {
        id,
        token
      });

      if (response.data.success) {
        this.setState({ message: 'Account activated successfully!' });
      } else {
        this.setState({ message: 'Failed to activate account.' });
      }
    } catch (error) {
      console.error("Error activating account:", error);
      this.setState({ message: 'Error during activation, please try again.' });
    }
  };

  render() {
    const { id, token, message } = this.state;

    return (
      <div className="active-account-container">
        <h2 className="text-center">ACTIVE ACCOUNT</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>ID:</label>
            <input 
              type="text" 
              name="id" 
              value={id} 
              onChange={this.handleChange} 
            />
          </div>
          <div>
            <label>Token:</label>
            <input 
              type="text" 
              name="token" 
              value={token} 
              readOnly // Không cho chỉnh sửa token
            />
          </div>
          <button type="submit">ACTIVE</button>
        </form>
      </div>
    );
  }
}

export default ActiveAccountComponent;
