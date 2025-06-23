import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import FileUploader from "./FileUploader";
import apiClientMultipart from "../apiClientMutipart";
import { toast } from "react-hot-toast";

const EditTiwtte = ({ setOpen, tiwtteId }) => {
    const [formData, setFormData] = useState({
        content: "",
        image: null,
        imageFileName: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTiwtteData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/tiwttes/find/${tiwtteId}`);
                const tiwtteData = response.data;
                setFormData({
                    content: tiwtteData.desc,
                    image: null,
                    imageFileName: tiwtteData.image || "",
                });
            } catch (error) {
                console.error("Failed to fetch tiwtte data:", error);
                setError("Failed to fetch tiwtte data. Please try again.");
                toast.error("Failed to fetch tiwtte data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTiwtteData();
    }, [tiwtteId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            image: file,
            imageFileName: file.name,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.content.trim()) {
            setError("Content cannot be empty");
            return;
        }

        try {
            setLoading(true);
            const data = { desc: formData.content };

            if (formData.image) {
                const imageFormData = new FormData();
                imageFormData.append("postImage", formData.image);
                const imageResponse = await apiClientMultipart.patch(
                    `/tiwttes/image/${tiwtteId}`,
                    imageFormData
                );
                data.image = imageResponse.data.data.avatar;
            }

            const response = await apiClient.put(`/tiwttes/${tiwtteId}`, data);
            console.log("Tiwtte updated:", response.data);
            setOpen(false);
            toast.success("Tiwtte updated successfully.");
        } catch (error) {
            console.error("Failed to update tiwtte:", error);
            setError("Failed to update tiwtte. Please try again.");
            toast.error("Failed to update tiwtte. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        Edit Your Tiwtte
                    </h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <CloseIcon className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Text Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Write your Tiwtte here..."
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         resize-none text-sm sm:text-base"
                            disabled={loading}
                        />
                    </div>

                    {/* File Uploader */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tiwtte Image
                        </label>
                        <FileUploader
                            name={"Tiwtte Image"}
                            value={formData.image}
                            id="file"
                            fileName={formData.imageFileName}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                       dark:hover:bg-gray-700 rounded-lg transition-colors font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.content.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                       text-white rounded-lg transition-colors font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTiwtte;