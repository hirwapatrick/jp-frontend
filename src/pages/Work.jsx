import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faChevronLeft,
  faChevronRight,
  faPlay,
  faCamera,
  faCalendar,
  faLocationDot,
  faUsers,
  faImage,
  faVideo,
  faClock,
  faCircleNotch,
  faDownload,
  faSpinner,
  faExclamationTriangle,
  faLink,
  faExpand,
  faCompress,
  faVolumeMute,
  faVolumeUp,
  faShare,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faYoutube as faYoutubeBrand,
  faVimeo as faVimeoBrand,
} from "@fortawesome/free-brands-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Work = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentEventMedia, setCurrentEventMedia] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // New features state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  const videoRef = useRef(null);
  const lightboxRef = useRef(null);
  const thumbnailStripRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/events?status=published`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      const eventsData = Array.isArray(data) ? data : data.events || [];

      const eventsWithMedia = eventsData.filter(
        (event) => event.media && event.media.length > 0,
      );

      setEvents(eventsWithMedia);

      const eventTypes = eventsWithMedia
        .map((e) => e.eventType)
        .filter(Boolean);

      const uniqueTypes = ["all", ...new Set(eventTypes)];
      const categoryList = uniqueTypes.map((type) => ({
        id: type === "all" ? "all" : type.toLowerCase().replace(/\s+/g, "-"),
        label: type === "all" ? "All Events" : type,
      }));

      setCategories(categoryList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------
     PRODUCTION SAFE EMBED URL HANDLER
  -------------------------------------------------- */
  const getEmbedUrl = (media) => {
    if (!media?.url) return "";

    const url = media.url.trim();

    try {
      // -------- YOUTUBE --------
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = "";

        if (url.includes("youtu.be")) {
          videoId = url.split("youtu.be/")[1]?.split("?")[0];
        }

        if (url.includes("watch?v=")) {
          const parsed = new URL(url);
          videoId = parsed.searchParams.get("v");
        }

        if (url.includes("/embed/")) {
          videoId = url.split("/embed/")[1]?.split("?")[0];
        }

        if (!videoId) return "";

        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
      }

      // -------- VIMEO --------
      if (url.includes("vimeo.com")) {
        const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
        if (!videoId) return "";
        return `https://player.vimeo.com/video/${videoId}`;
      }

      return "";
    } catch {
      return "";
    }
  };

  // Get platform icon
  const getPlatformIcon = (url) => {
    if (url?.includes("youtube") || url?.includes("youtu.be")) {
      return faYoutubeBrand;
    }
    if (url?.includes("vimeo")) {
      return faVimeoBrand;
    }
    return faLink;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Format Cloudinary URL with optimization
  const getOptimizedImageUrl = (url, width = 800, height = 800) => {
    if (!url) return "";
    if (url.includes("cloudinary")) {
      return url.replace(
        "/upload/",
        `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`,
      );
    }
    return url;
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    const regExp = /(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url?.match(regExp);
    return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
  };

  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter(
          (event) =>
            event.eventType?.toLowerCase().replace(/\s+/g, "-") ===
            selectedCategory,
        );

  const openLightbox = (event, mediaIndex) => {
    setCurrentEvent(event);
    setCurrentEventMedia(event.media || []);
    setCurrentMediaIndex(mediaIndex);
    setLightboxOpen(true);
    setIsPlaying(false);
    setProgress(0);
    setIsZoomed(false);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsFullscreen(false);
    setShowInfo(false);
    setShowShareMenu(false);
    setIsZoomed(false);
    document.body.style.overflow = "auto";
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === currentEventMedia.length - 1 ? 0 : prev + 1,
    );
    setIsZoomed(false);
    setShowInfo(false);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? currentEventMedia.length - 1 : prev - 1,
    );
    setIsZoomed(false);
    setShowInfo(false);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle video progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  // Handle video play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle seek
  const handleSeek = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setProgress(parseFloat(e.target.value));
  };

  // Handle image zoom
  const handleImageZoom = (e) => {
    if (!isZoomed) return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Share media
  const shareMedia = async () => {
    const media = currentEventMedia[currentMediaIndex];
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.title || "Check this out!",
          text: media.description || "Great photo/video from our collection",
          url: media.url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(media.url);
      alert("Link copied to clipboard!");
    }
    setShowShareMenu(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      switch(e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          nextMedia();
          break;
        case "ArrowLeft":
          prevMedia();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case " ":
          e.preventDefault();
          if (currentEventMedia[currentMediaIndex]?.type === "video") {
            togglePlay();
          }
          break;
        case "i":
        case "I":
          setShowInfo(!showInfo);
          break;
        case "z":
        case "Z":
          if (currentEventMedia[currentMediaIndex]?.type === "image") {
            setIsZoomed(!isZoomed);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentMediaIndex, isPlaying, showInfo, isZoomed]);

  // Auto-scroll thumbnail strip
  useEffect(() => {
    if (thumbnailStripRef.current && currentMediaIndex >= 0) {
      const thumbElement = thumbnailStripRef.current.children[currentMediaIndex];
      if (thumbElement) {
        thumbElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentMediaIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-12 h-12 text-white animate-spin mb-4"
          />
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            Events & Portfolios
          </h1>
          <div className="w-20 h-[2px] bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse through complete collections from each event
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm transition-all duration-300
                    ${
                      selectedCategory === category.id
                        ? "bg-white text-black shadow-lg"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Events Grid */}
        {filteredEvents.map((event, eventIndex) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: eventIndex * 0.1 }}
            className="mb-24"
          >
            {/* Event Header */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs uppercase tracking-wider text-gray-400 px-3 py-1 bg-gray-900 rounded-full">
                  {event.eventType || "Event"}
                </span>
                {event.date && (
                  <span className="text-sm text-gray-400 flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1" />
                    {formatDate(event.date)}
                  </span>
                )}
                {event.location && (
                  <span className="text-sm text-gray-400 flex items-center">
                    <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 mr-1" />
                    {event.location}
                  </span>
                )}
              </div>
              
              <h2 className="text-3xl font-semibold mb-3 tracking-tight">
                {event.eventName}
              </h2>
              
              {event.description && (
                <p className="text-gray-400 max-w-2xl mb-4">
                  {event.description}
                </p>
              )}

              {/* Media Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  <FontAwesomeIcon icon={faImage} className="mr-1" />
                  {event.media?.filter(m => m.type === "image").length} photos
                </span>
                <span>
                  <FontAwesomeIcon icon={faVideo} className="mr-1" />
                  {event.media?.filter(m => m.type === "video").length} videos
                </span>
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {event.media.map((media, index) => {
                const videoId = media.type === "video" ? getYouTubeThumbnail(media.url) : null;
                const thumbnail = media.type === "video" 
                  ? videoId 
                  : getOptimizedImageUrl(media.url, 600, 800);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => openLightbox(event, index)}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Media Thumbnail */}
                    <img
                      src={thumbnail}
                      alt={media.title || ""}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                    {/* Media Type Badge */}
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 text-xs rounded-full flex items-center space-x-1">
                      <FontAwesomeIcon 
                        icon={media.type === "video" ? faVideo : faCamera} 
                        className="w-3 h-3" 
                      />
                      <span>{media.type === "video" ? "Video" : "Photo"}</span>
                    </div>

                    {/* Platform Badge */}
                    {media.type === "video" && media.url && (
                      <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 text-xs rounded-full flex items-center space-x-1">
                        <FontAwesomeIcon 
                          icon={getPlatformIcon(media.url)} 
                          className="w-3 h-3" 
                        />
                        <span>
                          {media.url.includes("youtube") ? "YouTube" : 
                           media.url.includes("vimeo") ? "Vimeo" : "Video"}
                        </span>
                      </div>
                    )}

                    {/* Play Button for Videos */}
                    {media.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition duration-300">
                          <FontAwesomeIcon
                            icon={faPlay}
                            className="text-black text-lg ml-1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Title Overlay */}
                    {media.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition duration-500">
                        <h3 className="text-white text-lg font-light">{media.title}</h3>
                        {media.description && (
                          <p className="text-white/70 text-sm line-clamp-2">
                            {media.description}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* LIGHTBOX */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              ref={lightboxRef}
              className="fixed inset-0 bg-black/98 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Top Bar Controls */}
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center space-x-3">
                  {currentEvent && (
                    <>
                      <span className="text-white/80 text-sm">
                        {currentEvent.eventName}
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60 text-sm">
                        {currentMediaIndex + 1} / {currentEventMedia.length}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
                    </button>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 bg-gray-900 rounded-lg shadow-xl py-2 min-w-48"
                      >
                        <button
                          onClick={shareMedia}
                          className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors"
                        >
                          Share via...
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              currentEventMedia[currentMediaIndex]?.url
                            );
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors"
                        >
                          Copy Link
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Info Button */}
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`text-white/70 hover:text-white transition-colors ${
                      showInfo ? "text-white" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
                  </button>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon 
                      icon={isFullscreen ? faCompress : faExpand} 
                      className="w-5 h-5" 
                    />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={closeLightbox}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Navigation Buttons */}
              {currentEventMedia.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
                  >
                    <FontAwesomeIcon icon={faChevronRight} size="lg" />
                  </button>
                </>
              )}

              {/* Main Content */}
              <div className="relative w-full h-full flex items-center justify-center">
                {getEmbedUrl(currentEventMedia[currentMediaIndex]) ? (
                  // External Video (YouTube/Vimeo)
                  <div className="relative w-full max-w-6xl" style={{ height: '0', paddingBottom: '56.25%' }}>
                    <iframe
                      src={getEmbedUrl(currentEventMedia[currentMediaIndex])}
                      title={currentEventMedia[currentMediaIndex]?.title || "Video player"}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                    />
                  </div>
                ) : currentEventMedia[currentMediaIndex]?.type === "video" ? (
                  // Direct Video File
                  <div className="relative max-w-6xl w-full">
                    <video
                      ref={videoRef}
                      src={currentEventMedia[currentMediaIndex]?.url}
                      poster={getOptimizedImageUrl(
                        currentEventMedia[currentMediaIndex]?.thumbnail?.url,
                        1920,
                        1080
                      )}
                      className="w-full rounded-lg"
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={togglePlay}
                    />
                    
                    {/* Custom Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      {/* Progress Bar */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer mb-4"
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Play/Pause */}
                          <button
                            onClick={togglePlay}
                            className="text-white hover:text-white/80 transition-colors"
                          >
                            <FontAwesomeIcon 
                              icon={isPlaying ? faPlay : faPlay} 
                              className="w-4 h-4" 
                            />
                          </button>
                          
                          {/* Volume */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={toggleMute}
                              className="text-white hover:text-white/80 transition-colors"
                            >
                              <FontAwesomeIcon 
                                icon={isMuted ? faVolumeMute : faVolumeUp} 
                                className="w-4 h-4" 
                              />
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          
                          {/* Time */}
                          <span className="text-white/80 text-sm">
                            {videoRef.current && (
                              <>
                                {formatDuration(videoRef.current.currentTime)} /{" "}
                                {formatDuration(videoRef.current.duration)}
                              </>
                            )}
                          </span>
                        </div>
                        
                        {/* Download Button */}
                        <a
                          href={currentEventMedia[currentMediaIndex]?.url}
                          download
                          className="text-white/70 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Image
                  <div 
                    className={`relative max-w-7xl max-h-[90vh] ${
                      isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    onMouseMove={handleImageZoom}
                  >
                    <img
                      src={getOptimizedImageUrl(
                        currentEventMedia[currentMediaIndex]?.url,
                        isZoomed ? 2400 : 1920,
                        isZoomed ? 2400 : 1080
                      )}
                      alt={currentEventMedia[currentMediaIndex]?.title || "Media"}
                      className={`max-w-full max-h-[90vh] object-contain transition-transform duration-300 ${
                        isZoomed ? "scale-150" : "scale-100"
                      }`}
                      style={
                        isZoomed
                          ? {
                              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            }
                          : {}
                      }
                    />
                    
                    {/* Download Button */}
                    <a
                      href={currentEventMedia[currentMediaIndex]?.url}
                      download
                      className="absolute bottom-4 right-4 text-white/70 hover:text-white transition-colors bg-black/50 p-2 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Info Panel */}
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 300 }}
                      className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-lg p-6 overflow-y-auto"
                    >
                      <h3 className="text-xl font-light mb-4">
                        {currentEventMedia[currentMediaIndex]?.title || "Untitled"}
                      </h3>
                      
                      {currentEventMedia[currentMediaIndex]?.description && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-sm">
                            {currentEventMedia[currentMediaIndex].description}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-3 text-sm">
                        {currentEvent && (
                          <>
                            <div>
                              <span className="text-gray-500">Event</span>
                              <p className="text-white">{currentEvent.eventName}</p>
                            </div>
                            
                            {currentEvent.eventType && (
                              <div>
                                <span className="text-gray-500">Type</span>
                                <p className="text-white">{currentEvent.eventType}</p>
                              </div>
                            )}
                            
                            {currentEvent.date && (
                              <div>
                                <span className="text-gray-500">Date</span>
                                <p className="text-white">{formatDate(currentEvent.date)}</p>
                              </div>
                            )}
                            
                            {currentEvent.location && (
                              <div>
                                <span className="text-gray-500">Location</span>
                                <p className="text-white">{currentEvent.location}</p>
                              </div>
                            )}
                          </>
                        )}
                        
                        <div>
                          <span className="text-gray-500">Type</span>
                          <p className="text-white capitalize">
                            {currentEventMedia[currentMediaIndex]?.type}
                          </p>
                        </div>
                        
                        {currentEventMedia[currentMediaIndex]?.type === "video" && (
                          <>
                            {currentEventMedia[currentMediaIndex]?.duration && (
                              <div>
                                <span className="text-gray-500">Duration</span>
                                <p className="text-white">
                                  {formatDuration(currentEventMedia[currentMediaIndex].duration)}
                                </p>
                              </div>
                            )}
                            
                            {currentEventMedia[currentMediaIndex]?.platform && (
                              <div>
                                <span className="text-gray-500">Platform</span>
                                <p className="text-white">
                                  {currentEventMedia[currentMediaIndex].platform}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Thumbnail Strip */}
              {currentEventMedia.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <div
                    ref={thumbnailStripRef}
                    className="flex space-x-2 overflow-x-auto px-4 py-2 max-w-4xl"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {currentEventMedia.map((media, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMediaIndex(idx);
                        }}
                        className={`
                          relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden
                          transition-all duration-300
                          ${idx === currentMediaIndex 
                            ? "ring-2 ring-white scale-110" 
                            : "opacity-50 hover:opacity-100"
                          }
                        `}
                      >
                        {media.type === "video" ? (
                          <>
                            <img
                              src={media.thumbnail?.url || getYouTubeThumbnail(media.url) || media.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <FontAwesomeIcon icon={faPlay} className="w-4 h-4 text-white" />
                            </div>
                          </>
                        ) : (
                          <img
                            src={media.thumbnail?.url || getOptimizedImageUrl(media.url, 100, 100)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts Hint */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/60">
                ← → navigate • ESC close • F fullscreen • I info • Z zoom
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Work;