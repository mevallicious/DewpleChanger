import jwt from "jsonwebtoken"

export async function identifyUser(req, res, next) {
    const token = req.cookies.token; 

    if (!token) {
        console.log("Auth Failure: No token found in cookies");
        return res.status(401).json({ message: "Unauthorized: No token provided" }); //
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch (err) {
        console.log("Auth Failure: Token verification failed", err.message);
        return res.status(403).json({ message: "Invalid or expired token" }); //
    }
}
