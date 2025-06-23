import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import apiClient from "../apiClient";

const Card = ({ video }) => {
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchChannel = async () => {
            if (video && video.userId) {
                try {
                    const res = await apiClient.get(`/users/find/${video.userId}`);
                    setChannel(res.data);
                } catch (error) {
                    console.error("Error fetching channel:", error);
                }
            }
        };
        fetchChannel();
    }, [video]);

    if (!video) {
        return null;
    }

    return (
        <Link
            to={`/video/${video._id}`}
            className="w-full max-w-sm mx-auto sm:mx-0 sm:w-[360px] mb-4 sm:mb-6 cursor-pointer block"
        >
            {/* Thumbnail */}
            <div className="relative w-full pb-[56.25%] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                    src={video?.imgUrl}
                    alt={video.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            </div>

            {/* Video Details */}
            <div className="flex mt-2 sm:mt-3 gap-2 sm:gap-3 px-1 sm:px-0">
                {/* Channel Image */}
                <div className="flex-shrink-0">
                    <img
                        src={channel?.avatar}
                        alt={channel.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300 dark:bg-gray-600"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">
                        {video.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {channel?.name}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{video?.views} views</span>
                        <span className="mx-1">•</span>
                        <span>{format(video?.createdAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Card;