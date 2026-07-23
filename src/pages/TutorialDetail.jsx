import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Film, ListVideo } from "lucide-react";
import VideoPlayer from "../components/tutorials/VideoPlayer";
import VideoInfo from "../components/tutorials/VideoInfo";
import ChannelInfo from "../components/tutorials/ChannelInfo";
import Description from "../components/tutorials/Description";
import RelatedVideos from "../components/tutorials/RelatedVideos";
import Comments from "../components/tutorials/Comments";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TutorialDetail = () => {
  const { tutorialId } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/tutorials/${tutorialId}`).then((r) => r.json()),
      fetch(`${API_URL}/api/tutorials`).then((r) => r.json()),
    ])
      .then(([detailRes, listRes]) => {
        setTutorial(detailRes.data);
        const others = (listRes.data || []).filter(
          (t) => t._id !== tutorialId
        );
        setRelated(others.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [tutorialId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-gray-800 rounded mb-6" />
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <div>
              <div className="aspect-video bg-gray-800 rounded-xl mb-4" />
              <div className="h-8 w-3/4 bg-gray-800 rounded mb-3" />
              <div className="h-4 w-1/3 bg-gray-800 rounded mb-6" />
              <div className="h-20 bg-gray-800 rounded-xl mb-4" />
              <div className="h-32 bg-gray-800 rounded-xl" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-40 h-24 bg-gray-800 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-full" />
                    <div className="h-3 bg-gray-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Film className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-500">Tutorial not found.</p>
        <Link
          to="/tutorials"
          className="text-blue-400 hover:text-blue-300 mt-3 inline-block transition-colors"
        >
          &larr; Back to tutorials
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto py-6"
    >
      <Link
        to="/tutorials"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to tutorials
      </Link>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="min-w-0">
          <VideoPlayer
            videoUrl={tutorial.videoUrl}
            thumbnail={tutorial.thumbnail}
            platform={tutorial.platform}
            videoId={tutorial.videoId}
            duration={tutorial.duration}
          />

          <VideoInfo
            title={tutorial.title}
            createdAt={tutorial.createdAt}
            tutorialId={tutorial._id}
            tutorial={tutorial}
          />

          <ChannelInfo />

          <Description
            description={tutorial.description}
            tags={tutorial.tags}
          />

          <div className="border-t border-gray-800 pt-6 mt-6">
            <Comments tutorialId={tutorial._id} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-2 mb-4">
            <ListVideo className="w-4 h-4 text-white" />
            <h2 className="text-base font-semibold text-white">
              Related Videos
              {related.length > 0 && (
                <span className="text-gray-500 font-normal ml-1">
                  ({related.length})
                </span>
              )}
            </h2>
          </div>
          <RelatedVideos videos={related} />
        </aside>
      </div>
    </motion.div>
  );
};

export default TutorialDetail;
