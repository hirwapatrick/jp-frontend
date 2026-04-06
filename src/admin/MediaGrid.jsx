import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage, faVideo, faTrash, faStar, faEdit,
  faArrowLeft, faUpload, faSpinner, faCheck,
  faLink,faTableCells, faList
} from '@fortawesome/free-solid-svg-icons';
import { 
  faYoutube as faYoutubeBrand,
  faVimeo as faVimeoBrand 
} from '@fortawesome/free-brands-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MediaGrid = ({ user }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video', 'link'
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title', 'featured'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [videoLinkModal, setVideoLinkModal] = useState(false);
  const [videoLinkData, setVideoLinkData] = useState({
    url: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchEventAndMedia();
  }, [eventId]);

  useEffect(() => {
    filterAndSortMedia();
  }, [media, filterType, sortBy, sortOrder]);

  const fetchEventAndMedia = async () => {
    try {
      // Fetch event details
      const eventRes = await fetch(`${API_URL}/api/events/${eventId}`);
      if (!eventRes.ok) throw new Error('Failed to fetch event');
      const eventData = await eventRes.json();
      setEvent(eventData);

      // Fetch media for event
      const mediaRes = await fetch(`${API_URL}/api/media/event/${eventId}`);
      if (!mediaRes.ok) throw new Error('Failed to fetch media');
      const mediaData = await mediaRes.json();
      setMedia(mediaData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortMedia = () => {
    let filtered = [...media];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'featured':
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          break;
        case 'createdAt':
        default:
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredMedia(filtered);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const res = await fetch(`${API_URL}/api/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete media');
      
      setMedia(prev => prev.filter(m => m._id !== mediaId));
      setSelectedMedia(prev => prev.filter(id => id !== mediaId));
      setSuccessMessage('Media deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleFeatured = async (mediaItem) => {
    try {
      const res = await fetch(`${API_URL}/api/media/${mediaItem._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          featured: !mediaItem.featured
        })
      });

      if (!res.ok) throw new Error('Failed to update media');
      
      setMedia(prev => prev.map(m => 
        m._id === mediaItem._id 
          ? { ...m, featured: !m.featured } 
          : m
      ));
      
      setSuccessMessage(`Media ${!mediaItem.featured ? 'featured' : 'unfeatured'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedMedia.length} items?`)) return;

    try {
      await Promise.all(selectedMedia.map(id => 
        fetch(`${API_URL}/api/media/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
      ));
      
      setMedia(prev => prev.filter(m => !selectedMedia.includes(m._id)));
      setSelectedMedia([]);
      setShowBulkActions(false);
      setSuccessMessage(`${selectedMedia.length} items deleted successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete some items');
    }
  };

  const handleBulkFeatured = async (featured) => {
    try {
      await Promise.all(selectedMedia.map(id => 
        fetch(`${API_URL}/api/media/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ featured })
        })
      ));
      
      setMedia(prev => prev.map(m => 
        selectedMedia.includes(m._id) ? { ...m, featured } : m
      ));
      
      setSelectedMedia([]);
      setShowBulkActions(false);
      setSuccessMessage(`${selectedMedia.length} items updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update some items');
    }
  };

  const toggleMediaSelection = (mediaId) => {
    setSelectedMedia(prev => {
      const newSelection = prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const selectAll = () => {
    if (selectedMedia.length === filteredMedia.length) {
      setSelectedMedia([]);
      setShowBulkActions(false);
    } else {
      setSelectedMedia(filteredMedia.map(m => m._id));
      setShowBulkActions(true);
    }
  };

  const handleAddVideoLink = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API_URL}/api/media/video-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId,
          url: videoLinkData.url,
          title: videoLinkData.title,
          description: videoLinkData.description
        })
      });

      if (!res.ok) throw new Error('Failed to add video link');
      
      const newMedia = await res.json();
      setMedia(prev => [newMedia, ...prev]);
      setVideoLinkModal(false);
      setVideoLinkData({ url: '', title: '', description: '' });
      setSuccessMessage('Video link added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return faYoutubeBrand;
      case 'vimeo': return faVimeoBrand;
      default: return faLink;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-white animate-spin mb-4" />
          <p className="text-white/60">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-light text-white">
                {event?.eventName || 'Event Media'}
              </h1>
              <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                <span>{media.length} total items</span>
                <span>•</span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faImage} className="w-3 h-3 mr-1" />
                  {media.filter(m => m.type === 'image' || m.type === 'link').length}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faVideo} className="w-3 h-3 mr-1" />
                  {media.filter(m => m.type === 'video').length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FontAwesomeIcon icon={faTableCells} className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FontAwesomeIcon icon={faList} className="w-4 h-4" />
              </button>
            </div>

            {/* Add Video Link Button */}
            <button
              onClick={() => setVideoLinkModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
              <span>Add Video Link</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={() => navigate(`/admin/events/${eventId}/upload`)}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUpload} className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Filters and Bulk Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="link">Video Links</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="createdAt">Date Added</option>
              <option value="title">Title</option>
              <option value="featured">Featured</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            {/* Select All */}
            {filteredMedia.length > 0 && (
              <button
                onClick={selectAll}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {selectedMedia.length === filteredMedia.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded-lg"
            >
              <span className="text-white text-sm">
                {selectedMedia.length} selected
              </span>
              <button
                onClick={() => handleBulkFeatured(true)}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                <FontAwesomeIcon icon={faStar} className="w-3 h-3 mr-1" />
                Feature
              </button>
              <button
                onClick={() => handleBulkFeatured(false)}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <FontAwesomeIcon icon={faStar} className="w-3 h-3 mr-1" />
                Unfeature
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <FontAwesomeIcon icon={faTrash} className="w-3 h-3 mr-1" />
                Delete
              </button>
            </motion.div>
          )}
        </div>

        {/* Media Grid/List */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">No media found</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setVideoLinkModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Video Link
              </button>
              <button
                onClick={() => navigate(`/admin/events/${eventId}/upload`)}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Upload Media
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <MediaCard
                key={item._id}
                item={item}
                isSelected={selectedMedia.includes(item._id)}
                onSelect={() => toggleMediaSelection(item._id)}
                onDelete={handleDeleteMedia}
                onToggleFeatured={toggleFeatured}
                getPlatformIcon={getPlatformIcon}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMedia.map((item) => (
              <MediaListItem
                key={item._id}
                item={item}
                isSelected={selectedMedia.includes(item._id)}
                onSelect={() => toggleMediaSelection(item._id)}
                onDelete={handleDeleteMedia}
                onToggleFeatured={toggleFeatured}
                getPlatformIcon={getPlatformIcon}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Video Link Modal */}
      {videoLinkModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl border border-gray-700 max-w-md w-full p-6"
          >
            <h3 className="text-xl font-light text-white mb-4">Add Video Link</h3>
            
            <form onSubmit={handleAddVideoLink} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={videoLinkData.title}
                  onChange={(e) => setVideoLinkData({ ...videoLinkData, title: e.target.value })}
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
                  value={videoLinkData.url}
                  onChange={(e) => setVideoLinkData({ ...videoLinkData, url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={videoLinkData.description}
                  onChange={(e) => setVideoLinkData({ ...videoLinkData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <FontAwesomeIcon icon={faYoutubeBrand} className="w-4 h-4 text-red-500" />
                <span>YouTube</span>
                <FontAwesomeIcon icon={faVimeoBrand} className="w-4 h-4 text-blue-500 ml-2" />
                <span>Vimeo</span>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setVideoLinkModal(false);
                    setVideoLinkData({ url: '', title: '', description: '' });
                  }}
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
          </motion.div>
        </div>
      )}
    </div>
  );
};

const MediaCard = ({ item, isSelected, onSelect, onDelete, onToggleFeatured, getPlatformIcon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative bg-gray-800/50 border rounded-xl overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'border-white ring-2 ring-white/50' : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          isSelected 
            ? 'bg-white border-white' 
            : 'border-gray-400 bg-black/50 group-hover:border-white'
        }`}>
          {isSelected && <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-gray-900" />}
        </div>
      </div>

      {/* Media Preview */}
      <div className="aspect-square relative">
        {item.type === 'image' ? (
          <img
            src={item.thumbnail?.url || item.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : item.platform ? (
          <div className="w-full h-full relative">
            <img
              src={item.thumbnail?.url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <FontAwesomeIcon 
                icon={getPlatformIcon(item.platform)} 
                className="w-8 h-8 text-white opacity-75" 
              />
            </div>
          </div>
        ) : (
          <video
            src={item.url}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-medium truncate">{item.title}</p>
            <p className="text-gray-300 text-xs mt-1">
              {item.platform ? (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={getPlatformIcon(item.platform)} className="w-3 h-3 mr-1" />
                  {item.platform}
                </span>
              ) : (
                <>
                  {item.width}x{item.height} • {item.format}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {item.featured && (
            <span className="px-2 py-1 bg-yellow-500/50 backdrop-blur-sm text-white text-xs rounded-lg flex items-center space-x-1">
              <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
            </span>
          )}
          <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg flex items-center space-x-1">
            <FontAwesomeIcon icon={item.type === 'image' ? faImage : faVideo} className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Actions (shown on hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeatured(item);
            }}
            className={`p-2 rounded-lg transition-colors ${
              item.featured 
                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item._id);
            }}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MediaListItem = ({ item, isSelected, onSelect, onDelete, onToggleFeatured, getPlatformIcon }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected 
          ? 'bg-white/10 border-white' 
          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-4 flex-1">
        {/* Selection Checkbox */}
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          isSelected ? 'bg-white border-white' : 'border-gray-400'
        }`}>
          {isSelected && <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-gray-900" />}
        </div>

        {/* Thumbnail */}
        <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
          {item.type === 'image' ? (
            <img
              src={item.thumbnail?.url || item.url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : item.platform ? (
            <div className="w-full h-full relative">
              <img
                src={item.thumbnail?.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <FontAwesomeIcon icon={getPlatformIcon(item.platform)} className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <FontAwesomeIcon icon={faVideo} className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-medium">{item.title}</h3>
            {item.featured && (
              <span className="text-yellow-400">
                <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
            <span className="flex items-center">
              <FontAwesomeIcon icon={item.type === 'image' ? faImage : faVideo} className="w-3 h-3 mr-1" />
              {item.type}
            </span>
            {item.platform && (
              <>
                <span>•</span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={getPlatformIcon(item.platform)} className="w-3 h-3 mr-1" />
                  {item.platform}
                </span>
              </>
            )}
            <span>•</span>
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFeatured(item);
          }}
          className={`p-2 rounded-lg transition-colors ${
            item.featured 
              ? 'text-yellow-400 hover:bg-yellow-500/20' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item._id);
          }}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default MediaGrid;