import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

import {
  userAssignRoleValidator,
  userLoginValidator,
  userRegisterValidator,
} from "../validators/user.validators.js";

import { validate } from "../validators/validate.js";

const router = Router();

// Unsecured route
router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userLoginValidator(), validate, loginUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(verifyJWT, getCurrentUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
