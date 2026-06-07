const VideoPlayer = ({ videoUrl, thumbnail, platform, videoId, duration }) => {
  if (videoUrl && videoId) {
    const embedUrl =
      platform === "youtube"
        ? `https://www.youtube.com/embed/${videoId}`
        : `https://player.vimeo.com/video/${videoId}`;

    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
      {thumbnail && (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      )}
      {duration && (
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
          {duration}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
