import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faImage,
  faVideo,
  faTimes,
  faSpinner,
  faCheck,
  faExclamationTriangle,
  faArrowLeft,
  faLink,
  faInfoCircle,
  faCloudUploadAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faYoutube as faYoutubeBrand,
  faVimeo as faVimeoBrand,
} from "@fortawesome/free-brands-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MediaUploader = ({ user }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'link'
  const [videoLink, setVideoLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`);
      if (!res.ok) throw new Error("Failed to fetch event");
      const data = await res.json();
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles
        .map((f) => `${f.file.name}: ${f.errors[0].message}`)
        .join(", ");
      setError(`Some files were rejected: ${errors}`);
    }

    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      type: file.type.startsWith("image/") ? "image" : "video",
      title: file.name.split(".")[0],
      uploaded: false,
      success: false,
      error: null,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"],
      "video/*": [".mp4", ".mov", ".avi", ".webm", ".mkv"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 50,
  });

  const removeFile = (id) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setUploadStats({ total: 0, successful: 0, failed: 0 });
    setError("");
  };

  const validateVideoLink = (url) => {
    try {
      const urlObj = new URL(url);

      // YouTube validation
      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        let videoId;
        if (urlObj.hostname.includes("youtube.com")) {
          videoId = urlObj.searchParams.get("v");
        } else {
          videoId = urlObj.pathname.split("/").pop();
        }
        if (!videoId) {
          return { valid: false, error: "Could not extract YouTube video ID" };
        }
        return { valid: true, platform: "youtube", id: videoId };
      }

      // Vimeo validation
      if (urlObj.hostname.includes("vimeo.com")) {
        const videoId = urlObj.pathname.split("/").pop();
        if (!videoId || !/^\d+$/.test(videoId)) {
          return { valid: false, error: "Could not extract Vimeo video ID" };
        }
        return { valid: true, platform: "vimeo", id: videoId };
      }

      return {
        valid: false,
        error: "Only YouTube and Vimeo links are supported",
      };
    } catch (err) {
      return { valid: false, error: "Invalid URL format" };
    }
  };

  const handleAddVideoLink = async (e) => {
    e.preventDefault();

    if (!videoTitle.trim()) {
      setError("Please enter a video title");
      return;
    }

    const validation = validateVideoLink(videoLink);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const mediaData = {
        eventId,
        url: videoLink,
        title: videoTitle,
        description: videoDescription,
      };

      console.log("Sending video link data:", mediaData);

      const res = await fetch(`${API_URL}/api/media/video-link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mediaData),
      });

      const responseData = await res.json();
      console.log("Video link response:", responseData);

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to add video link");
      }

      setSuccessMessage("Video link added successfully!");
      setVideoLink("");
      setVideoTitle("");
      setVideoDescription("");

      // Navigate after short delay
      setTimeout(() => {
        navigate(`/admin/events/${eventId}/media`);
      }, 1500);
    } catch (err) {
      console.error("Video link error:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    setSuccessMessage("");
    setUploadStats({ total: files.length, successful: 0, failed: 0 });

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];

      try {
        // Determine upload endpoint based on file type
        const endpoint =
          fileItem.type === "image"
            ? "/api/media/upload-image"
            : "/api/media/upload-video";

        // Upload to Cloudinary first
        const formData = new FormData();
        formData.append(
          fileItem.type === "image" ? "image" : "video",
          fileItem.file,
        );

        console.log(`📤 Uploading ${fileItem.type} to ${endpoint}...`);

        const uploadRes = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            // Don't set Content-Type for FormData
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({}));
          console.error("❌ Upload failed:", errorData);
          throw new Error(
            errorData.message ||
              `Upload failed with status ${uploadRes.status}`,
          );
        }

        const uploadData = await uploadRes.json();
        console.log("✅ Upload successful:", uploadData);

        // Validate upload data
        if (!uploadData.url || !uploadData.publicId) {
          console.error("❌ Invalid upload response:", uploadData);
          throw new Error("Upload response missing required fields");
        }

        // Create media record in database
        const mediaData = {
          eventId,
          type: fileItem.type,
          url: uploadData.url,
          publicId: uploadData.publicId,
          thumbnail: uploadData.thumbnail || uploadData.url,
          title: fileItem.title,
          description: "",
          duration: uploadData.duration || "",
          width: uploadData.width || 0,
          height: uploadData.height || 0,
          format:
            uploadData.format || (fileItem.type === "image" ? "jpg" : "mp4"),
        };

        console.log("📝 Creating media record:", mediaData);

        const mediaRes = await fetch(`${API_URL}/api/media`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mediaData),
        });

        const mediaResponseData = await mediaRes.json().catch(() => ({}));
        console.log("📥 Media record response:", {
          status: mediaRes.status,
          ok: mediaRes.ok,
          data: mediaResponseData,
        });

        if (!mediaRes.ok) {
          // If media creation fails, we should delete the uploaded file from Cloudinary
          // to avoid orphaned files
          console.log("⚠️ Media creation failed, cleaning up Cloudinary...");

          // Try to delete the uploaded file from Cloudinary
          try {
            await fetch(`${API_URL}/api/media/delete-upload`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                publicId: uploadData.publicId,
                type: fileItem.type,
              }),
            });
          } catch (cleanupError) {
            console.error("Failed to cleanup Cloudinary:", cleanupError);
          }

          throw new Error(
            mediaResponseData.message || "Failed to save media to database",
          );
        }

        // Mark as uploaded
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id ? { ...f, uploaded: true, success: true } : f,
          ),
        );

        setUploadStats((prev) => ({
          ...prev,
          successful: prev.successful + 1,
        }));

        // Show success message after all files are uploaded
        if (i === files.length - 1) {
          setSuccessMessage("All files uploaded successfully!");
        }
      } catch (error) {
        console.error("❌ Error uploading file:", fileItem.title, error);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, error: error.message || "Upload failed" }
              : f,
          ),
        );

        setUploadStats((prev) => ({ ...prev, failed: prev.failed + 1 }));

        // Set a general error message but don't overwrite individual file errors
        if (uploadStats.failed === 0) {
          setError(
            `Some files failed to upload. Check individual file status.`,
          );
        }
      }
    }

    setUploading(false);

    // Check if all files are successful
    const allSuccessful = files.every((f) => f.success);
    if (allSuccessful) {
      setSuccessMessage("All files uploaded successfully!");
    } else if (files.some((f) => f.error)) {
      setError("Some files failed to upload. Please check the list below.");
    }
  };

  const completedUploads = files.filter((f) => f.success).length;
  const failedUploads = files.filter((f) => f.error).length;
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-8 h-8 text-white animate-spin mb-4"
          />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/admin/events/${eventId}/media`)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-light text-white">Add Media</h1>
              {event && (
                <p className="text-gray-400 text-sm mt-1">{event.eventName}</p>
              )}
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === "upload"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faCloudUploadAlt} className="w-4 h-4" />
              <span>Upload Files</span>
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === "link"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
              <span>Add Video Link</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 flex items-center space-x-2"
            >
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="w-4 h-4"
              />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <>
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 mb-8 text-center cursor-pointer transition-all
                ${
                  isDragActive
                    ? "border-white bg-white/5"
                    : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
                } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input {...getInputProps()} disabled={uploading} />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon
                    icon={faUpload}
                    className={`w-8 h-8 ${isDragActive ? "text-white" : "text-gray-400"}`}
                  />
                </div>
                <p className="text-white text-lg mb-2">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  or click to select files
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                  <span>📸 JPG, PNG, GIF, WEBP (Max 10MB each)</span>
                  <span>🎥 MP4, MOV, AVI, WEBM (Max 100MB each)</span>
                </div>
              </div>
            </div>

            {/* File List */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-white font-medium">
                        Files to Upload ({files.length})
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Total size: {(totalSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {!uploading && files.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm"
                        >
                          Clear All
                        </button>
                      )}
                      {!uploading && (
                        <button
                          onClick={uploadFiles}
                          disabled={files.length === 0 || uploading}
                          className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon
                            icon={faCloudUploadAlt}
                            className="w-4 h-4"
                          />
                          <span>Upload All</span>
                        </button>
                      )}
                      {uploading && (
                        <div className="px-4 py-2 bg-white/10 text-white rounded-lg flex items-center space-x-2">
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="w-4 h-4 animate-spin"
                          />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          {/* Thumbnail/Icon */}
                          <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            {file.preview ? (
                              <img
                                src={file.preview}
                                alt={file.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FontAwesomeIcon
                                  icon={
                                    file.type === "image" ? faImage : faVideo
                                  }
                                  className="w-5 h-5 text-gray-500"
                                />
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {file.title}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                              <span>•</span>
                              <span>{file.type}</span>
                              {file.error && (
                                <>
                                  <span>•</span>
                                  <span className="text-red-400">Error</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        {/* In the file list item, update the status display */}
                        <div className="flex items-center space-x-3">
                          {file.success ? (
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="w-5 h-5 text-green-400"
                              />
                              <span className="text-xs text-green-400 hidden md:inline">
                                Uploaded
                              </span>
                            </div>
                          ) : file.error ? (
                            <div className="flex items-center space-x-2 group relative">
                              <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="w-4 h-4 text-red-400"
                              />
                              <span className="text-xs text-red-400 hidden md:inline">
                                Failed
                              </span>
                              {/* Tooltip with error message */}
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                                <div className="bg-red-500 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                  {file.error}
                                </div>
                              </div>
                            </div>
                          ) : uploading ? (
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon
                                icon={faSpinner}
                                className="w-4 h-4 text-white animate-spin"
                              />
                              <span className="text-xs text-gray-400">
                                Uploading...
                              </span>
                            </div>
                          ) : null}

                          {!uploading && !file.uploaded && !file.error && (
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                            >
                              <FontAwesomeIcon
                                icon={faTimes}
                                className="w-4 h-4"
                              />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Upload Summary */}
                  {(completedUploads > 0 || failedUploads > 0) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 pt-4 border-t border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          {completedUploads > 0 && (
                            <span className="text-green-400">
                              ✓ {completedUploads} uploaded successfully
                            </span>
                          )}
                          {failedUploads > 0 && (
                            <span className="text-red-400">
                              ⚠ {failedUploads} failed
                            </span>
                          )}
                        </div>
                        {completedUploads === files.length && (
                          <button
                            onClick={() =>
                              navigate(`/admin/events/${eventId}/media`)
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            View Media
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Video Link Tab */}
        {activeTab === "link" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h2 className="text-xl font-light text-white mb-6">
                Add Video Link
              </h2>

              <form onSubmit={handleAddVideoLink} className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g., Wedding Highlight Reel"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                    required
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Video URL (YouTube or Vimeo) *
                  </label>
                  <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                    required
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    rows="3"
                    placeholder="Add a description for this video..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                    disabled={uploading}
                  />
                </div>

                {/* Platform Examples */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <p className="text-white/60 text-sm mb-3 flex items-center">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="w-4 h-4 mr-2"
                    />
                    Supported platforms:
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faYoutubeBrand}
                        className="w-5 h-5 text-red-500"
                      />
                      <span className="text-white text-sm">YouTube</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faVimeoBrand}
                        className="w-5 h-5 text-blue-500"
                      />
                      <span className="text-white text-sm">Vimeo</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Examples:</p>
                    <p>• https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
                    <p>• https://youtu.be/dQw4w9WgXcQ</p>
                    <p>• https://vimeo.com/123456789</p>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/events/${eventId}/media`)}
                    className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="w-4 h-4 animate-spin"
                        />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                        <span>Add Video Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
