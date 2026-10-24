import express from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { ReviewRouter } from "../modules/review/review.route";
import { SubmissionRouter } from "../modules/submission/submission.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/submission",
    route: SubmissionRouter,
  },
  {
    path: "/review",
    route: ReviewRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
