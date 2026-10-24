import express from "express";

import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";
import { Role } from "../../../generated/prisma/browser";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", auth(Role.STUDENT, Role.ADMIN), AuthController.getMe);

export const AuthRouter = router;
