import Card from "../components/Card";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";

export default function Home({ type = "random" }) {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await apiClient.get(`/videos/${type}`);
                setVideos(res.data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };
        fetchVideos();
    }, [type]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 dark:bg-gray-900 transition-colors duration-300">
            {Array.isArray(videos) &&
                videos.map((video) => <Card key={video._id} video={video} />)}
        </div>
    );
}