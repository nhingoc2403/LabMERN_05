import React, { Component } from 'react';
import axios from 'axios';

class MyOrdersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      selectedOrder: null
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && user.id && token) {
      axios.get(`/api/customer/orders/customer/${user.id}`, {
        headers: { 'x-access-token': token }
      })
        .then((res) => {
          this.setState({ orders: res.data.orders });
        })
        .catch(error => {
          console.error("Error fetching orders:", error);
        });
    }
  }

  handleSelectOrder = (order) => {
    this.setState({ selectedOrder: order });
  }

  render() {
    const { orders, selectedOrder } = this.state;

    return (
      <div className="align-center">
        <h2 className="text-center">ORDER LIST</h2>
        <table className="table" border="1" cellPadding="10" style={{ margin: 'auto', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#eee' }}>
            <tr>
              <th>ID</th>
              <th>Creation date</th>
              <th>Cust.name</th>
              <th>Cust.phone</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} onClick={() => this.handleSelectOrder(order)} style={{ cursor: 'pointer' }}>
                <td>{order._id}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>{order.customer.name}</td>
                <td>{order.customer.phone}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedOrder && (
          <>
            <h2 className="text-center" style={{ marginTop: '30px' }}>ORDER DETAIL</h2>
            <table className="table" border="1" cellPadding="10" style={{ margin: 'auto', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead style={{ backgroundColor: 'gold' }}>
                <tr>
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Prod.name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f2b3' }}>
                    <td>{index + 1}</td>
                    <td>{item.product}</td>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={item.image ? `data:image/jpg;base64,${item.image}` : '/default-image.jpg'}
                        alt={item.name}
                        width="60"
                      />
                    </td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}

export default MyOrdersComponent;
