import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
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

const UserRouter = Router();

UserRouter.route("/register").post(
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

UserRouter.route("/login").post(loginUser);

//secured routes
UserRouter.route("/logout").post(verifyJWT, logoutUser);

UserRouter.route("/refresh-token").post(refreshAccessToken);
UserRouter
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
UserRouter
  .route("/update-avatar-image")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
UserRouter.route("/update-account-detail").patch(verifyJWT, updateAccountDetails);
UserRouter.route("/get-current-user").get(verifyJWT, getCurrentUser);
UserRouter.route("/change-current-password").post(verifyJWT, changeCurrentPassword);
UserRouter.route("/channel/:username").get(getUserChannelProfile);
UserRouter.route("/:channelId").post(verifyJWT, subscribeToChannel);
UserRouter.route("/:channelId").delete(verifyJWT, unsubscribeToChannel);
UserRouter.route("/history").get(verifyJWT,getWatchHistory)

export default UserRouter;