import { Request, Response } from "express";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { ISubmissionPayload } from "./submission.interface";
import { SubmissionService } from "./submission.service";

const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user?.userId as string;
  const payload: ISubmissionPayload = req.body;
  const result = await SubmissionService.createSubmission(studentId, payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project submitted successfully",
    data: result,
  });
});

const getMySubmission = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user?.userId as string;
  const result = await SubmissionService.getMySubmission(studentId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My submission retrieved successfully",
    data: result,
  });
});

export const SubmissionController = {
  createSubmission,
  getMySubmission,
};
