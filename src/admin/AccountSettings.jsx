import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faSpinner,
  faSave,
  faCheckCircle,
  faExclamationCircle,
  faCamera,
  faEye,
  faEyeSlash,
  faShield,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AccountSettings = ({ user, onLogout }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.profileImage || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setProfileMessage({ type: "success", text: "Profile updated successfully" });

      // Update user in parent if onLogout provides re-auth
      if (data.name) setName(data.name);
      if (data.email) setEmail(data.email);
      if (data.profileImage) setProfilePreview(data.profileImage);

      // Refresh user token/info by triggering re-fetch
      // User will need to re-login for token changes (simplest approach)
    } catch (err) {
      setProfileMessage({ type: "error", text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setPasswordMessage({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Profile Section */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-medium text-white flex items-center mb-6">
          <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2 text-gray-400" />
          Profile Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FontAwesomeIcon icon={faUser} className="w-8 h-8" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-white text-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors shadow-lg">
              <FontAwesomeIcon icon={faCamera} className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-2" />
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              />
            </div>
          </div>

          {profileMessage && (
            <div
              className={`flex items-center space-x-2 text-sm px-4 py-3 rounded-lg ${
                profileMessage.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              <FontAwesomeIcon
                icon={profileMessage.type === "success" ? faCheckCircle : faExclamationCircle}
                className="w-4 h-4 shrink-0"
              />
              <span>{profileMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={profileSaving}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon
              icon={profileSaving ? faSpinner : faSave}
              className={`w-4 h-4 ${profileSaving ? "animate-spin" : ""}`}
            />
            <span>{profileSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-medium text-white flex items-center mb-6">
          <FontAwesomeIcon icon={faShield} className="w-5 h-5 mr-2 text-gray-400" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
              <FontAwesomeIcon icon={faKey} className="w-3 h-3 mr-2" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FontAwesomeIcon icon={showCurrent ? faEyeSlash : faEye} className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faLock} className="w-3 h-3 mr-2" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="block text-white/80 text-sm uppercase tracking-wider mb-2">
                <FontAwesomeIcon icon={faLock} className="w-3 h-3 mr-2" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`flex items-center space-x-2 text-sm px-4 py-3 rounded-lg ${
                passwordMessage.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              <FontAwesomeIcon
                icon={passwordMessage.type === "success" ? faCheckCircle : faExclamationCircle}
                className="w-4 h-4 shrink-0"
              />
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={passwordSaving}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon
              icon={passwordSaving ? faSpinner : faSave}
              className={`w-4 h-4 ${passwordSaving ? "animate-spin" : ""}`}
            />
            <span>{passwordSaving ? "Changing..." : "Change Password"}</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AccountSettings;
