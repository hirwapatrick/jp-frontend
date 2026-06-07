import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play, Clock, Youtube, Search, X, ThumbsUp, Bookmark,
  ArrowUpDown, Filter
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Tutorials = () => {
  const [searchParams] = useSearchParams();
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeTag, setActiveTag] = useState(searchParams.get("tag") || "");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetch(`${API_URL}/api/tutorials`)
      .then((res) => res.json())
      .then((data) => setTutorials(data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    tutorials.forEach((t) => t.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tutorials]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = tutorials;

    if (q) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (activeTag) {
      result = result.filter((t) => t.tags?.includes(activeTag));
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular": return (b.likes || 0) - (a.likes || 0);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [tutorials, search, activeTag, sort]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 py-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tutorials</h1>
        <p className="text-gray-400 mt-1">
          Learn photography tips, techniques, and workflows
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutorials..."
            className="w-full bg-gray-900 text-white pl-9 pr-9 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm placeholder-gray-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-900 text-gray-300 text-sm border border-gray-700 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Liked</option>
          </select>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeTag
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4">
        Showing {filtered.length} of {tutorials.length} tutorials
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Youtube className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">
            {search || activeTag
              ? "No tutorials match your filters."
              : "No tutorials available yet."}
          </p>
          {(search || activeTag) && (
            <button
              onClick={() => { setSearch(""); setActiveTag(""); }}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tutorial, i) => (
            <motion.div
              key={tutorial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/tutorials/${tutorial._id}`}
                className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 hover:shadow-lg hover:shadow-black/20 transition-all"
              >
                <div className="relative aspect-video bg-gray-800 flex items-center justify-center overflow-hidden">
                  {tutorial.thumbnail ? (
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Youtube className="w-12 h-12 text-gray-600" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  {tutorial.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tutorial.duration}
                    </div>
                  )}
                  {tutorial.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                    {tutorial.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    {(tutorial.likes ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {tutorial.likes}
                      </span>
                    )}
                    {(tutorial.saves ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        {tutorial.saves}
                      </span>
                    )}
                    <span>
                      {new Date(tutorial.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {tutorial.tags && tutorial.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tutorial.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Tutorials;
