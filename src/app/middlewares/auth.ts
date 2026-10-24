import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import { JwtHelpers } from "../../helpers/jwt-helpers";
import { IJwtPayload } from "../modules/auth/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }
      let verifiedUser = null;
      verifiedUser = JwtHelpers.verifiedToken(
        token,
        config.jwt.secret as Secret,
      );
      req.user = verifiedUser as IJwtPayload;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
