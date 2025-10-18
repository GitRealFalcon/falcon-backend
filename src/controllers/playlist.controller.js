import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, discription, videoId } = req.body;
  const userId = req.user?._id;

  if (!(name || discription)) {
    throw new ApiError(400, "Name and Discription is required");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  const playlist = await Playlist.create({
    name,
    discription,
    videos: videoId,
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist created successfully"));
});

const addSongs = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user?._id;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }

  // Ensure the video exists
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  // Add the video (prevent duplicates)
  const updatedPlaylist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: userId,
    },
    {
      $addToSet: { videos: videoId },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or not owned by user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video added successfully"));
});

const removeSong = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user?._id;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }

  // Ensure the video exists
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  const deleteVideoPlaylist = await Playlist.findOneAndUpdate(
    {
      owner: userId,
      _id: playlistId,
    },
    {
      $pull: { videos: videoId },
    },
    { new: true }
  );

  if (!deleteVideoPlaylist) {
    throw new Error("Playlist not found or video not in playlist.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deleteVideoPlaylist, "video removed successfully")
    );
});

const getPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, userId } = req.body;
  const match = {};

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(playlistId) &&
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw new ApiError(400, "Invalid playlist or user ID");
  }

  if (playlistId?.trim()) {
    match._id = new mongoose.Types.ObjectId(playlistId);
  }

  if (userId) {
    match.owner = new mongoose.Types.ObjectId(userId);
  }


  const findPlaylist = await Playlist.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "videos",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
              as: "owner",
             
            },
          },
          {
            $unwind: "$owner"
          },
          {
            $project:{
              title:1,
              description:1,
              videoFile:1,
              thumbnail:1,
              views:1,
              duration:1,
              isPublished:1,
              "owner.fullname":1,
              "owner.username":1,
              "owner.avatar":1
              

            }
          }
          
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      $project: {
        name: 1,
        videos: 1,
        discription: 1,
        "ownerDetails.fullname": 1,
        "ownerDetails.avatar": 1,
        "ownerDetails.username": 1,
      },
    },
  ]);

  if (!findPlaylist || findPlaylist.length === 0) {
    throw new ApiError(404, "Playlist Not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, findPlaylist, "playlist fetched successfully"));
});

export { createPlaylist, addSongs, removeSong, getPlaylist };
