import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateVideo,
  uploadVideo,
} from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route("/get-videos").get(getAllVideos);
videoRouter.route("/get-videos-id/:videoId").get(getVideoById);

//secure routes
videoRouter.route("/upload").post(  verifyJWT,upload.single("videoFile"), uploadVideo);
videoRouter.route("/update/:videoId").patch( verifyJWT,upload.single("thumbnail"), updateVideo);
videoRouter.route("/delete/:videoId").delete(verifyJWT, deleteVideo);
videoRouter.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default videoRouter;
