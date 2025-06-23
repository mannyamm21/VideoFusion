import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../Context/userSlice";
import { auth, provider } from "../lib/utils/firebase";
import { signInWithPopup } from "firebase/auth";
 import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import apiClient from "../apiClient";
import { toast } from "react-hot-toast";

export default function SignInn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
     const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await apiClient.post("/auth/sign-in", { username, password });
            if (res.data.success) {
                const { accessToken } = res.data.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("persist:root", JSON.stringify(res.data));
                dispatch(loginSuccess(res.data));
                toast.success("Login Successful");
                 navigate("/");
            } else {
                console.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Username or Password are incorrect");
            dispatch(loginFailure());
        }
    };

    const signInWithGoogle = async () => {
        dispatch(loginStart());
        try {
            const result = await signInWithPopup(auth, provider);
            const res = await apiClient.post("/auth/google", {
                name: result.user.displayName,
                email: result.user.email,
            });

            if (res.data.success) {
                const { accessToken } = res.data.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("persist:root", JSON.stringify(res.data));
                dispatch(loginSuccess(res.data));
                toast.success("Login Successful");
                 navigate("/");
            } else {
                console.error(res.data.message);
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred during login. Please try again.");
            dispatch(loginFailure());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 py-5  dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="flex flex-col items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
                        Sign In
                    </h1>

                    {/* Form */}
                    <div className="w-full space-y-4">
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

                            {/* Forgot Password */}
                            <div className="flex justify-end mt-2">
                                <a
                                    href="/forgot-password"
                                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline transition-colors"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Social Login Divider */}
                    <div className="flex items-center w-full my-4">
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                        <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
                            Login with social accounts
                        </span>
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={signInWithGoogle}
                            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-purple-500"
                            aria-label="Sign in with Google"
                        >
                            <GoogleIcon className="w-5 h-5" />
                        </button>
                        <button
                            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-purple-500"
                            aria-label="Sign in with X"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                        <button
                            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-purple-500"
                            aria-label="Sign in with GitHub"
                        >
                            <GitHubIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <a
                            href="/sign-up"
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline font-medium transition-colors"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}