import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // ✅ Chặn reload mặc định

        if (!username || !password) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${window.location.origin}/api/customer/login`,
                { username, password },
            );

            // ✅ Lưu vào localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.customer),
            );
            localStorage.setItem("token", response.data.token);

            // ✅ Chuyển trang và reload
            navigate("/home");
            window.location.reload(); // 🔁 reload lại trang
        } catch (error) {
            console.error("Error during login:", error);
            setError(
                error.response?.data?.error ||
                    "Đã có lỗi xảy ra. Vui lòng thử lại.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>CUSTOMER LOGIN</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && (
                    <div className="error" style={{ color: "red" }}>
                        {error}
                    </div>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "LOGIN"}
                </button>
            </form>
        </div>
    );
}

export default Login;
