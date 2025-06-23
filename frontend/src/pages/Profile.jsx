import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import EditIcon from "@mui/icons-material/Edit";
import EditProfile from "../components/EditProfile";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { subscription } from "../Context/userSlice";
import apiClient from "../apiClient";
import TiwttePost from "../components/TiwttePost";

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [videos, setVideos] = useState([]);
    const [tiwttes, setTiwttes] = useState([]);
    const [open, setOpen] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [channel, setChannel] = useState({});
    const [selectedOption, setSelectedOption] = useState("videos");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await apiClient.get(`/users/find/${userId}`);
                const userData = userRes.data;
                setUser(userData);
                setChannel(userData);

                const videoIds = userData.videos;
                const videoPromises = videoIds.map((id) =>
                    apiClient.get(`/videos/find/${id}`)
                );
                const videoResults = await Promise.all(videoPromises);
                const videosData = videoResults.map((res) => res.data);
                setVideos(videosData);

                const tiwtteIds = userData.tiwttes;
                const tiwttePromises = tiwtteIds.map((id) =>
                    apiClient.get(`/tiwttes/find/${id}`)
                );
                const tiwtteResults = await Promise.all(tiwttePromises);
                const tiwttesData = tiwtteResults.map((res) => res.data);
                tiwttesData.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setTiwttes(tiwttesData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    const handleSub = async () => {
        if (!channel._id) {
            console.error("Channel ID is undefined");
            return;
        }

        try {
            currentUser.data.user.subscribedUsers.includes(channel._id)
                ? await apiClient.put(`/users/unsub/${channel._id}`)
                : await apiClient.put(`/users/sub/${channel._id}`);
            dispatch(subscription(channel._id));
        } catch (error) {
            console.error("Error in handleSub:", error);
        }
    };

    const isSubscribed = currentUser?.data?.user?.subscribedUsers?.includes(channel?._id);
    const isOwnProfile = currentUser?.data?.user?._id === userId;

    return (
        <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
            {/* Main Container */}
            <div className="flex flex-col p-4 sm:p-6 lg:p-8 mt-12 sm:mt-0">

                {/* Header Section */}
                <div className="relative mb-6 sm:mb-8">
                    {/* Cover Image */}
                    <div className="relative w-full h-32 sm:h-48 lg:h-56 xl:h-64 rounded-lg sm:rounded-xl overflow-hidden">
                        <img
                            src={
                                user.coverImage ||
                                "https://fortatelier.com/wp-content/uploads/2021/06/YouTube-Banner-Image-Size-Template.png"
                            }
                            alt="Cover Image"
                            className="w-full h-full object-cover"
                        />

                        {/* Edit Icon for Own Profile */}
                        {isOwnProfile && (
                            <button
                                onClick={() => setOpen(true)}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
                            >
                                <EditIcon className="text-white text-lg sm:text-xl" />
                            </button>
                        )}

                        {/* Subscribe Button - Always show, but different styles for own profile */}
                        <button
                            onClick={handleSub}
                            disabled={isOwnProfile}
                            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs sm:text-sm px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 font-semibold rounded-lg transition-all duration-200 shadow-lg ${isOwnProfile
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-50'
                                    : isSubscribed
                                        ? 'bg-gray-600 hover:bg-gray-700 text-white hover:shadow-xl transform hover:scale-105'
                                        : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-xl transform hover:scale-105'
                                }`}
                        >
                            {isOwnProfile ? "YOUR CHANNEL" : isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
                        </button>
                    </div>

                    {/* Divider */}
                    <hr className="my-4 sm:my-6 border-gray-200 dark:border-gray-700" />

                    {/* Avatar and User Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 lg:-mt-20 pt-8 sm:pt-12 lg:pt-16">
                        {/* Avatar */}
                        <div className="relative z-10 ml-4 sm:ml-6">
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 ml-4 sm:ml-0 mb-2 sm:mb-4 pt-4 sm:pt-6 lg:pt-8">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                                {user.name}
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                                @{user.username}
                            </p>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-500">
                                {user.subscribers} subscribers • {user.videos.length} Videos
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section Navigation */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 mt-12 sm:mt-16 lg:mt-20 xl:mt-24">
                    <button
                        onClick={() => setSelectedOption("videos")}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base lg:text-lg font-medium rounded-lg border transition-all duration-200 ${selectedOption === "videos"
                                ? "text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                                : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                    >
                        Videos
                    </button>
                    <button
                        onClick={() => setSelectedOption("tiwttes")}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base lg:text-lg font-medium rounded-lg border transition-all duration-200 ${selectedOption === "tiwttes"
                                ? "text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                                : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                    >
                        Tiwttes
                    </button>
                </div>

                {/* Content Section */}
                <div className="w-full">
                    {/* Videos Grid */}
                    {selectedOption === "videos" && (
                        <div className="w-full">
                            {Array.isArray(videos) && videos.length > 0 ? (
                                <div className="grid gap-4 sm:gap-6 lg:gap-8 xl:gap-10 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {videos.map((video) => (
                                        <div
                                            key={video?._id}
                                            className="w-full h-fit"
                                        >
                                            <Card video={video} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
                                    <div className="text-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            No videos yet
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-sm mx-auto">
                                            {isOwnProfile ? "Start creating content to share with your audience" : "This channel hasn't uploaded any videos yet"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tiwttes List */}
                    {selectedOption === "tiwttes" && (
                        <div className="w-full">
                            {Array.isArray(tiwttes) && tiwttes.length > 0 ? (
                                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                                    {tiwttes.map((tiwtte) => (
                                        <div
                                            key={tiwtte._id}
                                            className="w-full transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 sm:p-3 -m-2 sm:-m-3"
                                        >
                                            <TiwttePost post={tiwtte} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
                                    <div className="text-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            No tiwttes yet
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-sm mx-auto">
                                            {isOwnProfile ? "Share your thoughts and connect with your audience" : "This user hasn't posted any tiwttes yet"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {open && <EditProfile setOpen={setOpen} />}
        </div>
    );
};

export default Profile;