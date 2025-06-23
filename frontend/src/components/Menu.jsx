import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Menu({ menuOpen, setMenuOpen }) {
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const menu = document.querySelector('.menu-container');
            const menuButton = document.querySelector('.menu-button');

            if (menu && !menu.contains(event.target) &&
                (!menuButton || !menuButton.contains(event.target))) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen, setMenuOpen]);

    const MenuItem = ({ to, icon, text }) => (
        <Link
            to={to}
            className="no-underline"
            onClick={() => setMenuOpen(false)}
        >
            <div className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-200">
                <span className="mr-4">{icon}</span>
                <span>{text}</span>
            </div>
        </Link>
    );

    return (
        <div
            className={`menu-container fixed top-14 left-0 w-64 h-[calc(100vh-56px)] bg-white dark:bg-gray-900 overflow-y-auto transition-all duration-300 z-40 shadow-lg ${menuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="p-4">
                <MenuItem to="/" icon={<HomeIcon />} text="Home" />
                <MenuItem to="/all" icon={<DynamicFeedIcon />} text="Tiwttes" />
                <MenuItem to="trend" icon={<ExploreOutlinedIcon />} text="Explore" />
                <MenuItem to="sub" icon={<SubscriptionsOutlinedIcon />} text="Subscriptions" />

                <hr className="my-3 border-gray-300 dark:border-gray-700" />

                <div onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-200">
                        <VideoLibraryOutlinedIcon className="mr-4" />
                        <span>Library</span>
                    </div>
                </div>

                {currentUser && (
                    <MenuItem
                        to={`/savedVideos/${currentUser?.data?.user?._id}`}
                        icon={<BookmarkAddedIcon />}
                        text="Saved Videos"
                    />
                )}

                {!currentUser && (
                    <>
                        <hr className="my-3 border-gray-300 dark:border-gray-700" />
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to like videos, comment, and subscribe.
                            <Link to="sign-in" className="no-underline" onClick={() => setMenuOpen(false)}>
                                <Button
                                    variant="outlined"
                                    className="w-full mt-2 flex items-center justify-center border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-gray-500 dark:hover:border-gray-500 transition-colors duration-200"
                                >
                                    <AccountCircleOutlinedIcon className="mr-2" />
                                    SIGN IN
                                </Button>
                            </Link>
                        </div>
                    </>
                )}

                <hr className="my-3 border-gray-300 dark:border-gray-700" />

                <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-2 px-2">
                    Best of VideoFusion
                </h3>

                <MenuItem to="/category/music" icon={<LibraryMusicOutlinedIcon />} text="Music" />
                <MenuItem to="/category/sports" icon={<SportsBasketballOutlinedIcon />} text="Sports" />
                <MenuItem to="/category/gaming" icon={<SportsEsportsOutlinedIcon />} text="Gaming" />
                <MenuItem to="/category/movies" icon={<MovieOutlinedIcon />} text="Movies" />
                <MenuItem to="/category/news" icon={<ArticleOutlinedIcon />} text="News" />
                <MenuItem to="/category/live" icon={<LiveTvOutlinedIcon />} text="Live" />

                <hr className="my-3 border-gray-300 dark:border-gray-700" />

                {currentUser && (
                    <MenuItem
                        to={`/settings/${currentUser?.data?.user?._id}`}
                        icon={<SettingsOutlinedIcon />}
                        text="Settings"
                    />
                )}

                <div onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-200">
                        <FlagOutlinedIcon className="mr-4" />
                        <span>Report</span>
                    </div>
                </div>

                <div onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-200">
                        <HelpOutlineOutlinedIcon className="mr-4" />
                        <span>Help</span>
                    </div>
                </div>
            </div>
        </div>
    );
}