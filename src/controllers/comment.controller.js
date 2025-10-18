import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import mongoose from "mongoose";

const createComment = asyncHandler(async (req, res) => {
  const { videoId, content } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  if (!content.trim()) {
    throw new ApiError(400, "content is empty");
  }

  const newComment = await Comment.create({
    video: videoId,
    owner: userId,
    content: content,
  });

  if (!newComment) {
    throw new ApiError(500, "Comment creation failed!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully comment!"));
});

const editComment = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  if (!content.trim()) {
    throw new ApiError(400, "content is empty");
  }

  const editedComment = await Comment.findOneAndUpdate(
    {
      owner: userId,
      video: videoId,
    },
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  if (!editComment) {
    throw new ApiError(500, "comment edit failed!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment edit successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const deletedComment = await Comment.findOneAndDelete({
    video: videoId,
    owner: userId,
  });

  if (!deleteComment) {
    throw new ApiError(500, "Comment deletetion failed!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment delete successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  let {
    videoId,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortType = "asc",
  } = req.body;

  const loggedInUser = req.user?._id;
  page = parseInt(page);
  limit = parseInt(limit);
  sortType = sortType === "asc" ? 1 : -1;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(200, "invalid video Id");
  }

  const match = {};

  match.video = new mongoose.Types.ObjectId(videoId);

  const allCommentsAggregate =
   Comment.aggregate([
    {
      $match: match,
    },
     {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        isLiked: {
          $in: [new mongoose.Types.ObjectId(loggedInUser), "$likes.likeBy"],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project:{
        content:1,
        _id:1,
        likeCount:1,
        isLiked:1,
        ownerDetails:1
      }
    },
   
    {
      $sort: { [sortBy || "createdAt"]: sortType || -1 },
    },
  ]);

  const options = { page, limit };

  const Comments = await Comment.aggregatePaginate(
    allCommentsAggregate,
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, Comments, "Comments fetched successfully"));
});

export { createComment, editComment, deleteComment, getComments };
