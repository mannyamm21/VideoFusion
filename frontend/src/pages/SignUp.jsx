import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-hot-toast";
import apiClientMultipart from "../apiClientMutipart";

const LoginForm = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    // const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            await apiClientMultipart.post("/auth/sign-up", formData);
            toast.success("Signed Up Successfully");
            // navigate("/sign-in");
        } catch (error) {
            console.log(error);
            toast.error("An error occurred during signup. Please try again.", error);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 py-5 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="flex flex-col items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
                        Sign Up
                    </h1>

                    {/* Form */}
                    <div className="w-full space-y-4">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Name"
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Username Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username Should be in lowercase"
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <VisibilityOffIcon className="w-5 h-5" />
                                    ) : (
                                        <VisibilityIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Avatar Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Avatar Image
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="sr-only"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="flex items-center space-x-2">
                                        <CloudUploadIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {avatarFile ? avatarFile.name : "Upload Avatar Image"}
                                        </span>
                                    </div>
                                </label>
                            </div>
                            {avatarFile && (
                                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                                    <span>✓</span>
                                    <span>File selected: {avatarFile.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="button"
                            onClick={handleSignUp}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        I already have an account.{" "}
                        <a
                            href="/sign-in"
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline font-medium transition-colors"
                        >
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;