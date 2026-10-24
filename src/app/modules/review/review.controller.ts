import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../lib/catchAsync";
import sendResponse from "../../../lib/sendResponse";
import { ReviewService } from "./review.service";

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllSubmissions(req.query as any);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Submissions retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const reviewSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reviewNote } = req.body;

  const result = await ReviewService.reviewSubmission(
    id as string,
    status,
    reviewNote,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Submission status updated successfully",
    data: result,
  });
});

const getSubmissionStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getSubmissionStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  getAllSubmissions,
  reviewSubmission,
  getSubmissionStats
};
