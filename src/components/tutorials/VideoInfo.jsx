import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, Share2, Bookmark } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getDeviceId = () => {
  let id = localStorage.getItem("op_device_id");
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem("op_device_id", id);
  }
  return id;
};

const VideoInfo = ({ title, createdAt, tutorialId, tutorial }) => {
  const deviceId = getDeviceId();
  const [likes, setLikes] = useState(tutorial?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [liking, setLiking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tutorial) {
      setLikes(tutorial.likes || 0);
      setIsLiked(tutorial.likedBy?.includes(deviceId) || false);
      setIsSaved(tutorial.savedBy?.includes(deviceId) || false);
    }
  }, [tutorial, deviceId]);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("op_saved_tutorials") || "[]");
    if (tutorialId) setIsSaved(savedIds.includes(tutorialId));
  }, [tutorialId]);

  const handleLike = useCallback(async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await fetch(`${API_URL}/api/tutorials/${tutorialId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      const json = await res.json();
      if (json.success) {
        setLikes(json.data.likes);
        setIsLiked(json.data.liked);
      }
    } catch {
      /* silently ignore */
    } finally {
      setLiking(false);
    }
  }, [tutorialId, deviceId, liking]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/tutorials/${tutorialId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      const json = await res.json();
      if (json.success) {
        setIsSaved(json.data.saved);
        const savedIds = JSON.parse(localStorage.getItem("op_saved_tutorials") || "[]");
        if (json.data.saved) {
          if (!savedIds.includes(tutorialId)) savedIds.push(tutorialId);
        } else {
          const idx = savedIds.indexOf(tutorialId);
          if (idx > -1) savedIds.splice(idx, 1);
        }
        localStorage.setItem("op_saved_tutorials", JSON.stringify(savedIds));
      }
    } catch {
      /* silently ignore */
    } finally {
      setSaving(false);
    }
  }, [tutorialId, deviceId, saving]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        prompt("Copy this link:", url);
      }
    }
  }, [title]);

  return (
    <div className="mb-4">
      <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
        {title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>
            {createdAt
              ? new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-sm ${
              isLiked
                ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-blue-400" : ""}`} />
            <span>{likes}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-sm ${
              isSaved
                ? "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-yellow-400" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
