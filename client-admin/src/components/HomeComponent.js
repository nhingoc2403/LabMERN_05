import React from "react";
import { Bar } from "react-chartjs-2";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaBoxOpen, FaMoneyBillWave, FaStore } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomeComponent = () => {
  const data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
    datasets: [
      {
        label: "Doanh thu (Triệu VNĐ)",
        data: [120, 150, 180, 220, 260],
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-danger fw-bold mb-4">
        📊 Thống Kê Bán Hàng
      </h1>

      {/* Thống kê nhanh */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card text-center shadow border-0 rounded-4">
            <div className="card-body py-4">
              <FaBoxOpen size={40} className="text-warning mb-3" />
              <h3 className="text-dark fw-bold">100</h3>
              <p className="text-muted">Đơn hàng hôm nay</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow border-0 rounded-4">
            <div className="card-body py-4">
              <FaMoneyBillWave size={40} className="text-success mb-3" />
              <h3 className="text-dark fw-bold">500 triệu VNĐ</h3>
              <p className="text-muted">Doanh thu tháng này</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow border-0 rounded-4">
            <div className="card-body py-4">
              <FaStore size={40} className="text-primary mb-3" />
              <h3 className="text-dark fw-bold">250</h3>
              <p className="text-muted">Sản phẩm đang bán</p>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="p-4 bg-white shadow rounded-4">
        <h4 className="text-center text-danger mb-4">📈 Biểu đồ doanh thu</h4>
        <Bar data={data} />
      </div>
    </div>
  );
};

export default HomeComponent;
