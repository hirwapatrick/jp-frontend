import { useState, useEffect, useCallback } from "react";
import { User, ThumbsUp, MessageCircle, Reply, Send, ChevronDown, ChevronUp } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getDeviceId = () => {
  let id = localStorage.getItem("op_device_id");
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem("op_device_id", id);
  }
  return id;
};

const formatTimeAgo = (dateStr) => {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const CommentItem = ({ comment, tutorialId, onRefresh, deviceId, depth = 0 }) => {
  const [liking, setLiking] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const replyCount = comment.replies?.length || 0;

  const isLiked = comment.likedBy?.includes(deviceId);

  const handleLike = useCallback(async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await fetch(`${API_URL}/api/comments/${comment._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      if (res.ok) onRefresh();
    } catch {
      /* silently ignore */
    } finally {
      setLiking(false);
    }
  }, [comment._id, deviceId, liking, onRefresh]);

  const handleReply = useCallback(async (e) => {
    e.preventDefault();
    if (!replyText.trim() || submittingReply) return;
    setSubmittingReply(true);
    try {
      await fetch(`${API_URL}/api/comments/${tutorialId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: localStorage.getItem("op_comment_name") || "Anonymous",
          text: replyText.trim(),
          parentCommentId: comment._id,
        }),
      });
      setReplyText("");
      setShowReply(false);
      onRefresh();
    } catch {
      /* silently ignore */
    } finally {
      setSubmittingReply(false);
    }
  }, [replyText, submittingReply, tutorialId, comment._id, onRefresh]);

  return (
    <div className={`flex gap-3 ${depth > 0 ? "ml-10 pl-4 border-l border-gray-700/50" : ""}`}>
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
        <User className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-white">{comment.authorName}</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-300 mb-2 break-words">{comment.text}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-1 hover:text-white transition-colors ${isLiked ? "text-blue-400" : ""}`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-blue-400" : ""}`} />
            <span>{comment.likes || 0}</span>
          </button>
          {depth === 0 && (
            <>
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
              {replyCount > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
                </button>
              )}
            </>
          )}
        </div>

        {showReply && (
          <form onSubmit={handleReply} className="flex gap-2 mt-3 mb-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!replyText.trim() || submittingReply}
              className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {showReplies && replyCount > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                tutorialId={tutorialId}
                onRefresh={onRefresh}
                deviceId={deviceId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Comments = ({ tutorialId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState(localStorage.getItem("op_comment_name") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const deviceId = getDeviceId();

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/comments/${tutorialId}`);
      const json = await res.json();
      if (json.success) setComments(json.data);
    } catch {
      /* silently ignore */
    } finally {
      setIsLoading(false);
    }
  }, [tutorialId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setError("");

    const name = authorName.trim() || "Anonymous";
    if (!authorName.trim()) {
      setShowNameInput(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/comments/${tutorialId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: name,
          text: newComment.trim(),
        }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        const json = await res.json();
        setError(json.message || "Failed to post comment");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameSubmit = () => {
    const name = authorName.trim() || "Anonymous";
    localStorage.setItem("op_comment_name", name);
    setShowNameInput(false);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">
          Comments ({comments.length})
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1">
          {showNameInput ? (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name..."
                maxLength={100}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={handleNameSubmit}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set Name
              </button>
            </div>
          ) : null}
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-gray-700 pb-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          <div className="flex justify-end gap-2 mt-2">
            {!authorName.trim() && !showNameInput ? (
              <button
                type="button"
                onClick={() => setShowNameInput(true)}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                + Add name
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setNewComment("")}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Posting..." : "Comment"}
            </button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              tutorialId={tutorialId}
              onRefresh={fetchComments}
              deviceId={deviceId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
