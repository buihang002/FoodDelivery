import jwt from "jsonwebtoken";

// const verifyToken = async (req, res, next) => {
//   try {
//     let token = req.headers.authorization;

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "No token, authorization denied" });
//     }

//     // Kiểm tra token có đúng định dạng "Bearer <token>" không
//     if (!token.startsWith("Bearer ")) {
//       return res.status(400).json({ message: "Invalid token format" });
//     }

//     // Cắt bỏ "Bearer " để lấy token
//     token = token.split(" ")[1];

//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       return res.status(500).json({ message: "JWT secret is missing" });
//     }

//     jwt.verify(token, jwtSecret, (error, decoded) => {
//       if (error) {
//         return res.status(403).json({ message: "Token verification failed" });
//       }
//       req.userID = decoded.id;
//       next();
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "ERROR" });
  }
};

export default authMiddleware;
