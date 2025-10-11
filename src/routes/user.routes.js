import { Router } from "express";
import {
  changeCurrentPassword,
  deleteImage,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-cover-image").post(verifyJWT,updateUserCoverImage)
router.route("/update-avatar-image").post(verifyJWT,updateUserAvatar)
router.route("/update-account-detait").post(verifyJWT,updateAccountDetails)
router.route("/get-current-user").post(verifyJWT,getCurrentUser)
router.route("/change-current-password").post(verifyJWT,changeCurrentPassword)

export default router;
