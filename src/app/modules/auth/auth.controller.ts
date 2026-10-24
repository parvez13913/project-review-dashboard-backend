import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await AuthService.register({ name, email, password });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.login({ email, password });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

export const AuthController = {
  register,
  login,
};
