import express from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { SubmissionController } from "./submission.controller";
import { submissionLimiter } from "./submission.utils";

const router = express.Router();

router.post(
  "/create-submission",
  auth(Role.STUDENT),
  submissionLimiter,
  SubmissionController.createSubmission,
);

router.get(
  '/my-submission',
  auth(Role.STUDENT),
  SubmissionController.getMySubmission
);

export const SubmissionRouter = router;
