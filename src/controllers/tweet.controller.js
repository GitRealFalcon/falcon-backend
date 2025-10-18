import { Tweet } from "../models/tweet.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user?._id;

  if (!content) {
    throw new ApiError(400, "Content is empty");
  }

  const newTweet = await Tweet.create({
    content,
    owner: userId,
  });

  if (!newTweet) {
    throw new ApiError(500, "Tweet failed!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newTweet, "Tweet created successfully"));
});

const editTweet = asyncHandler(async (req, res) => {
  const { content, tweetId } = req.body;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "invalid tweet Id");
  }
  if (!content) {
    throw new ApiError(400, "content empty");
  }

  const editedTweet = await Tweet.findOneAndUpdate(
    {
      _id: tweetId,
      owner: userId,
    },
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!editTweet) {
    throw new ApiError(500, "edit failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, editTweet, "tweet edit successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const deleteTweet = await Tweet.findOneAndDelete({
    owner: userId,
    _id: tweetId,
  });

  if (!deleteTweet) {
    throw new ApiError(500, "tweet delete failed");
  }

  return res.status(200).json(200, "tweet delete successfully");
});

const getTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const match = { owner: userId };
  const Tweets = await Tweet.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "ownerDetail",
        pipeline: [
          {
            $project: {
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },{
        $project:{
            content:1,
            _id:1,
            likeCount:1,
            ownerDetail:1
        }
    }
  ]);

  if (!Tweets) {
    throw new ApiError(500, "get tweet failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Tweets, "tweet fetched successfully"));
});

export { createTweet, editTweet, deleteTweet, getTweet };
