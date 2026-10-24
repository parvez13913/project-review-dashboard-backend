import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import prisma from "../../../lib/prisma";
import { IJwtPayload, IRegisterPayload } from "./auth.interface";

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: IJwtPayload["role"];
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (data: IRegisterPayload) => {
  if (!data.name || !data.email || !data.password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Name, email, and password are required",
    );
  }

  if (data.password.length < 6) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password must be at least 6 characters",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "An account with this email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_round),
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  const token = JwtHelpers.signToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt_secret as Secret,
    config.jwt_expires_in as unknown as string,
  );

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const AuthService = {
  register,
};
