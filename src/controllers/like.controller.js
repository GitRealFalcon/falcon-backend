import {Like} from "../models/like.model.js";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const newLike = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.body;
  const userId = req.user?._id;

  const match = {
    likeBy: userId,
  };
  if (videoId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(videoId)) {
      match.video = videoId;
    } else {
      throw new ApiError(400, "invalid video Id");
    }
  }

  if (commentId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(commentId)) {
      match.comment = commentId;
    } else {
      throw new ApiError(400, "invalid video Id");
    }
  }

  if (tweetId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(tweetId)) {
      match.tweet = tweetId;
    } else {
      throw new ApiError(400, "invalid video Id");
    }
  }

  const createLike = await Like.create(
    match,
  );

  if (!createLike) {
    throw new ApiError(500, "Like faield");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createLike, "liked successfully"));
});

const unLike = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.body;
  const userId = req.user?._id;

  const match = {
    likeBy: userId,
  };
  if (videoId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(videoId)) {
      match.video = videoId;
    } else {
      throw new ApiError(400, "invalid video Id");
    }
  }

  if (commentId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(commentId)) {
      match.comment = commentId
    } else {
      throw new ApiError(400, "invalid video Id");
    }
  }

  if (tweetId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(tweetId)) {
      match.tweet = tweetId
    } else {
      throw new ApiError(400, "invalid video Id");
    }
  }

  console.log(match);
  

  const deleteLike = await Like.findOneAndDelete(
    match,
  );

  if (!deleteLike) {
    throw new ApiError(500, "unliked failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteLike, "unliked successfully"));
});

const getLike = asyncHandler(async (req, res) => {
  const { videoId, commentId, tweetId } = req.body;
  const userId = req.user?._id;

  const match = {};

  if (videoId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(videoId)) {
      match.video = new mongoose.Types.ObjectId(videoId);
    } else {
      throw new ApiError(400, "Invalid video ID");
    }
  }

  if (commentId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(commentId)) {
      match.comment = new mongoose.Types.ObjectId(commentId);
    } else {
      throw new ApiError(400, "Invalid comment ID");
    }
  }

  if (tweetId?.trim()) {
    if (mongoose.Types.ObjectId.isValid(tweetId)) {
      match.tweet = new mongoose.Types.ObjectId(tweetId);
    } else {
      throw new ApiError(400, "Invalid tweet ID");
    }
  }

  // Aggregation
  const result = await Like.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        likeCount: { $sum: 1 },
        likedUsers: { $addToSet: "$likeBy" },
      },
    },
    {
      $addFields: {
        isLiked: {
          $in: [new mongoose.Types.ObjectId(userId), "$likedUsers"],
        },
      },
    },
    {
      $project: {
        _id: 0,
        likeCount: 1,
        isLiked: 1,
      },
    },
  ]);

  // If no likes yet, handle default values
  const response = result[0] || { likeCount: 0, isLiked: false };

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Like data fetched successfully"));
});


export { newLike, unLike, getLike };
