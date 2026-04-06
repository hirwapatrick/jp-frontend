import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMapMarker,
  faUser,
  faTag,
  faImage,
  faSpinner,
  faSave,
  faArrowLeft,
  faTrash,
  faUpload,
  faEnvelope,
  faPhone,
  faLock,
  faGlobe,
  faClock,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EventForm = ({ user }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEditMode = !!eventId;

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "wedding",
    location: "",
    date: "",
    description: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    tags: "",
    status: "draft",
    featured: false,
    // Gallery settings
    allowDownloads: false,
    password: "",
    expiresAt: ""
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Server response:", text);
        throw new Error(
          `Failed to fetch event: ${res.status} ${res.statusText}`,
        );
      }

      const data = await res.json();

      setFormData({
        eventName: data.eventName || "",
        eventType: data.eventType || "wedding",
        location: data.location || "",
        date: data.date ? data.date.split("T")[0] : "",
        description: data.description || "",
        clientName: data.clientName || "",
        clientEmail: data.clientEmail || "",
        clientPhone: data.clientPhone || "",
        tags: data.tags ? data.tags.join(", ") : "",
        status: data.status || "draft",
        featured: data.featured || false,
        // Gallery settings
        allowDownloads: data.settings?.allowDownloads || false,
        password: data.settings?.password || "",
        expiresAt: data.settings?.expiresAt ? data.settings.expiresAt.split("T")[0] : ""
      });

      if (data.coverImage?.url) {
        setCoverPreview(data.coverImage.url);
      }
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }
      
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.eventName.trim()) {
      errors.eventName = "Event name is required";
    }
    
    if (!formData.eventType) {
      errors.eventType = "Event type is required";
    }
    
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    
    if (!formData.date) {
      errors.date = "Date is required";
    }
    
    // Validate email if provided
    if (formData.clientEmail && !/^\S+@\S+\.\S+$/.test(formData.clientEmail)) {
      errors.clientEmail = "Please enter a valid email address";
    }
    
    // Validate phone if provided (basic validation)
    if (formData.clientPhone && !/^[\d\s\-+()]{10,}$/.test(formData.clientPhone)) {
      errors.clientPhone = "Please enter a valid phone number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          // Send as comma-separated string
          formDataToSend.append('tags', formData.tags);
        } else if (key === 'featured' || key === 'allowDownloads') {
          formDataToSend.append(key, formData[key] ? 'true' : 'false');
        } else if (key === 'password' && !formData.password) {
          // Don't send empty password
          return;
        } else if (key === 'expiresAt' && !formData.expiresAt) {
          // Don't send empty expiration date
          return;
        } else if (key === 'clientEmail' || key === 'clientPhone') {
          // Only send if not empty
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add settings object for the backend
      formDataToSend.append('settings', JSON.stringify({
        allowDownloads: formData.allowDownloads,
        password: formData.password || null,
        expiresAt: formData.expiresAt || null
      }));

      // Upload cover image if changed
      if (coverImage) {
        formDataToSend.append('coverImage', coverImage);
        console.log('📸 Uploading image:', {
          name: coverImage.name,
          type: coverImage.type,
          size: `${(coverImage.size / 1024).toFixed(2)}KB`
        });
      }

      const url = isEditMode 
        ? `${API_URL}/api/events/${eventId}`
        : `${API_URL}/api/events`;

      console.log('📡 Sending to:', url);
      
      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formDataToSend
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Success:', data);
      
      setSuccessMessage(`Event ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete event");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-8 h-8 text-white animate-spin mb-4"
          />
          <p className="text-white/60">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-light text-white">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </h1>
          </div>

          {isEditMode && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
              <span>Delete Event</span>
            </button>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400"
          >
            <p className="text-sm">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
          >
            <p className="font-medium mb-1">Error:</p>
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <label className="block text-white/80 text-sm uppercase tracking-wider mb-4">
              <FontAwesomeIcon icon={faImage} className="w-3 h-3 mr-2" /> Cover Image
            </label>

            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faImage}
                      className="w-8 h-8 text-gray-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="coverImage"
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors cursor-pointer flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faUpload} className="w-4 h-4" />
                  <span>{coverPreview ? "Change Image" : "Upload Image"}</span>
                </label>
                {coverPreview && !coverImage && isEditMode && (
                  <p className="text-xs text-gray-400 mt-2">
                    Current cover image (upload new to replace)
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Max size: 10MB. Recommended: 1200x800px
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-medium text-white mb-4">Event Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white ${
                    validationErrors.eventName ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {validationErrors.eventName && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.eventName}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white ${
                    validationErrors.eventType ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="wedding">Wedding</option>
                  <option value="portrait">Portrait</option>
                  <option value="commercial">Commercial</option>
                  <option value="event">Event</option>
                  <option value="fashion">Fashion</option>
                  <option value="product">Product</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.eventType && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.eventType}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white ${
                    validationErrors.location ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {validationErrors.location && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white ${
                    validationErrors.date ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {validationErrors.date && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-medium text-white mb-4">Client Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-2" />
                  Client Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-2" />
                  Client Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white ${
                    validationErrors.clientEmail ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {validationErrors.clientEmail && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.clientEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faPhone} className="w-3 h-3 mr-2" />
                  Client Phone
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white ${
                    validationErrors.clientPhone ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {validationErrors.clientPhone && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.clientPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faTag} className="w-3 h-3 mr-2" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="wedding, outdoor, summer"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the event..."
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            />
          </div>

          {/* Gallery Settings */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-medium text-white mb-4">Gallery Settings</h2>
            
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowDownloads"
                  checked={formData.allowDownloads}
                  onChange={handleChange}
                  className="w-4 h-4 bg-gray-700/50 border border-gray-600 rounded focus:ring-2 focus:ring-white/30"
                />
                <span className="text-white/80 text-sm">Allow Downloads</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faLock} className="w-3 h-3 mr-2" />
                  Password Protection
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave empty for no password"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-2" />
                  Gallery Expires On
                </label>
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                />
              </div>
            </div>
          </div>

          {/* Status & Featured */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center mt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 bg-gray-700/50 border border-gray-600 rounded focus:ring-2 focus:ring-white/30"
                  />
                  <span className="text-white/80 text-sm">Featured Event</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                  <span>{isEditMode ? "Update Event" : "Create Event"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;