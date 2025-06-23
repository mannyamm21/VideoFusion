import { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import apiClient from "../apiClient";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const TiwttePost = ({ post }) => {
    const [tiwtte, setTiwtte] = useState({});
    const [channel, setChannel] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPost = async () => {
            if (post && post._id) {
                try {
                    setLoading(true);
                    const res = await apiClient.get(`/tiwttes/find/${post._id}`);
                    setTiwtte(res.data);
                    if (res.data.userId) {
                        const channelRes = await apiClient.get(
                            `/users/find/${res.data.userId}`
                        );
                        setChannel(channelRes.data);
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPost();
    }, [post, dispatch]);

    const handleLike = async () => {
        try {
            await apiClient.put(`/users/liketiwtte/${tiwtte._id}`);
            // Update local state optimistically
            setTiwtte(prev => ({
                ...prev,
                likes: prev.likes?.includes(currentUser?.data?.user?._id)
                    ? prev.likes.filter(id => id !== currentUser?.data?.user?._id)
                    : [...(prev.likes || []), currentUser?.data?.user?._id]
            }));
        } catch (error) {
            console.log(error);
            toast.error("You are not Logged In");
        }
    };

    const handleDislike = async () => {
        try {
            await apiClient.put(`/users/disliketiwtte/${tiwtte._id}`);
            // Update local state optimistically
            setTiwtte(prev => ({
                ...prev,
                dislikes: prev.dislikes?.includes(currentUser?.data?.user?._id)
                    ? prev.dislikes.filter(id => id !== currentUser?.data?.user?._id)
                    : [...(prev.dislikes || []), currentUser?.data?.user?._id]
            }));
        } catch (error) {
            console.log(error);
            toast.error("You are not Logged In");
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                      rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 animate-pulse">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                    </div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
                <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            </div>
        );
    }

    if (!tiwtte._id) return null;

    return (
        <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 
                       mb-4 sm:mb-6 overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                    {channel.avatar && (
                        <Link to={`/profile/${channel?._id}`} className="flex-shrink-0">
                            <img
                                src={channel.avatar}
                                alt={`${channel.name}'s avatar`}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover 
                           hover:ring-2 hover:ring-blue-500 transition-all duration-200"
                            />
                        </Link>
                    )}
                    <div className="ml-3 flex-1 min-w-0">
                        <Link
                            to={`/profile/${channel?._id}`}
                            className="block hover:underline"
                        >
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white 
                           truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {channel.name}
                            </h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {format(tiwtte?.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <Link
                    to={`/tiwtte/${tiwtte?._id}`}
                    className="block group"
                >
                    <div className="mb-4">
                        <p className="text-gray-900 dark:text-white text-sm sm:text-base leading-relaxed 
                         whitespace-pre-wrap group-hover:text-gray-700 dark:group-hover:text-gray-200 
                         transition-colors">
                            {tiwtte?.desc}
                        </p>
                    </div>

                    {/* Image */}
                    {tiwtte?.postImage && (
                        <div className="mb-4 -mx-4 sm:-mx-6">
                            <img
                                src={tiwtte?.postImage}
                                alt="Tiwtte post"
                                className="w-full max-h-64 sm:max-h-80 object-cover 
                           group-hover:opacity-95 transition-opacity duration-200"
                            />
                        </div>
                    )}
                </Link>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        {/* Like Button */}
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={handleLike}
                                className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 
                           transition-colors group"
                                aria-label="Like post"
                            >
                                {tiwtte?.likes?.includes(currentUser?.data?.user?._id) ? (
                                    <ThumbUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                ) : (
                                    <ThumbUpOutlinedIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 
                                                 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                )}
                            </button>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-[20px]">
                                {tiwtte?.likes?.length || 0}
                            </span>
                        </div>

                        {/* Dislike Button */}
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={handleDislike}
                                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 
                           transition-colors group"
                                aria-label="Dislike post"
                            >
                                {tiwtte?.dislikes?.includes(currentUser?.data?.user?._id) ? (
                                    <ThumbDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                                ) : (
                                    <ThumbDownOffAltOutlinedIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 
                                                         group-hover:text-red-600 dark:group-hover:text-red-400" />
                                )}
                            </button>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-[20px]">
                                {tiwtte?.dislikes?.length || 0}
                            </span>
                        </div>

                        {/* Comments */}
                        <Link
                            to={`/tiwtte/${tiwtte?._id}`}
                            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 
                         transition-colors group"
                        >
                            <QuestionAnswerIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 
                                           group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 
                             group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {tiwtte?.comments?.length || 0}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default TiwttePost;