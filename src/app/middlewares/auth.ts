import { NextFunction, Request, Response } from "express";
import { JwtHelpers } from "../../helpers/jwt-helpers";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized! No token provided.",
        });
      }
      const token = authHeader.split(" ")[1]?.replace(/^"|"$/g, "").trim();

      if (!token || token === "undefined" || token === "null") {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token format!" });
      }

      // Verify token
      const verifiedUser = JwtHelpers.verifiedToken(
        token,
        process.env.JWT_SECRET as string,
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You lack required permissions.",
        });
      }

      next();
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token!" });
    }
  };
};

export default auth;
