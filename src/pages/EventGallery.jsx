import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
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
  faImage,
  faVideo,
  faSpinner,
  faDownload,
  faLock,
  faInfoCircle,
  faExpand,
  faCompress,
  faShare,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faYoutube as faYoutubeBrand,
  faVimeo as faVimeoBrand,
} from "@fortawesome/free-brands-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EventGallery = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const videoRef = useRef(null);
  const lightboxRef = useRef(null);
  const thumbnailStripRef = useRef(null);

  const isUnlocked = event && (
    !event.settings?.password ||
    sessionStorage.getItem(`gallery_unlocked_${eventId}`) === "true"
  );

  const canDownload = event && (
    event.settings?.allowDownloads ||
    sessionStorage.getItem(`gallery_unlocked_${eventId}`) === "true"
  );

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/events/${eventId}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError("");
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Incorrect password");
      sessionStorage.setItem(`gallery_unlocked_${eventId}`, "true");
      setPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getEmbedUrl = (media) => {
    if (!media?.url) return "";
    const url = media.url.trim();
    try {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = "";
        if (url.includes("youtu.be")) videoId = url.split("youtu.be/")[1]?.split("?")[0];
        if (url.includes("watch?v=")) videoId = new URL(url).searchParams.get("v");
        if (url.includes("/embed/")) videoId = url.split("/embed/")[1]?.split("?")[0];
        if (!videoId) return "";
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
      }
      if (url.includes("vimeo.com")) {
        const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
      }
      return "";
    } catch {
      return "";
    }
  };

  // FIXED: Preserve original aspect ratio by removing c_fill
  const getOptimizedImageUrl = (url, width = 800) => {
    if (!url) return "";
    if (url.includes("cloudinary")) {
      return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
    }
    return url;
  };

  const getPlatformIcon = (url) => {
    if (url?.includes("youtube") || url?.includes("youtu.be")) return faYoutubeBrand;
    if (url?.includes("vimeo")) return faVimeoBrand;
    return faPlay;
  };

  const media = event?.media || [];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    setIsPlaying(false);
    setProgress(0);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsFullscreen(false);
    setShowInfo(false);
    setShowShareMenu(false);
    document.body.style.overflow = "auto";
  };

  const nextMedia = () => {
    setCurrentIndex((p) => (p === media.length - 1 ? 0 : p + 1));
    setShowInfo(false);
  };
  
  const prevMedia = () => {
    setCurrentIndex((p) => (p === 0 ? media.length - 1 : p - 1));
    setShowInfo(false);
  };

  const handleThumbnailClick = (idx) => {
    setCurrentIndex(idx);
    setShowInfo(false);
  };

  useEffect(() => {
    if (thumbnailStripRef.current && currentIndex >= 0) {
      const thumb = thumbnailStripRef.current.children[currentIndex];
      if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      switch (e.key) {
        case "Escape": closeLightbox(); break;
        case "ArrowRight": nextMedia(); break;
        case "ArrowLeft": prevMedia(); break;
        case "f": case "F": toggleFullscreen(); break;
        case "i": case "I": setShowInfo((p) => !p); break;
        case " ": e.preventDefault(); togglePlay(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setProgress(parseFloat(e.target.value));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-white animate-spin mb-4" />
          <p className="text-gray-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl mb-2">Gallery Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/" className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faLock} className="w-7 h-7 text-white/60" />
            </div>
            <h1 className="text-2xl font-light text-white mb-2">{event.eventName}</h1>
            <p className="text-gray-400">This gallery is password protected</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Enter Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                placeholder="Gallery password"
                autoFocus
                required
              />
            </div>
            {passwordError && (
              <p className="text-red-400 text-sm mb-4">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {verifying ? (
                <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /><span>Verifying...</span></>
              ) : (
                <><FontAwesomeIcon icon={faLock} className="w-4 h-4" /><span>Unlock Gallery</span></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
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
          <h1 className="text-4xl md:text-5xl font-light mb-4">{event.eventName}</h1>
          {event.description && (
            <p className="text-gray-400 max-w-2xl mb-4">{event.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span><FontAwesomeIcon icon={faImage} className="mr-1" />{media.filter(m => m.type === "image").length} photos</span>
            <span><FontAwesomeIcon icon={faVideo} className="mr-1" />{media.filter(m => m.type === "video").length} videos</span>
          </div>
        </motion.div>

        {media.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400">No media in this gallery yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {media.map((item, index) => {
              const thumbnail = item.type === "video"
                ? (item.thumbnail?.url || item.url)
                : getOptimizedImageUrl(item.url, 600);

              return (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={thumbnail}
                    alt={item.title || ""}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                  <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 text-xs rounded-full flex items-center space-x-1">
                    <FontAwesomeIcon icon={item.type === "video" ? faVideo : faCamera} className="w-3 h-3" />
                    <span>{item.type === "video" ? "Video" : "Photo"}</span>
                  </div>

                  {item.type === "video" && item.url && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 text-xs rounded-full flex items-center space-x-1">
                      <FontAwesomeIcon icon={getPlatformIcon(item.url)} className="w-3 h-3" />
                      <span>{item.url?.includes("youtube") ? "YouTube" : item.url?.includes("vimeo") ? "Vimeo" : "Video"}</span>
                    </div>
                  )}

                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition duration-300">
                        <FontAwesomeIcon icon={faPlay} className="text-black text-lg ml-1" />
                      </div>
                    </div>
                  )}

                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition duration-500">
                      <h3 className="text-white text-lg font-light">{item.title}</h3>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

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
                <span className="text-white/80 text-sm">{event.eventName}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/60 text-sm">{currentIndex + 1} / {media.length}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button onClick={() => setShowShareMenu(!showShareMenu)} className="text-white/70 hover:text-white">
                    <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
                  </button>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full right-0 mt-2 bg-gray-900 rounded-lg shadow-xl py-2 min-w-48"
                    >
                      <button onClick={() => { navigator.clipboard.writeText(media[currentIndex]?.url); setShowShareMenu(false); }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors">
                        Copy Link
                      </button>
                    </motion.div>
                  )}
                </div>
                <button onClick={() => setShowInfo(!showInfo)} className={`${showInfo ? "text-white" : "text-white/70 hover:text-white"}`}>
                  <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
                </button>
                <button onClick={toggleFullscreen} className="text-white/70 hover:text-white">
                  <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="w-5 h-5" />
                </button>
                <button onClick={closeLightbox} className="text-white/70 hover:text-white">
                  <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            {media.length > 1 && (
              <>
                <button onClick={prevMedia} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-black/30 hover:bg-black/50 rounded-full p-3">
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </button>
                <button onClick={nextMedia} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-black/30 hover:bg-black/50 rounded-full p-3">
                  <FontAwesomeIcon icon={faChevronRight} size="lg" />
                </button>
              </>
            )}

            {/* Main Content - Fixed Container */}
            <div className="relative w-full h-full flex items-center justify-center p-20">
              <div className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center">
                {getEmbedUrl(media[currentIndex]) ? (
                  <div className="relative w-full" style={{ height: 0, paddingBottom: "56.25%" }}>
                    <iframe
                      src={getEmbedUrl(media[currentIndex])}
                      title={media[currentIndex]?.title || "Video"}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                    />
                  </div>
                ) : media[currentIndex]?.type === "video" ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={media[currentIndex]?.url}
                      poster={getOptimizedImageUrl(media[currentIndex]?.thumbnail?.url, 1920)}
                      className="max-w-full max-h-full object-contain"
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={togglePlay}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
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
                          <button onClick={togglePlay} className="text-white hover:text-white/80">
                            <FontAwesomeIcon icon={isPlaying ? faPlay : faPlay} className="w-4 h-4" />
                          </button>
                          <div className="flex items-center space-x-2">
                            <button onClick={() => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } }} className="text-white hover:text-white/80">
                              <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} className="w-4 h-4" />
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
                          <span className="text-white/80 text-sm">
                            {videoRef.current && (
                              <>
                                {formatDuration(videoRef.current.currentTime)} /{" "}
                                {formatDuration(videoRef.current.duration)}
                              </>
                            )}
                          </span>
                        </div>
                        {canDownload && (
                          <a href={media[currentIndex]?.url} download
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/70 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={getOptimizedImageUrl(media[currentIndex]?.url, 1920)}
                      alt={media[currentIndex]?.title || "Photo"}
                      className="max-w-full max-h-full object-contain"
                    />
                    {canDownload && (
                      <a href={media[currentIndex]?.url} download
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-4 right-4 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors">
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                      </a>
                    )}
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
                      <h3 className="text-xl font-light mb-4">{media[currentIndex]?.title || "Untitled"}</h3>
                      {media[currentIndex]?.description && <p className="text-gray-400 text-sm mb-4">{media[currentIndex].description}</p>}
                      <div className="space-y-3 text-sm">
                        <div><span className="text-gray-500">Event</span><p className="text-white">{event.eventName}</p></div>
                        {event.eventType && <div><span className="text-gray-500">Type</span><p className="text-white">{event.eventType}</p></div>}
                        {event.date && <div><span className="text-gray-500">Date</span><p className="text-white">{formatDate(event.date)}</p></div>}
                        {event.location && <div><span className="text-gray-500">Location</span><p className="text-white">{event.location}</p></div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Thumbnail Strip - with variable width and object-contain */}
            {media.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div 
                  ref={thumbnailStripRef} 
                  className="flex space-x-3 overflow-x-auto px-4 py-3 max-w-5xl"
                  style={{ 
                    scrollbarWidth: 'thin', 
                    msOverflowStyle: 'auto',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {media.map((item, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleThumbnailClick(idx)}
                      className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${idx === currentIndex ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"}`}
                      style={{ height: '80px' }}
                    >
                      <img 
                        src={item.thumbnail?.url || getOptimizedImageUrl(item.url, 200)} 
                        alt="" 
                        className="h-full w-auto max-w-none object-contain" 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts Hint */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/60">
              ← → navigate • ESC close • F fullscreen • I info
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventGallery;
