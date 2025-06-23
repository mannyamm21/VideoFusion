import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import TiwttePost from "../components/TiwttePost";

export default function Tiwttes() {
    const [tiwttes, setTiwttes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTiwtte = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get(`tiwttes/all`);
                setTiwttes(res.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching tiwtte:", error);
                setError("Failed to load tiwttes. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchTiwtte();
    }, []); // Fixed dependency array

    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="text-red-600 dark:text-red-400 text-lg mb-2">
                            {error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Latest Tiwttes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Discover what's happening right now
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {tiwttes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">
                            No tiwttes found. Be the first to post!
                        </div>
                    </div>
                ) : (
                    /* Vertical Feed Layout */
                    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                        {tiwttes.map((tiwtte) => (
                            <div key={tiwtte._id} className="w-full">
                                <TiwttePost post={tiwtte} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Load More Section (if needed) */}
            {tiwttes.length > 0 && (
                <div className="flex justify-center py-8">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}