import { createComment, deleteComment, editComment, getComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const CommentRouter = Router()

 CommentRouter.route("/get-comments").get(getComments)
//secure routes
CommentRouter.route("/new-comment").post(verifyJWT,createComment);
CommentRouter.route("/edit-comment").patch(verifyJWT,editComment);
CommentRouter.route("/delete-comment").delete(verifyJWT,deleteComment);


export default CommentRouter