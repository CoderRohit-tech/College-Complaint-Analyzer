const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Authorization header check
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token required"
            });
        }

        // Bearer format check
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        // Extract token
        const actualToken = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        // Student role check
        if (decoded.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Student access required"
            });
        }

        // Store decoded student information
        req.student = decoded;

        // Continue to next middleware/controller
        next();

    } catch (error) {
        console.error("Auth middleware error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;