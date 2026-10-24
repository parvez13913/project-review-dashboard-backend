import express from "express";

import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", auth("STUDENT", "ADMIN"), AuthController.getMe);

export const AuthRouter = router;
