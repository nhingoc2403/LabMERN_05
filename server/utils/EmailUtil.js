// CLI: npm install nodemailer --save 
const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

// ===== CONFIG MAIL (GMAIL) =====
const transporter = nodemailer.createTransport({
    service: 'gmail', // ✅ đổi từ hotmail -> gmail
    auth: {
        user: MyConstants.EMAIL_USER,
        pass: MyConstants.EMAIL_PASS // ⚠️ PHẢI là App Password
    }
});

// ===== VERIFY KẾT NỐI (debug cực hữu ích) =====
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email config error:", error);
    } else {
        console.log("✅ Email server is ready to send messages");
    }
});

const EmailUtil = {
    send(email, id, token) {

        // ===== EMAIL CONTENT =====
        const html = `
            <h2>Welcome to VLU STORE 🎉</h2>
            <p>Thank you for signing up!</p>
            <p>Please use the information below to activate your account:</p>
            <ul>
                <li><b>ID:</b> ${id}</li>
                <li><b>Token:</b> ${token}</li>
            </ul>
            <p>Click the button below to activate:</p>
            <a href="http://localhost:3000/activate?id=${id}&token=${token}" 
               style="padding:10px 20px; background:#28a745; color:#fff; text-decoration:none;">
               ACTIVATE ACCOUNT
            </a>
            <p>If you did not sign up, please ignore this email.</p>
        `;

        return new Promise((resolve, reject) => {

            const mailOptions = {
                from: `"VLU STORE" <${MyConstants.EMAIL_USER}>`,
                to: email,
                subject: 'Signup | Verification',
                html: html // ✅ dùng HTML đẹp hơn text
            };

            transporter.sendMail(mailOptions, (err, result) => {
                if (err) {
                    console.error("❌ Send mail error:", err);
                    resolve(false); // tránh crash server
                } else {
                    console.log("✅ Email sent:", result.response);
                    resolve(true);
                }
            });

        });
    }
};

module.exports = EmailUtil;