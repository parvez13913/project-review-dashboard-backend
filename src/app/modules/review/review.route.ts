import express from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.get(
  "/all-submissions",
  auth(Role.ADMIN),
  ReviewController.getAllSubmissions,
);

router.get("/stats", auth(Role.ADMIN), ReviewController.getSubmissionStats);

router.patch(
  "/:id/review",
  auth(Role.ADMIN),
  ReviewController.reviewSubmission,
);

export const ReviewRouter = router;
