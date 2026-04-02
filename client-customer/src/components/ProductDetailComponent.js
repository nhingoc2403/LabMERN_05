import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }

  componentDidMount() {
    const params = this.props.params || {};
    if (params.id) {
      this.apiGetProduct(params.id);
    }
  }

  apiGetProduct(id) {
    axios.get(`/api/customer/products/${id}`)
      .then((res) => {
        this.setState({ product: res.data });
      });
  }

  // 🔥 ADD TO CART CHUẨN LAB
  btnAdd2CartClick = (e) => {
    e.preventDefault();

    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);

    if (quantity) {
      const mycart = this.context.mycart;

      const index = mycart.findIndex(
        x => x.product._id === product._id
      );

      if (index === -1) {
        const newItem = {
          product: product,
          quantity: quantity
        };
        mycart.push(newItem);
      } else {
        mycart[index].quantity += quantity;
      }

      this.context.setMycart(mycart);

      alert("OK BABY!");
    } else {
      alert("Please input quantity");
    }
  };

  render() {
    const product = this.state.product;

    if (!product) return <div>Loading...</div>;

    return (
      <div className="align-center">
        <h2>PRODUCT DETAIL</h2>

        <figure>
          <img
            src={"data:image/jpg;base64," + product.image}
            width="400"
            alt=""
          />

          <figcaption>
            <form>
              <table>
                <tbody>

                  <tr>
                    <td>ID:</td>
                    <td>{product._id}</td>
                  </tr>

                  <tr>
                    <td>Name:</td>
                    <td>{product.name}</td>
                  </tr>

                  <tr>
                    <td>Price:</td>
                    <td>{product.price}</td>
                  </tr>

                  <tr>
                    <td>Category:</td>
                    <td>{product.category?.name}</td>
                  </tr>

                  <tr>
                    <td>Quantity:</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={this.state.txtQuantity}
                        onChange={(e) =>
                          this.setState({
                            txtQuantity: e.target.value
                          })
                        }
                      />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td>
                      <input
                        type="submit"
                        value="ADD TO CART"
                        onClick={(e) => this.btnAdd2CartClick(e)}
                      />
                    </td>
                  </tr>

                </tbody>
              </table>
            </form>
          </figcaption>
        </figure>
      </div>
    );
  }
}

export default withRouter(ProductDetail);