import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../apiClient';
import VideoCard from '../components/VideoCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const query = searchParams.get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query || query.trim() === '') {
                setVideos([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await apiClient.get('/videos/search', {
                    params: { q: query }
                });

                // Debug logging
                console.log('Search response:', response);
                console.log('Response data:', response.data);
                console.log('Response data type:', typeof response.data);
                console.log('Is response.data an array?', Array.isArray(response.data));

                // Handle the response format from your backend
                let videosData;
                if (response.data && response.data.data) {
                    // New format: { success: true, message: "...", data: [...] }
                    videosData = response.data.data;
                    console.log('Using new format, videosData:', videosData);
                } else if (response.data && Array.isArray(response.data)) {
                    // Old format: direct array
                    videosData = response.data;
                    console.log('Using old format, videosData:', videosData);
                } else {
                    videosData = [];
                    console.log('No valid data found, using empty array');
                }

                if (Array.isArray(videosData)) {
                    setVideos(videosData);
                } else {
                    console.error('videosData is not an array:', videosData);
                    setVideos([]);
                    throw new Error(`Invalid response format: expected array, got ${typeof videosData}`);
                }
            } catch (err) {
                console.error('Search error:', err);
                setError(err.response?.data?.message || err.message || 'Search failed');
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Searching for "{query}"...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">
                    <h2>Search Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!query) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div>Please enter a search query</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
                        {videos.length === 0 ? (
                <div className="text-center py-8">
                    <p className="dark:text-gray-300">No videos found for "{query}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <VideoCard
                            key={video._id}
                            type="md"
                            videoId={video._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;