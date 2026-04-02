import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './MenuComponent';
import Inform from './InformComponent'; // Đảm bảo rằng bạn sử dụng đúng component này
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import SignUpComponent from './SignUpComponent';
import ActiveAccountComponent from './ActiveAccountComponent';
import LoginComponent from './LoginComponent';
import MyProfile from './MyProfileComponent';
import MyCart from './MyCartComponent';
import MyOrders from './MyOrdersComponent';
class Main extends Component {
    render() {
        return (
            <div className="body-customer">
                <Menu />
                <Inform /> {/* Hiển thị phần header với login/sign-up hoặc logout */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/home" element={<Home />} />  Định nghĩa route cho /home */}
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/signup" element={<SignUpComponent />} />
                    <Route path="/profile" element={<MyProfile />} />
                    <Route path="/mycart" element={<MyCart />} />
                    <Route path='/myorders' element={<MyOrders />} />
                    <Route path="/active" element={<ActiveAccountComponent />} />
                    <Route path="/product/category/:cid" element={<Product />} />
                    <Route path="/product/search/:keyword" element={<Product />} /> 
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Routes>
            </div>
        );
    }
}

export default Main;
    