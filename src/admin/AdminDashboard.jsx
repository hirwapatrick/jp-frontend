import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faVideo,
  faCalendar,
  faSignOutAlt,
  faPlus,
  faEdit,
  faTimes,
  faEye,
  faStar,
  faImage,
  faCheckCircle,
  faFile,
  faSpinner,
  faLink,
  faUpload,
  faEnvelope,
  faPhone,
  faUser,
  faComment,
  faClock,
  faReply,
  faTrash,
  faInbox,
  faPaperPlane,
  faEyeSlash,
  faBars,
  faChevronDown,
  faFilter,
  faSearch,
  faThLarge,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import {
  faYoutube as faYoutubeBrand,
  faVimeo as faVimeoBrand,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentMedia, setRecentMedia] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactStats, setContactStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [videoLink, setVideoLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Add resize listener for responsive adjustments
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setShowMobileFilters(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, eventsRes, mediaRes] = await Promise.all([
        fetch(`${API_URL}/api/stats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(`${API_URL}/api/events?limit=5`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        fetch(`${API_URL}/api/media/recent?limit=10`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
      ]);

      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      if (!eventsRes.ok) throw new Error("Failed to fetch events");

      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();
      
      setStats(statsData);
      setRecentEvents(eventsData);

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        setRecentMedia(mediaData);
      }

      await fetchContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const contactsRes = await fetch(`${API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.data || []);
        setContactStats(contactsData.stats || { total: 0, new: 0 });
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  // Filter contacts based on search and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => onLogout();

  const handleAddMedia = (event) => {
    setSelectedEvent(event);
    setShowMediaModal(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setReplyMessage("");
    setAdminNotes(contact.adminNotes || "");
    setShowContactModal(true);

    if (contact.status === "new") {
      updateContactStatus(contact._id, "read");
    }
  };

  const updateContactStatus = async (contactId, status, notes = null) => {
    try {
      const updateData = { status };
      if (notes !== null) updateData.adminNotes = notes;

      const res = await fetch(`${API_URL}/api/contact/${contactId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) =>
            c._id === contactId
              ? { ...c, status, adminNotes: notes || c.adminNotes }
              : c,
          ),
        );

        if (contactStats) {
          const newStats = { ...contactStats };
          if (status === "read") {
            newStats.new = Math.max(0, newStats.new - 1);
            newStats.read = (newStats.read || 0) + 1;
          } else if (status === "replied") {
            newStats.read = Math.max(0, (newStats.read || 0) - 1);
            newStats.replied = (newStats.replied || 0) + 1;
          }
          setContactStats(newStats);
        }
      }
    } catch (err) {
      console.error("Failed to update contact status:", err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_URL}/api/contact/${selectedContact._id}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ replyMessage, sendEmail: true }),
        }
      );

      if (res.ok) {
        if (adminNotes) {
          await updateContactStatus(selectedContact._id, "replied", adminNotes);
        } else {
          await updateContactStatus(selectedContact._id, "replied");
        }
        setShowContactModal(false);
        setSelectedContact(null);
        setReplyMessage("");
        setAdminNotes("");
      }
    } catch (err) {
      alert("Failed to send reply: " + err.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`${API_URL}/api/contact/${contactId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== contactId));
        if (selectedContact?._id === contactId) {
          setShowContactModal(false);
          setSelectedContact(null);
        }
      }
    } catch (err) {
      alert("Failed to delete contact: " + err.message);
    }
  };

  const handleVideoLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      let videoId = "";
      let platform = "";

      if (videoLink.includes("youtube.com") || videoLink.includes("youtu.be")) {
        platform = "youtube";
        if (videoLink.includes("youtube.com/watch?v=")) {
          videoId = videoLink.split("v=")[1]?.split("&")[0];
        } else if (videoLink.includes("youtu.be/")) {
          videoId = videoLink.split("youtu.be/")[1]?.split("?")[0];
        }
      } else if (videoLink.includes("vimeo.com")) {
        platform = "vimeo";
        videoId = videoLink.split("vimeo.com/")[1]?.split("?")[0];
      }

      if (!videoId) {
        alert("Invalid video URL");
        return;
      }

      const mediaData = {
        eventId: selectedEvent._id,
        type: "video",
        url: videoLink,
        publicId: `${platform}_${videoId}`,
        thumbnail: platform === "youtube"
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          : `https://vumbnail.com/${videoId}.jpg`,
        title: videoTitle || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
        description: "",
        format: platform,
        featured: false,
      };

      const res = await fetch(`${API_URL}/api/media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mediaData),
      });

      if (!res.ok) throw new Error("Failed to add video link");

      setShowMediaModal(false);
      setVideoLink("");
      setVideoTitle("");
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            New
          </span>
        );
      case "read":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Read
          </span>
        );
      case "replied":
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            Replied
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-white text-4xl animate-spin mb-4"
          />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faCamera} className="w-5 h-5 text-gray-900" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-light text-white truncate">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-gray-400 truncate">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                to="/admin/events/new"
                className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2 whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                <span>New Event</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                title="Logout"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden mt-4 space-y-2"
              >
                <Link
                  to="/admin/events/new"
                  className="block w-full px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                  New Event
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Overview
              {activeTab === "overview" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative flex items-center space-x-2 whitespace-nowrap ${
                activeTab === "contacts"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <span>Contact Messages</span>
              {contactStats?.new > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {contactStats.new}
                </span>
              )}
              {activeTab === "contacts" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "overview" ? (
          /* Overview Tab */
          <>
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard
                  icon={faCalendar}
                  label="Total Events"
                  value={stats.events.total}
                  color="blue"
                />
                <StatCard
                  icon={faCheckCircle}
                  label="Published"
                  value={stats.events.published}
                  color="green"
                />
                <StatCard
                  icon={faFile}
                  label="Drafts"
                  value={stats.events.draft}
                  color="yellow"
                />
                <StatCard
                  icon={faImage}
                  label="Total Media"
                  value={stats.media.total}
                  color="purple"
                  subStats={[
                    { icon: faImage, count: stats.media.images, label: "Photos" },
                    { icon: faVideo, count: stats.media.videos, label: "Videos" },
                  ]}
                />
              </div>
            )}

            {/* Contact Quick Stats - Responsive */}
            {contactStats && contactStats.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Contact Messages</h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {contactStats.total} total messages
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {contactStats.new > 0 && (
                      <div className="text-center">
                        <p className="text-xl sm:text-2xl font-light text-red-400">
                          {contactStats.new}
                        </p>
                        <p className="text-xs text-gray-400">New</p>
                      </div>
                    )}
                    {contactStats.read > 0 && (
                      <div className="text-center">
                        <p className="text-xl sm:text-2xl font-light text-yellow-400">
                          {contactStats.read}
                        </p>
                        <p className="text-xs text-gray-400">Unreplied</p>
                      </div>
                    )}
                    {contactStats.replied > 0 && (
                      <div className="text-center">
                        <p className="text-xl sm:text-2xl font-light text-green-400">
                          {contactStats.replied}
                        </p>
                        <p className="text-xs text-gray-400">Replied</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveTab("contacts")}
                  className="mt-4 w-full sm:w-auto text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center sm:justify-start space-x-2"
                >
                  <span>View all messages</span>
                  <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                </button>
              </motion.div>
            )}

            {/* Recent Events with Media Actions */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-medium text-white">Recent Events</h2>
                <Link
                  to="/admin/events"
                  className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center"
                >
                  View All
                  <FontAwesomeIcon icon={faEye} className="w-3 h-3 ml-2" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    user={user}
                    onAddMedia={handleAddMedia}
                  />
                ))}
              </div>
            </div>

            {/* Recent Media Grid */}
            {recentMedia.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 sm:p-6">
                <h2 className="text-lg font-medium text-white mb-6">Recent Media</h2>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {recentMedia.map((media) => (
                    <MediaThumbnail key={media._id} media={media} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Contacts Tab */
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 sm:p-6">
            {/* Header with filters */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <FontAwesomeIcon icon={faInbox} className="w-5 h-5 mr-2 text-gray-400" />
                  Contact Messages
                </h2>
                
                <div className="flex items-center space-x-2">
                  {/* View toggle for mobile */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                  </button>
                  
                  {/* View mode toggle */}
                  <button
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title={viewMode === "grid" ? "List view" : "Grid view"}
                  >
                    <FontAwesomeIcon 
                      icon={viewMode === "grid" ? faList : faThLarge} 
                      className="w-4 h-4" 
                    />
                  </button>
                  
                  <button
                    onClick={fetchContacts}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <FontAwesomeIcon icon={faSpinner} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search and filters - responsive */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4"
                  />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white text-sm"
                  />
                </div>
                
                {/* Desktop filters */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="hidden sm:block px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white text-sm"
                >
                  <option value="all">All Messages</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>

              {/* Mobile filters */}
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="sm:hidden"
                  >
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white text-sm"
                    >
                      <option value="all">All Messages</option>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faEnvelope} className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400">No contact messages found</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
              }>
                {filteredContacts.map((contact) => (
                  <motion.div
                    key={contact._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      contact.status === "new"
                        ? "bg-red-500/10 border border-red-500/30"
                        : "bg-gray-700/30 hover:bg-gray-700/50 border border-transparent"
                    }`}
                    onClick={() => handleViewContact(contact)}
                  >
                    {viewMode === "grid" ? (
                      // Grid view for contacts
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2 min-w-0">
                            {getStatusBadge(contact.status)}
                            <span className="text-white font-medium truncate">
                              {contact.name}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(contact._id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors ml-2 flex-shrink-0"
                            title="Delete Message"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-sm text-gray-400 truncate">
                          {contact.email}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="text-gray-400 flex items-center">
                            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1" />
                            {formatDate(contact.createdAt).split(',')[0]}
                          </span>
                          <span className="text-gray-400 flex items-center">
                            <FontAwesomeIcon icon={faCamera} className="w-3 h-3 mr-1" />
                            {contact.eventType}
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm line-clamp-2">
                          {contact.message}
                        </p>

                        {contact.adminNotes && (
                          <p className="text-xs text-gray-500 italic truncate">
                            Note: {contact.adminNotes}
                          </p>
                        )}
                      </div>
                    ) : (
                      // List view for contacts
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {getStatusBadge(contact.status)}
                            <span className="text-white font-medium">
                              {contact.name}
                            </span>
                            <span className="text-sm text-gray-400 hidden sm:inline">•</span>
                            <span className="text-sm text-gray-400">
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <>
                                <span className="text-sm text-gray-400 hidden sm:inline">•</span>
                                <span className="text-sm text-gray-400">
                                  {contact.phone}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
                            <span className="text-gray-400 flex items-center">
                              <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1" />
                              {formatDate(contact.createdAt)}
                            </span>
                            <span className="text-gray-400 flex items-center">
                              <FontAwesomeIcon icon={faCamera} className="w-3 h-3 mr-1" />
                              {contact.eventType}
                            </span>
                            {contact.eventDate && (
                              <span className="text-gray-400 flex items-center">
                                <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                                {contact.eventDate}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm line-clamp-2">
                            {contact.message}
                          </p>

                          {contact.adminNotes && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                              Note: {contact.adminNotes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 sm:ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewContact(contact);
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Message"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(contact._id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Delete Message"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Media Modal - Responsive */}
      <AnimatePresence>
        {showMediaModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-light text-white">
                    Add Media to {selectedEvent.eventName}
                  </h3>
                  <button
                    onClick={() => setShowMediaModal(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Media Type Selector */}
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                  <button
                    onClick={() => setMediaType("image")}
                    className={`flex-1 py-3 px-3 rounded-lg flex items-center justify-center space-x-2 ${
                      mediaType === "image"
                        ? "bg-white text-gray-900"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    onClick={() => setMediaType("link")}
                    className={`flex-1 py-3 px-3 rounded-lg flex items-center justify-center space-x-2 ${
                      mediaType === "link"
                        ? "bg-white text-gray-900"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
                    <span>Video Link</span>
                  </button>
                </div>

                {mediaType === "image" && (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      Upload images directly to this event
                    </p>
                    <Link
                      to={`/admin/events/${selectedEvent._id}/upload`}
                      className="block w-full py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-center"
                      onClick={() => setShowMediaModal(false)}
                    >
                      <FontAwesomeIcon icon={faUpload} className="w-4 h-4 mr-2" />
                      Go to Upload Page
                    </Link>
                  </div>
                )}

                {mediaType === "link" && (
                  <form onSubmit={handleVideoLinkSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g., Wedding Highlight Reel"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Video URL (YouTube or Vimeo)
                      </label>
                      <input
                        type="url"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                        required
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faYoutubeBrand} className="w-4 h-4 text-red-500 mr-1" />
                        YouTube
                      </span>
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faVimeoBrand} className="w-4 h-4 text-blue-500 mr-1" />
                        Vimeo
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowMediaModal(false)}
                        className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Add Video
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Message Modal - Responsive */}
      <AnimatePresence>
        {showContactModal && selectedContact && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 sm:p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-light text-white">
                    Contact Message
                  </h3>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Contact Info */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Name</p>
                      <p className="text-white flex items-center break-all">
                        <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                        {selectedContact.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Email</p>
                      <p className="text-white flex items-center break-all">
                        <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                        {selectedContact.email}
                      </p>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Phone</p>
                        <p className="text-white flex items-center">
                          <FontAwesomeIcon icon={faPhone} className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                          {selectedContact.phone}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Event Type</p>
                      <p className="text-white flex items-center">
                        <FontAwesomeIcon icon={faCamera} className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                        {selectedContact.eventType}
                      </p>
                    </div>
                    {selectedContact.eventDate && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Event Date</p>
                        <p className="text-white flex items-center">
                          <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                          {selectedContact.eventDate}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Received</p>
                      <p className="text-white flex items-center">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                        {formatDate(selectedContact.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">Message</p>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap break-words">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleReply} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                      placeholder="Type your reply here..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      Admin Notes (Internal Only)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows="2"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                      placeholder="Add internal notes about this inquiry..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      className="flex-1 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>

                {/* Mark as Read Button */}
                {selectedContact.status === "new" && (
                  <button
                    onClick={() => {
                      updateContactStatus(selectedContact._id, "read", adminNotes);
                      setShowContactModal(false);
                    }}
                    className="w-full py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faEye} className="w-3 h-3 mr-2" />
                    Mark as Read (without replying)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced StatCard with better responsive design
const StatCard = ({ icon, label, value, color, subStats }) => {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    green: "from-green-500/20 to-green-600/20 border-green-500/30",
    yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 sm:p-6 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <p className="text-gray-300 text-xs sm:text-sm">{label}</p>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-light text-white">{value}</p>

      {subStats && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
          {subStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-1 sm:space-x-2">
              <FontAwesomeIcon
                icon={stat.icon}
                className="w-2 h-2 sm:w-3 sm:h-3 text-white/60"
              />
              <span className="text-xs sm:text-sm text-white">{stat.count}</span>
              <span className="text-[10px] sm:text-xs text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Enhanced EventCard with better mobile layout
const EventCard = ({ event, user, onAddMedia }) => {
  const navigate = useNavigate();

  const toggleFeatured = async () => {
    try {
      await fetch(`${API_URL}/api/events/${event._id}/featured`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  };

  const mediaCount = event.media?.length || 0;
  const imageCount = event.media?.filter((m) => m.type === "image").length || 0;
  const videoCount = event.media?.filter((m) => m.type === "video").length || 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors gap-3 sm:gap-4">
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        {event.coverImage?.url ? (
          <img
            src={event.coverImage.url}
            alt={event.eventName}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faImage} className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-white font-medium text-sm sm:text-base truncate">
              {event.eventName}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                event.status === "published"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {event.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
            <span className="text-gray-400">{event.eventType}</span>
            <span className="text-gray-400 hidden xs:inline">•</span>
            <span className="text-gray-400">
              {new Date(event.date).toLocaleDateString()}
            </span>

            {/* Media counts */}
            {mediaCount > 0 && (
              <>
                <span className="text-gray-400 hidden xs:inline">•</span>
                <div className="flex items-center space-x-2">
                  {imageCount > 0 && (
                    <span className="text-gray-400 flex items-center">
                      <FontAwesomeIcon icon={faImage} className="w-3 h-3 mr-1" />
                      {imageCount}
                    </span>
                  )}
                  {videoCount > 0 && (
                    <span className="text-gray-400 flex items-center">
                      <FontAwesomeIcon icon={faVideo} className="w-3 h-3 mr-1" />
                      {videoCount}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-1 sm:space-x-2">
        <button
          onClick={() => onAddMedia(event)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
          title="Add Media"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={toggleFeatured}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
            event.featured
              ? "text-yellow-400 hover:bg-yellow-500/20"
              : "text-gray-400 hover:bg-gray-600"
          }`}
        >
          <FontAwesomeIcon icon={faStar} className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        <Link
          to={`/admin/events/${event._id}/media`}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
          title="View Media"
        >
          <FontAwesomeIcon icon={faEye} className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>

        <Link
          to={`/admin/events/${event._id}/edit`}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
          title="Edit Event"
        >
          <FontAwesomeIcon icon={faEdit} className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>
    </div>
  );
};

// Enhanced MediaThumbnail with touch-friendly hover
const MediaThumbnail = ({ media }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative aspect-square bg-gray-700 rounded-lg overflow-hidden cursor-pointer touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
    >
      {media.type === "image" ? (
        <img
          src={media.thumbnail?.url || media.url}
          alt={media.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full relative">
          {media.thumbnail?.url ? (
            <img
              src={media.thumbnail.url}
              alt={media.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <FontAwesomeIcon icon={faVideo} className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <FontAwesomeIcon icon={faVideo} className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      )}

      {(isHovered || isTouched) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-2">
          <p className="text-white text-xs text-center break-words line-clamp-2">
            {media.title}
          </p>
        </div>
      )}

      {media.featured && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <FontAwesomeIcon icon={faStar} className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400" />
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;