
import { User } from "../models/User.js"
import { Video } from "../models/Video.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/Firebase.js';

export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {
                new: true
            });
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error)
        }
    } else {
        throw new ApiError(403, "You can update only your account")
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted")
        } catch (error) {
            next(error)
        }
    } else {
        throw new ApiError(403, "You can deleted only your account")
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 },
        });
        res.status(200).json("Subscription Successfull.")
    } catch (error) {
        next(error)
    }
}

export const unsubcribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 },
        });
        res.status(200).json("Unsubscription Successfull.")
    } catch (error) {
        next(error)
    }
}

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })
        res.status(200).json("The video has been liked.")
    } catch (error) {
        next(error);
    }
};

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json("The video has been Disliked.")
    } catch (error) {
        next(error);
    }
}

export const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar || !avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        )
});

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { username: { $regex: query, $options: "i" } }
            ]
        }).limit(40);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

// Save video method
export const saveVideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const videoId = req.params.videoId;

        if (user.savedVideos.includes(videoId)) {
            return res.status(400).json({ message: "Video already saved" });
        }

        user.savedVideos.push(videoId);
        await user.save();

        res.status(200).json({ message: "Video saved successfully" });
    } catch (error) {
        next(error);
    }
};

export const unsaveVideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const videoId = req.params.videoId;

        user.savedVideos = user.savedVideos.filter(id => id.toString() !== videoId);
        await user.save();

        res.status(200).json({ message: "Video unsaved successfully" });
    } catch (error) {
        next(error);
    }
};


// Function to get saved videos
export const getSavedVideos = async (req, res) => {
    const userId = req.params.id; // Assuming user ID is passed as a URL parameter

    try {
        const user = await User.findById(userId).select('savedVideos').populate('savedVideos'); // Populate if you want video details
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.savedVideos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};