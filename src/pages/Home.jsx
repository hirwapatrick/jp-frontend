import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCamera,
  faVideo,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

import {
  faInstagram,
  faXTwitter,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

// Images
import heroImage from "../assets/photos/heroimg.jfif";
import bannerImage from "../assets/photos/banner.jpg";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Photography Hero"
          className="w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
      </div>

      {/* Floating Banner */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-5xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          {/* Banner Image */}
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-36 md:h-44 object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-between px-5 md:px-10">
            <div className="max-w-lg">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70 mb-2">
                Limited Sessions Open
              </p>

              <h2 className="text-white text-lg md:text-3xl font-semibold leading-tight">
                Wedding & Brand Photography 2026
              </h2>
            </div>

            <Link
              to="/contact"
              className="shrink-0 bg-white text-black px-5 md:px-7 py-3 rounded-full text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold hover:bg-neutral-200 transition-all duration-300 hover:scale-105"
            >
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-40 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md mb-8"
          >
            <FontAwesomeIcon icon={faCamera} className="text-white text-xs" />

            <span className="text-white/80 text-[11px] uppercase tracking-[0.3em]">
              Based in Rwanda
            </span>
          </motion.div>
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[1] tracking-tight">
            Capturing Moments and
            <span className="block font-semibold mt-3">
              Best quality always
            </span>
          </h1>

          {/* Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "140px" }}
            transition={{ delay: 0.7, duration: 1 }}
            className="h-[2px] bg-white/60 mx-auto mt-10 mb-10"
          />

          {/* Description */}
          <p className="text-white/70 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
            Luxury documentary photography for weddings, portraits, editorials,
            and modern brands creating emotional imagery that feels authentic,
            cinematic, and timeless.
          </p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12"
          >
            <Link
              to="/work"
              className="group px-8 py-4 bg-white text-black rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:scale-105 transition-all duration-300 flex items-center"
            >
              View Portfolio
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-3 text-xs group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>

            <Link
              to="/contact"
              className="group px-8 py-4 border border-white/20 bg-white/10 backdrop-blur-md text-white rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:bg-white/20 transition-all duration-300 flex items-center"
            >
              Inquire Now
              <FontAwesomeIcon icon={faCamera} className="ml-3 text-xs" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-10 md:gap-20 mt-20"
          >
            {[
              { value: "3+", label: "Years Experience" },
              { value: "200+", label: "Weddings" },
              { value: "50+", label: "Brands" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-white text-3xl md:text-5xl font-light">
                  {item.value}
                </h3>

                <p className="text-white/50 text-[11px] uppercase tracking-[0.25em] mt-3">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Social Links */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-6 z-20">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>

        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>

        <div className="w-px h-24 bg-white/20" />
      </div>

      {/* Bottom Indicator */}
      <div className="absolute right-6 bottom-6 hidden lg:flex items-center gap-4 text-white/60 text-xs uppercase tracking-[0.2em] z-20">
        <FontAwesomeIcon icon={faImage} />
        <span>Photo</span>

        <span>•</span>

        <FontAwesomeIcon icon={faVideo} />
        <span>Video</span>
      </div>
    </div>
  );
};

export default Home;
