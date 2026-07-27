import { motion } from "framer-motion";

// Font Awesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faHeart,
  faLocationDot,
  faBriefcase,
  faCalendar,
  faUsers,
  faImage,
  faQuoteRight,
  faEnvelope,
  faDownload,
  faCircleCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faXTwitter,
  faPinterest,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

import photographerImage from "../assets/photos/unknown.webp";

const About = () => {
  const socialLinks = [
    {
      href: "https://instagram.com/jacques_photographer",
      icon: faInstagram,
      label: "Instagram",
    },
    {
      href: "https://x.com/jacques_photographer",
      icon: faXTwitter,
      label: "X (Twitter)",
    },
    {
      href: "https://facebook.com/KeddyJacques",
      icon: faFacebookF,
      label: "Facebook",
    },
    {
      href: "https://pinterest.com/jacques_photographer",
      icon: faPinterest,
      label: "Pinterest",
    },
  ];

  const stats = [
    { icon: faCalendar, value: "3+", label: "Years Experience" },
    { icon: faUsers, value: "200+", label: "Happy Couples" },
    { icon: faBriefcase, value: "50+", label: "Brands" },
    { icon: faImage, value: "10k+", label: "Moments Captured" },
  ];

  const values = [
    {
      title: "Authentic",
      description:
        "I capture real moments, not staged ones. No forced poses, just genuine emotion.",
    },
    {
      title: "Documentary",
      description:
        "My approach is to observe and document, never interrupt the flow of your day.",
    },
    {
      title: "Timeless",
      description:
        "Images that transcend trends and look beautiful for generations.",
    },
  ];

  return (
    <div className="pt-16 pb-16 sm:pt-20 sm:pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
            About Jacques_photographer
          </h1>
          <div className="w-20 h-[2px] bg-white mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Documentary wedding & portrait photographer based in Rwanda,
            available for assignments worldwide.
          </p>
        </motion.div>

        {/* Main Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-start">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto sm:mx-0 max-w-md sm:max-w-none"
          >
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-xl">
                <img
                  src={photographerImage}
                  loading="lazy"
                  alt="Jacques - Photographer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-white -z-10 rounded-lg" />
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 border-2 border-white -z-10 rounded-lg" />

              {/* Badge */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-black/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="w-4 h-4 text-white"
                  />
                  <span className="text-xs sm:text-sm font-medium text-white">
                    Since 2023
                  </span>
                </div>
              </div>
            </div>

            {/* Social Proof Floating Card */}
            <div className="absolute top-12 -right-12 bg-gray-900 p-4 rounded-lg shadow-xl hidden xl:block">
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
                <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
                <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
                <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
                <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-white">
                5.0 (150+ reviews)
              </p>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Name & Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2">
                Jacques_photographer
              </h2>
              <p className="text-lg text-gray-400">
                Documentary Photographer
              </p>
            </div>

            <div className="w-16 h-[2px] bg-white" />

            {/* Philosophy Quote */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faQuoteRight}
                className="absolute -top-4 -left-2 sm:-left-4 w-8 h-8 text-gray-800 opacity-50"
              />
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light italic pl-4 sm:pl-6">
                "Based in Rwanda, I've been documenting authentic moments for
                over a decade. My approach is documentary-style — I don't stage,
                I observe. Every photograph tells a real story, captured as it
                unfolds."
              </p>
            </div>

            {/* Philosophy Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-4 bg-gray-900/50 rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="w-5 h-5 text-white mb-2"
                  />
                  <h4 className="text-sm font-medium text-white mb-1">
                    {value.title}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FontAwesomeIcon
                      icon={stat.icon}
                      className="w-5 h-5 text-white"
                    />
                  </div>
                  <div className="text-xl md:text-2xl font-light text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Clients / Publications */}
            <div className="pt-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                Featured In
              </h3>
              <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                <span className="text-gray-600 text-lg font-light">VOGUE</span>
                <span className="text-gray-600 text-lg font-light">BRIDES</span>
                <span className="text-gray-600 text-lg font-light">ROLLING STONE</span>
                <span className="text-gray-600 text-lg font-light">NY TIMES</span>
              </div>
            </div>

            {/* Connect & CTA */}
            <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-800">
              {/* Social Connect Section */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Connect With Me
                </h3>
                <div className="flex space-x-3">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-md"
                      aria-label={link.label}
                    >
                      <FontAwesomeIcon
                        icon={link.icon}
                        className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-white to-gray-200 text-black text-sm font-semibold uppercase tracking-wider overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300"
                    />
                    Inquire Now
                  </span>
                </a>

                <a
                  href="/work"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-gray-700 text-gray-300 text-sm font-semibold uppercase tracking-wider rounded-xl hover:bg-white hover:text-black hover:border-white transition-all duration-300 hover:scale-105"
                >
                  View Portfolio
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* My Approach Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6 }}
          className="mt-16 sm:mt-20 pt-16 sm:pt-20 border-t border-gray-800"
        >
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
              My Approach
            </h2>
            <div className="w-16 h-[2px] bg-white mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto">
              I believe in invisible photography — being present without being
              intrusive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Passion</h3>
              <p className="text-gray-400 text-sm">
                Every wedding, every portrait is treated with the same care and
                attention to detail.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faLocationDot} className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Roots</h3>
              <p className="text-gray-400 text-sm">
                Proudly based in Rwanda, bringing African stories to the world.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCamera} className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Craft</h3>
              <p className="text-gray-400 text-sm">
                Constantly learning, evolving, and pushing creative boundaries.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Press Kit Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.7 }}
          className="mt-16 sm:mt-20 p-6 sm:p-8 bg-gray-900/50 rounded-2xl border border-gray-800"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
                <FontAwesomeIcon
                  icon={faDownload}
                  className="w-5 h-5 text-black"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Press Kit</h3>
                <p className="text-sm text-gray-400">
                  Download my media kit, bio, and high-resolution headshots
                </p>
              </div>
            </div>
            <a
              href="/press-kit.pdf"
              className="inline-flex items-center px-6 py-3 bg-white text-black text-sm uppercase tracking-wider font-medium hover:bg-gray-200 transition-colors duration-300 rounded-lg shrink-0"
            >
              <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
              Download Press Kit
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
