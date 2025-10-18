import { getLike, newLike, unLike } from "../controllers/like.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const likeRouter = Router();

likeRouter.route("/new-like").post(verifyJWT,newLike);
likeRouter.route("/unlike").delete(verifyJWT,unLike);
likeRouter.route("/get-likes").get(verifyJWT,getLike);

export default likeRouter