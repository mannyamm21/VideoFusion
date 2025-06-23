import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../apiClient";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { like, dislike, fetchSuccess, fetchFailure } from "../Context/Tiwtte";
import { format } from "timeago.js";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import TiwtteComments from "../components/TiwtteComments";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditTiwtte from "../components/EditTiwtte";

export default function TiwttePage() {
    const [tiwtte, setTiwtte] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [channel, setChannel] = useState({});
    const dispatch = useDispatch();
    const [open1, setOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const { tiwttes } = useSelector((state) => state.tiwtte);

    // Menu state management
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await apiClient.get(`/tiwttes/find/${id}`);
                setTiwtte(res.data);
                if (res.data.userId) {
                    const channelRes = await apiClient.get(
                        `/users/find/${res.data.userId}`
                    );
                    setChannel(channelRes.data);
                    dispatch(fetchSuccess(res.data));
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                dispatch(fetchFailure());
            }
        };
        fetchPost();
    }, [id, dispatch]);

    if (!tiwtte) return null;

    const handleLike = async () => {
        try {
            await apiClient.put(`/users/liketiwtte/${tiwtte._id}`);
            dispatch(like(currentUser?.data?.user?._id));
        } catch (error) {
            console.log(error);
            toast.error("You are not Logged In", error);
        }
    };

    const handleDislike = async () => {
        try {
            await apiClient.put(`/users/disliketiwtte/${tiwtte._id}`);
            dispatch(dislike(currentUser?.data?.user?._id));
        } catch (error) {
            console.log(error);
            toast.error("You are not Logged In");
        }
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/tiwttes/${tiwtte._id}`);
            toast.success("Tiwtte has been deleted");
            navigate("/all");
        } catch (error) {
            console.log(error);
            toast.error("Tiwtte has not been deleted");
        }
    };

    if (!tiwtte) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900 px-4">
                <div className="text-gray-600 dark:text-gray-400 text-lg">
                    Tiwtte not found
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
            {/* Main Content Container */}
            <div className="max-w-4xl mx-auto">
                {/* Post Container */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6 overflow-hidden">
                    <div className="p-4 sm:p-6">
                        {/* Channel Info Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center flex-1 min-w-0">
                                {channel.avatar && (
                                    <img
                                        src={channel.avatar}
                                        alt="Channel Avatar"
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <Link to={`/profile/${channel?._id}`}>
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                                            {channel.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {format(tiwtte?.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Menu Button */}
                            {currentUser?.data?.user?._id === tiwttes?.userId && (
                                <div className="ml-3 flex-shrink-0">
                                    <button
                                        onClick={handleMenuClick}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <MoreVertIcon className="text-gray-500 dark:text-gray-400" />
                                    </button>
                                    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                        <MenuItem onClick={() => setOpen(true)}>Edit</MenuItem>
                                    </Menu>
                                </div>
                            )}
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                            <p className="text-gray-900 dark:text-white text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                                {tiwtte?.desc}
                            </p>
                        </div>

                        {/* Post Image */}
                        {tiwtte?.postImage && (
                            <div className="mb-4">
                                <img
                                    src={tiwtte?.postImage}
                                    alt="Tiwtte Post"
                                    className="w-full max-h-96 sm:max-h-[500px] object-contain rounded-lg bg-gray-50 dark:bg-gray-700"
                                />
                            </div>
                        )}

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            {/* Like/Dislike Section */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={handleLike}
                                        className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                                    >
                                        {tiwttes?.likes?.includes(currentUser?.data?.user?._id) ? (
                                            <ThumbUpIcon className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                                        ) : (
                                            <ThumbUpOutlinedIcon className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 w-5 h-5" />
                                        )}
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[20px]">
                                        {tiwttes?.likes?.length || 0}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={handleDislike}
                                        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                                    >
                                        {tiwttes?.dislikes?.includes(currentUser?.data?.user?._id) ? (
                                            <ThumbDownAltIcon className="text-red-600 dark:text-red-400 w-5 h-5" />
                                        ) : (
                                            <ThumbDownOffAltIcon className="text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 w-5 h-5" />
                                        )}
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[20px]">
                                        {tiwttes?.dislikes?.length || 0}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <QuestionAnswerIcon className="text-gray-500 dark:text-gray-400 w-5 h-5" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {tiwttes?.comments?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Reply Button */}
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <ReplyOutlinedIcon className="text-gray-500 dark:text-gray-400 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="">
                    <TiwtteComments tiwtteId={tiwttes?._id} />
                </div>
            </div>

            {/* Edit Modal */}
            {open1 && <EditTiwtte tiwtteId={tiwttes?._id} setOpen={setOpen} />}
        </div>
    );
}