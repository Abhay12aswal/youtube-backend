import asyncHandler from "../middlewares/asyncHandler.js";
import Video from "../models/Video.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Video file is required");
  }

  // Upload video to Cloudinary
  const videoLocalPath = req.file.path;
  const videoUploadResult = await uploadOnCloudinary(videoLocalPath, "video");

  if (!videoUploadResult.url) {
    throw new ApiError(500, "Error while uploading video");
  }

  // Create video entry in the database
  const video = await Video.create({
    title,
    description,
    videoUrl: videoUploadResult.url,
    user: req.user.id,
  });

  // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});