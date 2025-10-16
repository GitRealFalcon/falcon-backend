import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadOnCloudinary, deleteCloudinary } from "../cloudinary.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "asc",
    userId,
  } = req.query;

  // Convert to correct types
  page = parseInt(page);
  limit = parseInt(limit);
  sortType = sortType === "asc" ? 1 : -1;

  // ✅ Step 1: Build $match condition
  const match = {};

  // Search by title or description (case-insensitive)
  if (query?.trim()) {
    match.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // Filter by specific user’s videos
  if (userId) {
    match.owner = new mongoose.Types.ObjectId(userId);
  }

  // ✅ Step 2: Create aggregation pipeline
  const aggrigate = Video.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        "ownerDetails.username": 1,
        "ownerDetails.fullname": 1,
        "ownerDetails.avatar": 1,
      },
    },
    { $sort: { [sortBy]: sortType } },
  ]);

  // ✅ Step 3: Apply pagination
  const options = { page, limit };

  const result = await Video.aggregatePaginate(aggrigate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Videos fetched successfully"));
});

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoFileLocalPath = req.file?.path;

  if (!videoFileLocalPath) {
    throw new ApiError(404, "Video file required");
  }

  const cloudinariVideoResponse = await uploadOnCloudinary(videoFileLocalPath);

  if (!cloudinariVideoResponse) {
    throw new ApiError(400, "cloudinari upload error");
  }

  const result = await Video.create({
    videoFile: [
      {
        secure_url: cloudinariVideoResponse.secure_url,
        public_id: cloudinariVideoResponse.public_id,
      },
    ],
    owner: req.user?._id,
    title,
    description,
    duration: cloudinariVideoResponse.duration,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "video upload successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId?.trim()) {
    throw new ApiError(400, "video id is empity");
  }

  const video = await Video.aggregate([
    {
      $match: {
        videoFile: {
          $elemMatch: { public_id: videoId },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $addFields: {
        secure_url: { $first: "$videoFile.secure_url" },
        public_id: { $first: "$videoFile.public_id" },
      },
    },
    {
      $project: {
        public_id: 1,
        secure_url: 1,
        thumbnail: 1,
        title: 1,
        views: 1,
        duration: 1,
        description: 1,
        isPublished: 1,
        "ownerDetails.username": 1,
        "ownerDetails.fullname": 1,
        "ownerDetails.avatar": 1,
      },
    },
  ]);

  if (!video[0]) {
    throw new ApiError(404,"Video not found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const userId = req.user?._id;
  const thumbnailLocalPath = req.file?.path;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "all fields are required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail required");
  }

  const thumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalPath);

  const update = await Video.findOneAndUpdate(
    {
      "videoFile.public_id": videoId,
      owner: userId,
    },

    {
      $set: {
        title,
        description,
        thumbnail: thumbnailCloudinary,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, update, "update successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const deletedVideo = await Video.findOneAndDelete({
    owner: userId,
    "videoFile.public_id": videoId,
  });

  if (!deletedVideo) {
    throw new ApiError(404, "Video not found or you are not the owner");
  }

  const cloudinaryRes = await deleteCloudinary(videoId);

  if (!cloudinaryRes) {
    throw new ApiError(500, "Failed to delete video from Cloudinary");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "video delete successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const publishStatus = await Video.findOneAndUpdate(
    {
      owner: userId,
      "videoFile.public_id": videoId,
    },
    [
      {
        $set: {
          isPublished: { $not: ["$isPublished"] }, // ✅ valid toggle
        },
      },
    ],
    {
      new: true,
    }
  );

  if (!publishStatus) {
    throw new ApiError(404, "Video not found or you are not the owner");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "toggle update successfully"));
});

export {
  getAllVideos,
  uploadVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
