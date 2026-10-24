import express from "express";
import { AuthRouter } from "../modules/auth/auth.route";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
