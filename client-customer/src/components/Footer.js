import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

class Footer extends Component {
  render() {
    return (
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <h3>VLU STORE</h3>
            <p>Chuyên cung cấp các sản phẩm điện tử chính hãng, uy tín, chất lượng.</p>
          </div>
          <div className="footer-middle">
            <h4>Thông tin liên hệ</h4>
            <ul>
              <li><FaPhoneAlt size={20} /> 1800.2097</li>
              <li><FaMapMarkerAlt size={20} /> Cửa hàng gần bạn</li>
            </ul>
          </div>
          <div className="footer-right">
            <h4>Theo dõi chúng tôi</h4>
            <div className="social-icons">
              <Link to="https://facebook.com" className="social-icon"><FaFacebook size={25} /></Link>
              <Link to="https://instagram.com" className="social-icon"><FaInstagram size={25} /></Link>
              <Link to="https://twitter.com" className="social-icon"><FaTwitter size={25} /></Link>
              <Link to="https://youtube.com" className="social-icon"><FaYoutube size={25} /></Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 VLU STORE. All Rights Reserved.</p>
        </div>
      </div>
    );
  }
}

export default Footer;
