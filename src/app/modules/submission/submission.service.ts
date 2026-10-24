import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Submission } from "../../../generated/prisma/client";
import prisma from "../../../lib/prisma";
import { ISubmissionPayload } from "./submission.interface";

const createSubmission = async (
  studentId: string,
  payload: ISubmissionPayload,
): Promise<Submission> => {
  const existingSubmission = await prisma.submission.findUnique({
    where: { studentId },
  });

  if (existingSubmission) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You have already submitted a project. Duplicate submissions are not allowed.",
    );
  }

  return await prisma.submission.create({
    data: {
      ...payload,
      studentId,
    },
  });
};

const getMySubmission = async (
  studentId: string,
): Promise<Submission | null> => {
  return await prisma.submission.findUnique({
    where: { studentId },
  });
};

export const SubmissionService = {
  createSubmission,
  getMySubmission,
};
