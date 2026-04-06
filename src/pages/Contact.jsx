import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Font Awesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelope,
  faLocationDot,
  faClock,
  faPhone,
  faCalendar,
  faUser,
  faComment,
  faCheckCircle,
  faCircleNotch,
  faCamera,
  faMapLocation,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faXTwitter,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Contact = () => {
  // Define all state variables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    customEventType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(""); // Make sure setError is defined here

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't submit if already submitting
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(""); // Clear any previous errors

    // Validate required fields client-side
    if (!formData.name.trim()) {
      setError("Please enter your name");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email");
      setIsSubmitting(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (!formData.eventType) {
      setError("Please select a project type");
      setIsSubmitting(false);
      return;
    }

    if (formData.eventType === "other" && !formData.customEventType.trim()) {
      setError("Please enter your custom project type");
      setIsSubmitting(false);
      return;
    }

    if (!formData.message.trim()) {
      setError("Please enter your message");
      setIsSubmitting(false);
      return;
    }

    const finalData = {
      ...formData,
      eventType:
        formData.eventType === "other"
          ? formData.customEventType
          : formData.eventType,
    };

    try {
      console.log("Submitting form data:", formData);

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      // Try to parse response as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to send message (Status: ${response.status})`,
        );
      }

      // Success!
      console.log("Form submitted successfully:", data);

      setIsSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        eventType: "",
        customEventType: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error("Contact form error:", err);

      // Set user-friendly error message
      if (err.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to server. Please check your internet connection.",
        );
      } else {
        setError(err.message || "Failed to send message. Please try again.");
      }

      // Auto-hide error after 8 seconds
      setTimeout(() => setError(""), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    "Wedding",
    "Portrait",
    "Commercial",
    "Event",
    "Fine Art",
    "Other",
  ];

  return (
    <div className="pt-20 pb-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-4">
            Let's Create Something Beautiful
          </h1>
          <div className="w-20 h-[2px] bg-gray-900 dark:bg-white mx-auto mb-6" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Available for commissions worldwide. Tell me about your vision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Intro Text */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white">
                Get in Touch
              </h2>
              <div className="w-16 h-[2px] bg-gray-900 dark:bg-white" />

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                I'm currently accepting new projects. Whether it's a wedding,
                commercial campaign, or portrait session, I'd love to hear about
                your story.
              </p>
            </div>

            {/* Contact Details Cards */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="w-5 h-5 text-white dark:text-gray-900"
                  />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    <a href="mailto:tzrjcqs@gmail.com">tzrjcqs@gmail.com</a>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Response within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="w-5 h-5 text-white dark:text-gray-900"
                  />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Phone
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    <a href="tel:+250728474535">+250728474535</a>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mon-Fri, 9am-6pm EST
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="w-5 h-5 text-white dark:text-gray-900"
                  />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    Studio
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    Kigali, RW
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Available in East Africa
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Connect Online
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/jacques_photographer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/jacques_photographer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/KeddyJacques"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Map/Studio Image */}
            <div className="relative h-48 rounded-lg overflow-hidden mt-6 group">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
                alt="Studio"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faMapLocation}
                    className="w-8 h-8 text-white mb-2"
                  />
                  <p className="text-white text-sm uppercase tracking-wider">
                    Visit the Studio
                  </p>
                  <p className="text-white/80 text-xs">By appointment only</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Enhanced Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-50 dark:bg-gray-900/30 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-light text-gray-900 dark:text-white mb-6 flex items-center">
                <FontAwesomeIcon
                  icon={faComment}
                  className="w-5 h-5 mr-3 text-gray-500"
                />
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-gray-900 dark:text-white rounded-lg"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="w-3 h-3 mr-2"
                    />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-gray-900 dark:text-white rounded-lg"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                  >
                    <FontAwesomeIcon icon={faPhone} className="w-3 h-3 mr-2" />
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-gray-900 dark:text-white rounded-lg"
                    placeholder="+1 (212) 555-0123"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Event Type Dropdown */}
                {/* Event Type Dropdown */}
                <div>
                  <label
                    htmlFor="eventType"
                    className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                  >
                    <FontAwesomeIcon icon={faCamera} className="w-3 h-3 mr-2" />
                    Project Type *
                  </label>

                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-gray-900 dark:text-white rounded-lg appearance-none"
                  >
                    <option value="">Select a project type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {/* Custom Project Input */}
                  <AnimatePresence>
                    {formData.eventType === "other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          name="customEventType"
                          placeholder="Enter your project type"
                          value={formData.customEventType}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          required
                          className="mt-4 w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-gray-900 dark:text-white rounded-lg"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Event Date */}
                <div>
                  <label
                    htmlFor="eventDate"
                    className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                  >
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="w-3 h-3 mr-2"
                    />
                    Event Date / Timeline
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-gray-900 dark:text-white rounded-lg"
                    placeholder="MM/YYYY or TBD"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                  >
                    <FontAwesomeIcon
                      icon={faComment}
                      className="w-3 h-3 mr-2"
                    />
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-white outline-none transition-colors text-gray-900 dark:text-white rounded-lg resize-none"
                    placeholder="Tell me about your vision, budget, and any specific requirements..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
                      />
                      <span className="text-red-700 dark:text-red-300 text-sm">
                        {error}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full px-8 py-4 bg-gray-900 text-white 
                    dark:bg-white dark:text-black 
                    transition-all duration-300 text-sm uppercase tracking-wider font-medium 
                    flex items-center justify-center space-x-3
                    rounded-lg relative overflow-hidden
                    ${isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-800 dark:hover:bg-gray-100"}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="w-4 h-4 animate-spin"
                      />
                      <span>Sending...</span>
                    </>
                  ) : isSubmitted ? (
                    <>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-4 h-4"
                      />
                      <span>Message Sent!</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                {/* Success Message */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center"
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
                      />
                      <span className="text-green-700 dark:text-green-300 text-sm">
                        Thank you! I'll respond within 24 hours.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Privacy Note */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  By submitting this form, you agree to be contacted about your
                  inquiry. Your information will never be shared.
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-20 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-[2px] bg-gray-900 dark:bg-white mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faClock}
                  className="w-5 h-5 text-gray-900 dark:text-white"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Response Time
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                I aim to respond to all inquiries within 24 hours on weekdays.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faMapLocation}
                  className="w-5 h-5 text-gray-900 dark:text-white"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Travel
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Available in East Africa. Travel fees apply for destinations outside
                Kigali.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faCamera}
                  className="w-5 h-5 text-gray-900 dark:text-white"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Booking Process
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                50% retainer secures your date. Final gallery delivered in 2
                weeks.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
