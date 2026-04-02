import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
        name: '',
        phone: '',
        email: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Lấy thông tin người dùng từ localStorage và điền vào form
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserInfo({
                username: user.username,
                password: '',
                name: user.name,
                phone: user.phone,
                email: user.email
            });
        } else {
            navigate('/login'); // Nếu không có người dùng, chuyển hướng đến trang đăng nhập
        }
    }, [navigate]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const userId = JSON.parse(localStorage.getItem('user')).id;
    
        try {
            const response = await axios.put(`http://localhost:3000/api/customer/customers/${userId}`, userInfo, {
                headers: {
                    'x-access-token': token
                }
            });
            console.log('Update successful:', response.data);
            alert('Profile updated successfully!');  // Thêm thông báo thành công
            navigate('/profile');  // Điều hướng đến trang Profile sau khi cập nhật thành công
        } catch (error) {
            console.error('Error during update:', error);
            if (error.response) {
                setError(error.response.data.error); // In ra thông tin lỗi từ server
            } else {
                setError('Internal Server Error');
            }
        }    
        
    };

    return (
        <div className="profile-container">
            <h2>MY PROFILE</h2>
            <div className="profile-form">
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userInfo.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={userInfo.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button onClick={handleUpdate}>UPDATE</button>
            </div>
        </div>
    );
}

export default MyProfile;
