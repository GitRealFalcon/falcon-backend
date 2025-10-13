import mongoose from "mongoose";


const likeSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: mongoose.type.ObjectId,
      ref: "Tweet",
    },
    likeBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


export const Like = mongoose.model("like", likeSchema);
