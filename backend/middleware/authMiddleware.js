const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    try{

        const token = req.headers.authorization;

        if(!token){
           return res.status(401).json({
            success:false,
            message: 'Access denied. Token required'
           });
        }

        const actualToken = token.split(' ')[1];

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        

        req.student = decoded;

        next();


    }catch(error){
        console.error(error);
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;