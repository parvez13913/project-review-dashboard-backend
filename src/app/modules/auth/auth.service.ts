import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import prisma from "../../../lib/prisma";
import { IJwtPayload, ILoginPayload, IRegisterPayload } from "./auth.interface";

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
    config.jwt.secret as Secret,
    config.jwt.expires_in as unknown as string,
  );

  return {
    user: sanitizeUser(user),
    token,
  };
};

const login = async (data: ILoginPayload) => {
  const email = data.email;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const token = JwtHelpers.signToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as unknown as string,
  );

  return {
    user: sanitizeUser(user),
    token,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return sanitizeUser(user);
};

export const AuthService = {
  register,
  login,
  getMe,
};
