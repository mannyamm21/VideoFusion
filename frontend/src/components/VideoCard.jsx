import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import apiClient from "../apiClient";

const VideoCard = ({ type, videoId }) => {
    const [channel, setChannel] = useState({});
    const [video, setVideo] = useState({});

    useEffect(() => {
        const fetchVideoAndChannel = async () => {
            try {
                // Fetch the video first
                const videoRes = await apiClient.get(`/videos/find/${videoId}`);
                setVideo(videoRes.data);
                // Then fetch the channel based on the video userId
                if (videoRes?.data?.userId) {
                    const channelRes = await apiClient.get(
                        `/users/find/${videoRes.data.userId}`
                    );
                    setChannel(channelRes.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchVideoAndChannel();
    }, [videoId]);

    if (!video) {
        return null;
    }

    return (
        <Link to={`/video/${video?._id}`} className="no-underline">
            <div
                className={`
          cursor-pointer
          ${type !== "sm"
                        ? "w-full max-w-[360px] mb-6 block"
                        : "w-full mb-3 flex gap-3"
                    }
          
          /* Mobile First - Small screens */
          ${type !== "sm"
                        ? "sm:w-full sm:max-w-none"
                        : "flex-col xs:flex-row gap-2 xs:gap-3"
                    }
          
          /* Tablet */
          md:${type !== "sm" ? "w-full max-w-[320px]" : "flex-row gap-3"}
          
          /* Desktop */
          lg:${type !== "sm" ? "w-full max-w-[360px]" : "flex-row gap-4"}
          
          /* Large Desktop */
          xl:${type !== "sm" ? "w-full max-w-[380px]" : "flex-row gap-4"}
        `}
            >
                {/* Video Thumbnail */}
                <div
                    className={`
            relative overflow-hidden rounded-xl bg-gray-300 dark:bg-gray-700
            ${type === "sm"
                            ? "w-full xs:w-40 sm:w-44 md:w-48 lg:w-52 h-24 xs:h-28 sm:h-32 md:h-36 flex-shrink-0"
                            : "w-full h-48 xs:h-52 sm:h-56 md:h-48 lg:h-52 xl:h-56"
                        }
          `}
                >
                    <img
                        src={video?.imgUrl}
                        alt={video?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />

                    {/* Video Duration Overlay (optional) */}
                    {video?.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                        </div>
                    )}
                </div>

                {/* Video Details */}
                <div
                    className={`
            flex gap-3
            ${type !== "sm"
                            ? "mt-4 flex-row"
                            : "mt-2 xs:mt-0 flex-col xs:flex-row flex-1"
                        }
          `}
                >
                    {/* Channel Avatar */}
                    <div
                        className={`
              flex-shrink-0
              ${type === "sm" ? "hidden xs:block" : "block"}
            `}
                    >
                        <img
                            src={channel?.avatar}
                            alt={channel?.name}
                            className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 object-cover"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                        {/* Video Title */}
                        <h3
                            className={`
                font-medium text-gray-900 dark:text-white line-clamp-2
                ${type === "sm"
                                    ? "text-sm xs:text-base leading-tight"
                                    : "text-base lg:text-lg leading-snug"
                                }
                mb-1 xs:mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors
              `}
                            title={video?.title}
                        >
                            {video?.title}
                        </h3>

                        {/* Channel Name */}
                        <p
                            className={`
                text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors
                ${type === "sm" ? "text-xs xs:text-sm" : "text-sm"}
                mb-1 truncate
              `}
                        >
                            {channel?.name}
                        </p>

                        {/* Video Info */}
                        <div
                            className={`
                text-gray-600 dark:text-gray-400
                ${type === "sm" ? "text-xs" : "text-sm"}
                flex flex-wrap items-center gap-1
              `}
                        >
                            <span>{video?.views?.toLocaleString()} views</span>
                            <span className="hidden xs:inline">•</span>
                            <span className="xs:inline block">
                                {format(video?.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;