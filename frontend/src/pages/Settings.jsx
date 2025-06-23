import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { logout } from "../Context/userSlice";
import { toast } from "react-hot-toast";
import { useState } from "react";

const Settings = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const handleDeleteAccount = async () => {
        if (
            window.confirm(
                "Are you sure you want to delete your account? This action is irreversible."
            )
        ) {
            try {
                const response = await apiClient.delete(
                    `/users/${currentUser.data.user._id}`
                );

                if (response.status === 200) {
                    toast.success("Account deleted successfully.");
                    dispatch(logout());
                    navigate("/sign-in");
                } else {
                    toast.error("Failed to delete the account.");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
                toast.error("An error occurred while deleting the account.");
            }
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await apiClient.post(`/users/changepassword/${path}`, {
                oldPassword,
                newPassword,
                confirmPassword,
            });

            if (response.status === 200) {
                toast.success("Password changed successfully.");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error("Failed to change the password.");
            }
        } catch (error) {
            console.error("Error changing password:", error.message);
            toast.error("An error occurred while changing the password.");
        }
    };

    const defaultAvatar =
        "https://t3.ftcdn.net/jpg/01/77/54/02/360_F_177540231_SkxuDjyo8ECrPumqf0aeMbean2Ai1aOK.jpg";

    return (
        <>
            {currentUser === null ? (
                <div className="p-4 sm:p-6 lg:p-8">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                        LogIn to see your account details
                    </h1>
                </div>
            ) : (
                <div className="flex flex-col p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8">
                    {/* Account Section */}
                    <section className="space-y-4 sm:space-y-6">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                            Account
                        </h1>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-gray-200 dark:ring-gray-700">
                                <img
                                    src={currentUser?.data?.user?.avatar || defaultAvatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* User Info */}
                            <div className="flex flex-col space-y-1 sm:space-y-2 min-w-0 flex-1">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                                    {currentUser?.data?.user?.name || "Account Name"}
                                </h2>
                                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 truncate">
                                    {currentUser?.data?.user?.email || "User Email"}
                                </p>
                                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                    @{currentUser?.data?.user?.username || "Username"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Edit Profile Link */}
                    <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                        If you want to make changes in your account.{" "}
                        <Link
                            to={`/profile/${currentUser?.data?.user?._id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium transition-colors duration-200"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    {/* Change Password Section */}
                    {currentUser?.data?.user.fromGoogle === false && (
                        <section className="space-y-4 sm:space-y-6">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                                Change Password
                            </h1>

                            <div className="space-y-4 max-w-md">
                                {/* Old Password */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="oldPassword"
                                        className="block text-sm font-medium text-gray-600 dark:text-gray-400"
                                    >
                                        Old Password
                                    </label>
                                    <input
                                        type="password"
                                        id="oldPassword"
                                        name="oldPassword"
                                        placeholder="Enter old password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-sm font-medium text-gray-600 dark:text-gray-400"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-600 dark:text-gray-400"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleChangePassword}
                                    className="w-full sm:w-auto mt-4 px-6 py-2 sm:px-8 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Delete Account Section */}
                    <section className="space-y-4 sm:space-y-6">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white pb-2 border-b-2 border-gray-200 dark:border-gray-700">
                            Delete Account
                        </h1>

                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4">
                            If you want to delete the account.
                        </p>

                        <button
                            onClick={handleDeleteAccount}
                            className="group relative w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-red-600 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 overflow-hidden"
                        >
                            <span className="mr-3 transition-transform duration-300 group-hover:translate-x-1">
                                Delete
                            </span>
                            <svg
                                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </section>
                </div>
            )}
        </>
    );
};

export default Settings;