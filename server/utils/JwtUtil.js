// const jwt = require('jsonwebtoken');
// const MyConstants = require('./MyConstants');

// const JwtUtil = {
//     genToken(username, password) {
//         return jwt.sign(
//             { username, password },
//             MyConstants.JWT_SECRET,
//             { expiresIn: MyConstants.JWT_EXPIRES }
//         );
//     },
    
//     checkToken(req, res, next) {
//         const token = req.headers['x-access-token'] || req.headers['authorization'];
//         if (token) {
//             jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
//                 if (err) {
//                     return res.json({ success: false, message: 'Token is not valid' });
//                 } else {
//                     req.decoded = decoded;
//                     next();
//                 }
//             });
//         } else {
//             return res.json({ success: false, message: 'Auth token is not supplied' });
//         }
//     }
// };

const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');

const JwtUtil = {
    genToken(payload) {
        return jwt.sign(payload, MyConstants.JWT_SECRET, {
            expiresIn: MyConstants.JWT_EXPIRES || '1h'
        });
    },

    checkToken(req, res, next) {
        const token = req.headers['x-access-token'] || req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ success: false, message: 'No token provided' });
        }

        jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Token is not valid' });
            }
            req.user = decoded;
            next();
        });
    }
};

module.exports = JwtUtil;
