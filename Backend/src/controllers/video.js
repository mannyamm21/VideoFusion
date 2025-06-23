import { Video } from '../models/Video.js';
import { User } from '../models/User.js';

// Assuming you have an ApiError class - add this if missing
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save();
        // Update user's videos array
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { videos: savedVideo._id }
        });
        res.status(200).json(savedVideo);
    } catch (error) {
        next(error);
    }
};

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) throw new ApiError(404, "Video not found!");
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id, // Fixed: was req.body.id
                {
                    $set: req.body,
                }, {
                new: true
            }
            );
            res.status(200).json(updatedVideo);
        } else {
            throw new ApiError(403, "You can update only your video!");
        }
    } catch (error) {
        next(error);
    }
};

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) throw new ApiError(404, "Video not found!");
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id); // Fixed: was req.body.id

            // Remove video from user's videos array
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { videos: req.params.id }
            });

            res.status(200).json("The video has been deleted"); // Fixed typo
        } else {
            throw new ApiError(403, "You can delete only your video!"); // Fixed message
        }
    } catch (error) {
        next(error);
    }
};

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) throw new ApiError(404, "Video not found!");
        res.status(200).json(video);
    } catch (error) {
        next(error);
    }
};

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id,
            { $inc: { views: 1 } }
        );
        res.status(200).json("The view has been increased");
    } catch (error) {
        next(error);
    }
};

export const random = async (req, res, next) => {
    try {
        // Fixed: Use MongoDB's $sample for true random selection
        const videos = await Video.aggregate([
            { $sample: { size: 20 } }
        ]);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                return await Video.find({ userId: channelId });
            })
        );

        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
};

export const getBytag = async (req, res, next) => {
    try {
        if (!req.query.tags) {
            throw new ApiError(400, "Tags parameter is required");
        }
        const tags = req.query.tags.split(",").map(tag => tag.trim());
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const getByMultipleTags = async (req, res, next) => {
    try {
        if (!req.query.tags) {
            throw new ApiError(400, "Tags parameter is required");
        }
        const tags = req.query.tags.split(',').map(tag => tag.trim());
        const videos = await Video.find({ tags: { $all: tags } }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const search = async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
                data: []
            });
        }

        const videos = await Video.find({
            $or: [
                { title: { $regex: query.trim(), $options: "i" } },
                { desc: { $regex: query.trim(), $options: "i" } },
                { tags: { $in: [new RegExp(query.trim(), "i")] } }
            ]
        }).limit(40);

        res.status(200).json({
            success: true,
            message: "Search results",
            data: videos
        });
    } catch (error) {
        next(error);
    }
};

// In your videoController.js
export const getSearchSuggestions = async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query || query.trim() === '') {
            return res.status(200).json([]);
        }

        const videos = await Video.find({
            $or: [
                { title: { $regex: query.trim(), $options: "i" } },
                { tags: { $in: [new RegExp(query.trim(), "i")] } }
            ]
        })
            .select('title tags')
            .limit(5);

        const suggestions = [...new Set([

            ...videos.map(v => v.title),
            ...videos.flatMap(v => v.tags)
        ])].slice(0, 5);

        res.status(200).json(suggestions);
    } catch (error) {
        next(error);
    }
};

export const getByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;
        if (!category) {
            throw new ApiError(400, "Category parameter is required");
        }
        const videos = await Video.find({ category: category }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};