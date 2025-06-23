import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useEffect, useRef } from "react";
import Upload from "./Upload";
import { logout } from "../Context/userSlice";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import apiClient from "../apiClient";
import { toast } from "react-hot-toast";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import PostAddIcon from "@mui/icons-material/PostAdd";
import UploadTiwtte from "./uploadTiwtte";
import Logoo from "../img/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function Navbar({ darkMode, setDarkMode, menuOpen, setMenuOpen }) {
    const { currentUser } = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [uploadType, setUploadType] = useState("");
    const [q, setQ] = useState("");
    const [uploadSelectOpen, setUploadSelectOpen] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const uploadRef = useRef(null);
    const searchRef = useRef(null);

    // Debounced search function
    const debounceTimeout = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (uploadRef.current && !uploadRef.current.contains(event.target)) {
                setUploadSelectOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Add this useEffect for debugging
    useEffect(() => {
        console.log('Current suggestions state:', {
            query: q,
            suggestions: searchSuggestions,
            showDropdown: showSuggestions,
            isFocused: isSearchFocused
        });
    }, [q, searchSuggestions, showSuggestions, isSearchFocused]);

    // Update the suggestions fetch effect
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (q.trim().length > 0) {
                try {
                    console.log('Fetching suggestions for:', q.trim());
                    const response = await apiClient.get('/videos/search-suggestions', {
                        params: { q: q.trim() }
                    });
                    console.log('Suggestions response:', response.data);
                    setSearchSuggestions(response.data || []);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSearchSuggestions([]);
                }
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);

        return () => clearTimeout(debounceTimer);
    }, [q]);

    const handleSearch = useCallback(() => {
        if (q.trim()) {
            const encodedQuery = encodeURIComponent(q.trim());
            navigate(`/search?q=${encodedQuery}`);
            setShowSuggestions(false);
            setShowMobileSearch(false); // Hide mobile search after search
        }
    }, [q, navigate]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
        if (e.key === "Escape") {
            setShowMobileSearch(false);
        }
    }, [handleSearch]);

    const handleSuggestionClick = (suggestion) => {
        setQ(suggestion);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
        setShowSuggestions(false);
        setShowMobileSearch(false);
    };

    const handleSignOut = async () => {
        try {
            await apiClient.post("/auth/sign-out");
            dispatch(logout());
            localStorage.removeItem("accessToken");
            toast.success("LogOut Successful");
            navigate("/sign-in");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Error during logout");
        }
    };

    const handleUploadSelect = (type) => {
        setUploadType(type);
        setUploadSelectOpen(false);
        setOpen(true);
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
        if (!showMobileSearch) {
            // Focus the search input when opening mobile search
            setTimeout(() => {
                const searchInput = document.querySelector('.mobile-search-input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    };

    return (
        <>
            <div className={`fixed top-0 w-full bg-white dark:bg-gray-900 ${showMobileSearch ? 'h-auto' : 'h-14'} z-50 shadow-md transition-all duration-300`}>
                {/* Main navbar */}
                <div className="flex items-center justify-between h-14 px-4 md:px-6">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="menu-button text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                            aria-label="Toggle menu"
                        >
                            <MenuIcon />
                        </button>
                        <Link to="/" className="flex items-center space-x-2 no-underline">
                            <img src={Logoo} alt="Logo" className="h-6 sm:h-8" />
                            <span className="font-bold text-sm sm:text-lg hidden xs:inline dark:text-white">VideoFusion</span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            className="relative flex items-center w-full"
                        >
                            <input
                                type="text"
                                placeholder="Search videos..."
                                className="w-full py-2 px-4 rounded-l-full border border-r-0 border-gray-300 dark:border-gray-600 bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => {
                                    setIsSearchFocused(true);
                                    if (q.trim()) setShowSuggestions(true);
                                }}
                                onBlur={() => setIsSearchFocused(false)}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                                aria-label="Search"
                            >
                                <SearchOutlinedIcon className='w-5 h-5' />
                            </button>
                        </form>

                        {/* Desktop Search suggestions dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                                {searchSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <div className="flex items-center">
                                            <SearchOutlinedIcon className="mr-2 text-gray-500 dark:text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-200">{suggestion}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Mobile Search Button */}
                        <button
                            onClick={toggleMobileSearch}
                            className="md:hidden text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                            aria-label="Search"
                        >
                            <SearchOutlinedIcon />
                        </button>

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <LightModeIcon className="w-5 h-5" /> : <DarkModeIcon className="w-5 h-5" />}
                        </button>

                        {currentUser?.data?.user ? (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="relative" ref={uploadRef}>
                                    <button
                                        onClick={() => setUploadSelectOpen(!uploadSelectOpen)}
                                        className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                                        aria-label="Upload options"
                                    >
                                        <VideoCallOutlinedIcon className="w-5 h-5" />
                                    </button>
                                    {uploadSelectOpen && (
                                        <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200">
                                            <button
                                                onClick={() => handleUploadSelect("video")}
                                                className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <SlideshowIcon className="mr-2" /> Upload Video
                                            </button>
                                            <button
                                                onClick={() => handleUploadSelect("tiwtte")}
                                                className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <PostAddIcon className="mr-2" /> Tiwtte
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="hidden sm:block text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                                    aria-label="Notifications"
                                >
                                    <NotificationsNoneIcon className="w-5 h-5" />
                                </button>

                                <Link to={`/profile/${currentUser.data.user?._id}`}>
                                    <img
                                        src={currentUser?.data?.user?.avatar || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/default-avatar.png";
                                        }}
                                    />
                                </Link>

                                <button
                                    onClick={handleSignOut}
                                    className="hidden lg:flex items-center bg-purple-600 hover:bg-purple-700 text-white rounded-full px-3 py-1 transition-colors duration-300 text-sm"
                                >
                                    <LogoutIcon className="mr-1 w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/sign-in" className="no-underline">
                                <button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white rounded-full px-2 sm:px-3 py-1 transition-colors duration-300 text-sm">
                                    <LoginIcon className="mr-1 w-4 h-4" />
                                    <span className="hidden xs:inline">SIGN IN</span>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {showMobileSearch && (
                    <div className="md:hidden px-4 pb-3" ref={searchRef}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            className="relative flex items-center"
                        >
                            <input
                                type="text"
                                placeholder="Search videos..."
                                className="mobile-search-input w-full py-2 px-4 rounded-l-full border border-r-0 border-gray-300 dark:border-gray-600 bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => {
                                    setIsSearchFocused(true);
                                    if (q.trim()) setShowSuggestions(true);
                                }}
                                onBlur={() => setIsSearchFocused(false)}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                                aria-label="Search"
                            >
                                <SearchOutlinedIcon className='w-5 h-5' />
                            </button>
                        </form>

                        {/* Mobile Search suggestions dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                            <div className="absolute left-4 right-4 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                                {searchSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <div className="flex items-center">
                                            <SearchOutlinedIcon className="mr-2 text-gray-500 dark:text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-200">{suggestion}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {open && uploadType === "tiwtte" && <UploadTiwtte setOpen={setOpen} />}
            {open && uploadType === "video" && <Upload setOpen={setOpen} />}
        </>
    );
}