import jwt from "jsonwebtoken";

const roleCheck = (...Roles) => {
  return (req, res, next) => {
    if (Roles.includes(req.user.role)) {
      console.log(req.user.role);
      next();
    } else {
      res.status(401).json({ type: "error", message: "no authentication" });
    }
  };
};

export default roleCheck;
