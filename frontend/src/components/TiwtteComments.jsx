import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-hot-toast";
import TiwtteComment from "./TiwtteComment";

export default function TiwtteComments({ tiwtteId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setFetchingComments(true);
                const res = await apiClient.get(`/comment/tiwtte/${tiwtteId}`);
                setComments(res.data);
            } catch (error) {
                console.log(error);
                toast.error("Failed to load comments");
            } finally {
                setFetchingComments(false);
            }
        };
        if (tiwtteId) {
            fetchComments();
        }
    }, [tiwtteId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            setLoading(true);
            const res = await apiClient.post(
                `/comment/tiwtte`,
                { tiwtteId, desc: newComment },
                { headers: { Authorization: `Bearer ${currentUser.data.accessToken}` } }
            );
            setComments([res.data, ...comments]);
            setNewComment("");
            toast.success("Comment added successfully");
        } catch (error) {
            console.log("You are not Logged In");
            toast.error("You are not Logged In");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter((comment) => comment._id !== commentId));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Add Comment Section */}
            {currentUser ? (
                <div className="mb-6">
                    <div className="flex gap-3 items-start">
                        <img
                            src={currentUser?.data?.user?.avatar}
                            alt="Your avatar"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                            <div className="relative">
                                <textarea
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    rows={3}
                                    className="w-full px-3 py-2 pr-12 border border-gray-300 dark:border-gray-600 
                           rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           resize-none text-sm sm:text-base"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={loading || !newComment.trim()}
                                    className="absolute bottom-2 right-2 p-2 rounded-full
                           bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                           text-white transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Send comment"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <SendIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Press Enter to post, Shift+Enter for new line
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Please log in to add a comment
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {fetchingComments ? (
                    /* Loading Skeleton */
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                            No comments yet. Be the first to comment!
                        </div>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <TiwtteComment
                            key={comment._id}
                            comment={comment}
                            onDelete={handleDeleteComment}
                        />
                    ))
                )}
            </div>

            {/* Load More Button (if needed) */}
            {comments.length > 10 && (
                <div className="text-center mt-6">
                    <button className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 
                           dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium">
                        Load more comments
                    </button>
                </div>
            )}
        </div>
    );
}