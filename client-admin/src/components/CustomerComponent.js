import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  render() {

    // ===== CUSTOMER LIST =====
    const customers = this.state.customers.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
          <td>{item._id}</td>
          <td>{item.username}</td>
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>{item.active === 1 ? "ACTIVE" : "INACTIVE"}</td>
          <td>
            {item.active === 1 ?
              <>
                <span
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.lnkDeactiveClick(item);
                  }}
                >
                  DEACTIVE
                </span>
                {" | "}
                <span
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.lnkEmailClick(item);
                  }}
                >
                  EMAIL
                </span>
              </>
              :
              <>
                <span
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.lnkActiveClick(item);
                  }}
                >
                  ACTIVATE
                </span>
                {" | "}
                <span
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.lnkEmailClick(item);
                  }}
                >
                  EMAIL
                </span>
              </>
            }
          </td>
        </tr>
      );
    });

    // ===== ORDER LIST =====
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trOrderClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
        </tr>
      );
    });

    // ===== ORDER DETAIL =====
    let items = [];
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img src={"data:image/jpg;base64," + item.product.image} width="70" alt="" />
            </td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }

    return (
      <div>

        {/* CUSTOMER */}
        <h2>CUSTOMER LIST</h2>
        <table border="1">
          <tbody>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
            {customers}
          </tbody>
        </table>

        {/* ORDER LIST */}
        {this.state.orders.length > 0 &&
          <div>
            <h2>ORDER LIST</h2>
            <table border="1">
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
                {orders}
              </tbody>
            </table>
          </div>
        }

        {/* ORDER DETAIL */}
        {this.state.order &&
          <div>
            <h2>ORDER DETAIL</h2>
            <table border="1">
              <tbody>
                <tr>
                  <th>No</th>
                  <th>Prod ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
        }

      </div>
    );
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  // ===== EVENTS =====

  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id);
  }

  lnkActiveClick(item) {
    this.apiPutCustomerActive(item._id);
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  // ===== API =====

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutCustomerDeactive(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, {}, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      } else {
        alert('DEACTIVE FAILED!');
      }
    });
  }

  apiPutCustomerActive(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/active/' + id, {}, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      } else {
        alert('ACTIVATE FAILED!');
      }
    });
  }

  // 🔥 FIX LAB 9 (SEND MAIL)
  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      alert(res.data.message);
    }).catch(err => {
      console.error(err);
      alert("Send mail failed!");
    });
  }

}

export default Customer;