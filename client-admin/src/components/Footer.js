import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 mt-5">
      <div className="container">
        <div className="row pb-4">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-white">VLU STORE Admin</h5>
            <p className="text-muted">Chăm sóc khách hàng và quản lý sản phẩm của cửa hàng VLU STORE.</p>
          </div>

          <div className="col-md-4 mb-4">
            <h6 className="fw-bold text-white">Thông tin liên hệ</h6>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <FaPhoneAlt className="me-2 text-warning" />
                1800.2097
              </li>
              <li>
                <FaMapMarkerAlt className="me-2 text-warning" />
                Cửa hàng gần bạn
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h6 className="fw-bold text-white">Theo dõi chúng tôi</h6>
            <div className="d-flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <FaTwitter />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-light fs-5">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="border-top pt-3 text-center text-muted small">
          &copy; 2025 VLU STORE Admin. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
