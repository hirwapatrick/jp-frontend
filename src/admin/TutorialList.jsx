import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faStar,
  faStar as faStarSolid,
  faSpinner,
  faSearch,
  faEye,
  faThumbsUp,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TutorialList = ({ user }) => {
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tutorials?all=true`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setTutorials(data.data || []);
    } catch (err) {
      console.error("Failed to fetch tutorials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tutorial?")) return;
    try {
      const res = await fetch(`${API_URL}/api/tutorials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setTutorials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete tutorial:", err);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tutorials/${id}/featured`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setTutorials((prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, featured: !t.featured } : t
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  const filtered = tutorials.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
      className="p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Tutorials</h1>
        <Link
          to="/admin/tutorials/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Tutorial
        </Link>
      </div>

      <div className="relative mb-4">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
        />
        <input
          type="text"
          placeholder="Search tutorials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white pl-9 pr-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FontAwesomeIcon icon={faYoutube} className="text-4xl mb-3" />
          <p>No tutorials yet. Click "Add Tutorial" to create one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Featured</th>
                <th className="pb-3 pr-4">Likes</th>
                <th className="pb-3 pr-4">Saves</th>
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Added</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tutorial) => (
                <tr
                  key={tutorial._id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-12 rounded bg-gray-800 shrink-0 flex items-center justify-center overflow-hidden">
                        {tutorial.thumbnail ? (
                          <img
                            src={tutorial.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faYoutube}
                            className="text-gray-600"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate max-w-[300px]">
                          {tutorial.title}
                        </p>
                        {tutorial.duration && (
                          <p className="text-gray-500 text-xs mt-0.5">
                            {tutorial.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        tutorial.status === "published"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-yellow-900/50 text-yellow-400"
                      }`}
                    >
                      {tutorial.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleToggleFeatured(tutorial._id)}
                      className={`transition-colors ${
                        tutorial.featured
                          ? "text-yellow-400"
                          : "text-gray-600 hover:text-gray-400"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={tutorial.featured ? faStarSolid : faStar}
                      />
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <FontAwesomeIcon icon={faThumbsUp} className="text-blue-400 text-xs" />
                      {tutorial.likes ?? 0}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <FontAwesomeIcon icon={faBookmark} className="text-yellow-400 text-xs" />
                      {tutorial.saves ?? 0}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400">{tutorial.order}</td>
                  <td className="py-3 pr-4 text-gray-400">
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/tutorials/${tutorial._id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <button
                        onClick={() => handleDelete(tutorial._id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default TutorialList;
