const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Token check
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }

        // Bearer token check
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        const actualToken = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        // Role check
        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        // Admin information
        req.admin = decoded;

        next();

    } catch (error) {
        console.error("Admin middleware error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = adminMiddleware;