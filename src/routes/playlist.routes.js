import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addSongs, createPlaylist, getPlaylist, removeSong } from "../controllers/playlist.controller.js";

const PlaylistRouter = Router();

PlaylistRouter.route("/get-playlist").get(getPlaylist)

//secured routes
PlaylistRouter.route("/create-playlist").post(verifyJWT, createPlaylist);
PlaylistRouter.route("/add-song").patch(verifyJWT, addSongs)
PlaylistRouter.route("/add-song").delete(verifyJWT, removeSong)
// Add other playlist routes here, e.g., updatePlaylist, deletePlaylist, etc.

export default PlaylistRouter;