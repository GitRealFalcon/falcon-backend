import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  subscribeToChannel,
  unsubscribeToChannel,
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
router
  .route("/update-cover-image")
  .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router
  .route("/update-avatar-image")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-account-detail").post(verifyJWT, updateAccountDetails);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/change-current-password").post(verifyJWT, changeCurrentPassword);
router.route("/:username/channel").get(getUserChannelProfile);
router.route("/:channelId").post(verifyJWT, subscribeToChannel);
router.route("/:channelId").delete(verifyJWT, unsubscribeToChannel);

export default router;
