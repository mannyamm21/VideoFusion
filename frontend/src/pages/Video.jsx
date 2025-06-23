import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import { fetchSuccess, like, dislike } from "../Context/VideoSlice";
import { subscription, addSavedVideo } from "../Context/userSlice";
import { toast } from "react-hot-toast";
import {
    ThumbUpOutlined as ThumbUpOutlinedIcon,
    ThumbDownOffAltOutlined as ThumbDownOffAltOutlinedIcon,
    ReplyOutlined as ReplyOutlinedIcon,
    AddTaskOutlined as AddTaskOutlinedIcon,
    ThumbDown as ThumbDownIcon,
    ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
import Recommendation from "../components/Recommendation";
import Comments from "../components/Comments";
import ShareModal from "../components/ShareModal";
import apiClient from "../apiClient";

export default function Video() {
    const { currentUser } = useSelector((state) => state.user);
    const { currentVideo } = useSelector((state) => state.video);
    const dispatch = useDispatch();
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState({});
    const [isSaved, setIsSaved] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await apiClient.get(`/videos/find/${path}`);
                const channelRes = await apiClient.get(
                    `/users/find/${videoRes.data.userId}`
                );
                setChannel(channelRes.data);
                dispatch(fetchSuccess(videoRes.data));
                setIsSaved(
                    currentUser?.data?.user?.savedVideos?.includes(videoRes.data._id)
                );
                setIsSubscribed(
                    currentUser?.data?.user?.subscribedUsers?.includes(
                        channelRes.data._id
                    )
                );
                await apiClient.put(`/videos/view/${videoRes.data._id}`);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [path, dispatch, currentUser]);

    const handleLike = async () => {
        try {
            await apiClient.put(`/users/like/${currentVideo._id}`);
            dispatch(like(currentUser?.data?.user?._id));
        } catch (error) {
            console.log("You are not Logged In");
            toast.error("You are not Logged In");
        }
    };

    const handleDislike = async () => {
        try {
            await apiClient.put(`/users/dislike/${currentVideo._id}`);
            dispatch(dislike(currentUser?.data?.user?._id));
        } catch (error) {
            console.log("You are not Logged In");
            toast.error("You are not Logged In");
        }
    };

    const handleSub = async () => {
        try {
            const action = isSubscribed ? "unsub" : "sub";
            await apiClient.put(`/users/${action}/${channel._id}`);
            dispatch(subscription(channel._id));
            setIsSubscribed(!isSubscribed);
        } catch (error) {
            console.log("You are not Logged In");
            toast.error("You are not Logged In");
        }
    };

    const handleSaveVideo = async () => {
        if (!currentUser || !currentVideo) return;

        const isCurrentlySaved = currentUser?.data?.user?.savedVideos?.includes(
            currentVideo._id
        );

        if (!isCurrentlySaved) {
            try {
                await apiClient.put(`/users/savedVideos/${currentVideo?._id}`);
                dispatch(
                    addSavedVideo([
                        ...currentUser.data.user.savedVideos,
                        currentVideo?._id,
                    ])
                );
                setIsSaved(true);
                toast.success("Video saved successfully!");
            } catch (err) {
                console.error("Error saving video:", err);
                toast.error("Failed to save video.");
            }
        } else {
            console.log("Video already saved");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 min-h-screen">
            {currentVideo ? (
                <div className="flex-1">
                    <div className="w-full">
                        <video
                            src={currentVideo?.videoUrl}
                            controls
                            className="w-full max-h-[720px] rounded-lg object-cover"
                        />
                    </div>
                    <h1 className="text-lg md:text-xl font-normal mt-5 mb-2 dark:text-white text-black">
                        {currentVideo?.title}
                    </h1>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <span className="text-sm dark:text-gray-300 text-gray-600">
                            {currentVideo.views} views • {format(currentVideo?.createdAt)}
                        </span>
                        <div className="flex gap-5 dark:text-white text-black">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-1 cursor-pointer"
                            >
                                {currentVideo?.likes?.includes(currentUser?.data?.user?._id) ? (
                                    <ThumbUpIcon className="text-blue-500" />
                                ) : (
                                    <ThumbUpOutlinedIcon />
                                )}
                                {currentVideo?.likes?.length}
                            </button>
                            <button
                                onClick={handleDislike}
                                className="flex items-center gap-1 cursor-pointer"
                            >
                                {currentVideo?.dislikes?.includes(
                                    currentUser?.data?.user?._id
                                ) ? (
                                    <ThumbDownIcon className="text-blue-500" />
                                ) : (
                                    <ThumbDownOffAltOutlinedIcon />
                                )}
                            </button>
                            <button
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-1 cursor-pointer"
                            >
                                <ReplyOutlinedIcon /> Share
                            </button>
                            <button
                                onClick={handleSaveVideo}
                                className="flex items-center gap-1 cursor-pointer"
                            >
                                <AddTaskOutlinedIcon />
                                {isSaved ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                    <hr className="my-4 border-t dark:border-gray-700 border-gray-300" />
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-5">
                            <img
                                src={channel?.avatar}
                                alt="channel"
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex flex-col">
                                <Link to={`/profile/${channel?._id}`}>
                                    <span className="font-medium dark:text-white text-black">
                                        {channel?.name}
                                    </span>
                                </Link>
                                <span className="text-sm mt-1 mb-2 dark:text-gray-300 text-gray-600">
                                    {channel?.subscribers} subscribers
                                </span>
                                <p className="text-sm dark:text-gray-300 text-gray-600">
                                    {currentVideo?.desc}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSub}
                            className={`px-4 py-2 rounded text-white h-fit ${isSubscribed
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
                        </button>
                    </div>
                    <hr className="my-4 border-t dark:border-gray-700 border-gray-300" />
                    <Comments videoId={currentVideo?._id} />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="dark:text-white text-black">Loading...</div>
                </div>
            )}
            <div className="lg:w-80 xl:w-96">
                <Recommendation tags={currentVideo?.tags} />
            </div>
            <ShareModal isOpen={open} onRequestClose={() => setOpen(false)} />
        </div>
    );
}