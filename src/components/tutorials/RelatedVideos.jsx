import { Link } from "react-router-dom";
import { Play, Clock, Youtube, ThumbsUp } from "lucide-react";

const RelatedVideoCard = ({ video }) => {
  return (
    <Link
      to={`/tutorials/${video._id}`}
      className="flex gap-2 group cursor-pointer"
    >
      <div className="relative w-40 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Youtube className="w-8 h-8 text-gray-600" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-4 h-4 text-white ml-0.5" />
          </div>
        </div>
        {video.duration && (
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-mono flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {video.duration}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {video.tags && video.tags.length > 0 && (
            <span className="text-xs text-gray-500 truncate">
              #{video.tags.slice(0, 2).join(", #")}
            </span>
          )}
          {(video.likes ?? 0) > 0 && (
            <span className="text-xs text-gray-500 flex items-center gap-0.5 shrink-0">
              <ThumbsUp className="w-3 h-3" />
              {video.likes}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const RelatedVideos = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-white" />
        <h2 className="text-base font-semibold text-white">
          Related Videos
          {videos.length > 0 && (
            <span className="text-gray-500 font-normal ml-1">
              ({videos.length})
            </span>
          )}
        </h2>
      </div>

      <div className="space-y-3">
        {videos.map((video) => (
          <RelatedVideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
