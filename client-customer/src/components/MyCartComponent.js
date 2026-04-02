import React, { Component } from "react";
import withRouter from "../utils/withRouter"; // 👈 Dùng để navigate trong class component

class MyCartComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
            success: false,
        };
    }

    componentDidMount() {
        this.syncCartWithStorage();
        window.addEventListener("storage", this.syncCartWithStorage);
    }

    componentWillUnmount() {
        window.removeEventListener("storage", this.syncCartWithStorage);
    }

    syncCartWithStorage = () => {
        const updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        this.setState({ cartItems: updatedCart });
    };

    removeItem = (id) => {
        const updatedCart = this.state.cartItems.filter(
            (item) => item._id !== id,
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        this.setState({ cartItems: updatedCart });
    };

    handleCheckout = async () => {
        const token = localStorage.getItem("token");
        const { cartItems } = this.state;

        if (!token) {
            alert("Bạn cần đăng nhập để đặt hàng!");
            return;
        }

        if (cartItems.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        try {
            const response = await fetch(
                `${window.location.origin}/api/customer/checkout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                    body: JSON.stringify({ cartItems }),
                },
            );

            const data = await response.json();

            if (data.success) {
                localStorage.removeItem("cartItems");
                this.setState({ cartItems: [], success: true });

                // 🔄 Cập nhật lại dữ liệu toàn ứng dụng
                window.dispatchEvent(new Event("storage"));

                // ✅ Chuyển hướng qua trang MyOrders sau 500ms
                setTimeout(() => {
                    this.props.navigate("/myorders");
                    window.location.reload(); // 👉 reload lại trang sau khi chuyển hướng
                }, 500);
            } else {
                alert("Đặt hàng thất bại!");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Có lỗi xảy ra khi đặt hàng.");
        }
    };

    render() {
        const { cartItems, success } = this.state;
        const total = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
        const cartCount = cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
        );

        return (
            <div>
                <h2>My Cart</h2>

                {success && (
                    <p style={{ color: "green", fontWeight: "bold" }}>
                        ✅ Đặt hàng thành công!
                    </p>
                )}

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                this.removeItem(item._id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Giỏ hàng trống</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Total: {total}
                </div>
                <div className="cart-count">My cart has {cartCount} items</div>

                {cartItems.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                        <button onClick={this.handleCheckout}>CHECKOUT</button>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(MyCartComponent);
