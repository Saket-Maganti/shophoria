const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired, please login again" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware to check admin role
const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }

    next();
};

module.exports = { protect, verifyAdmin };
