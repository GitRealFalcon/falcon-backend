import { createTweet,editTweet,deleteTweet,getTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const tweetRouter = Router();

tweetRouter.route("/new-tweet").post(verifyJWT,createTweet);
tweetRouter.route("/edit-tweet").patch(verifyJWT,editTweet);
tweetRouter.route("/delete-tweet").delete(verifyJWT,deleteTweet);
tweetRouter.route("/get-tweet").get(verifyJWT,getTweet);

export default tweetRouter;