const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next)=>{
    try{

        const token = req.headers.authorization;

        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token is required"
            });
        }

        const actualToken = token.split(' ')[1];

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

         if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        req.admin = decoded;
        next();

    }catch(error){
        console.log(error);
        res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        });
    }
}

module.exports = adminMiddleware;