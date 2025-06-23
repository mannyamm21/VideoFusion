import { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./lib/utils/Theme";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import SavedVideo from "./components/SavedVideo";
import SignUp from "./pages/SignUp";
import SignInn from "./pages/SignInn";
import Settings from "./pages/Settings";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/Resetpassword";
import TiwttePage from "./pages/TiwttePage";
import Tiwttes from "./pages/Tiwttes";
import { useSelector } from "react-redux";

function App() {
    const { currentUser } = useSelector((state) => state.user);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
                <BrowserRouter>
                    <Navbar
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        menuOpen={menuOpen}
                        setMenuOpen={setMenuOpen}
                    />
                    <div className="flex flex-1 pt-14">
                        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                        <main className="flex-1 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                            {loading ? (
                                <div className="flex justify-center items-center h-screen text-2xl dark:text-white">
                                    Loading...
                                </div>
                            ) : (
                                <div className={`p-4 md:p-6 transition-all duration-300 ${menuOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                                    <Routes>
                                        <Route path="/">
                                            <Route index element={<Home />} />
                                            <Route path="/profile/:userId" element={<Profile />} />
                                            <Route path="trend" element={<Home type="trend" />} />
                                            <Route path="all" element={<Tiwttes />} />
                                            <Route path="sub" element={<Home type="sub" />} />
                                            <Route path="/search" element={<Search />} />
                                            <Route path="category/:category" element={<Categories />} />
                                            <Route path="savedVideos/:userId" element={<SavedVideo />} />
                                            <Route path="settings/:id" element={<Settings />} />
                                            <Route path="sign-up" element={<SignUp />} />
                                            <Route path="sign-in" element={<SignInn />} />
                                            <Route path="video/:id" element={<Video />} />
                                            <Route path="tiwtte/:id" element={<TiwttePage />} />
                                            <Route path="/forgot-password" element={<ForgotPassword />} />
                                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                                        </Route>
                                    </Routes>
                                </div>
                            )}
                        </main>
                    </div>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
}

export default App;