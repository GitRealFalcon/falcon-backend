import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../cloudinary.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user detail from frontend
  //validation - not empty
  //check if user already exist: username email
  //check for images -check for avatar
  //upload them to cloudinary -avatar
  //create user object -  create entry in db
  //remove password and referesh token field from response
  //check for user creation
  //return response

  const { fullname, email, username, password } = req.body;
  console.log("email:", email);

  if (
    [fullname, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "all feilds are required");
  }

    const existingUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if(existingUser){
    throw new ApiError(409, "user with email or username already exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }

 const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage.url  || "",
    email,
    password,
    username: username.toLowercase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
  )

});

export { registerUser };
