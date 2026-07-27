import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faArrowLeft,
  faSpinner,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TutorialForm = ({ user }) => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const isEditMode = !!tutorialId;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    tags: "",
    duration: "",
    order: 0,
    status: "draft",
    featured: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isEditMode) {
      fetchTutorial();
    }
  }, [tutorialId]);

  const fetchTutorial = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tutorials/${tutorialId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Tutorial not found");
      const { data } = await res.json();
      setFormData({
        title: data.title || "",
        description: data.description || "",
        videoUrl: data.videoUrl || "",
        tags: (data.tags || []).join(", "),
        duration: data.duration || "",
        order: data.order || 0,
        status: data.status || "draft",
        featured: data.featured || false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.videoUrl.trim()) {
      setError("Video URL is required");
      return;
    }

    setIsLoading(true);

    const tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      videoUrl: formData.videoUrl.trim(),
      tags,
      duration: formData.duration.trim(),
      order: formData.order,
      status: formData.status,
      featured: formData.featured,
    };

    try {
      const url = isEditMode
        ? `${API_URL}/api/tutorials/${tutorialId}`
        : `${API_URL}/api/tutorials`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccessMessage(
        isEditMode ? "Tutorial updated!" : "Tutorial created!"
      );
      setTimeout(() => navigate("/admin/dashboard?tab=tutorials"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-gray-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-3xl"
    >
      <button
        onClick={() => navigate("/admin/dashboard?tab=tutorials")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to tutorials
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">
        {isEditMode ? "Edit Tutorial" : "Add Tutorial"}
      </h1>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            placeholder="Mastering Natural Light Photography"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            YouTube Video URL *
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={faYoutube}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
            />
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          {formData.videoUrl && (
            <div className="mt-2 aspect-video max-w-md rounded-lg overflow-hidden bg-gray-900">
              <iframe
                src={(() => {
                  const url = formData.videoUrl.trim();
                  if (url.includes("youtu.be/")) {
                    const id = url.split("youtu.be/")[1]?.split("?")[0];
                    return id ? `https://www.youtube.com/embed/${id}` : "";
                  }
                  if (url.includes("watch?v=")) {
                    const id = new URL(url).searchParams.get("v");
                    return id ? `https://www.youtube.com/embed/${id}` : "";
                  }
                  if (url.includes("/embed/")) {
                    return url;
                  }
                  return url;
                })()}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                title="Preview"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-y"
            placeholder="Describe what this tutorial covers..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faTag}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white pl-9 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="photography, lighting, tutorial"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="12:45"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <label className="flex items-center gap-2 mt-6 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Featured</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
            {isEditMode ? "Update" : "Create"} Tutorial
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard?tab=tutorials")}
            className="px-4 py-2.5 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TutorialForm;
