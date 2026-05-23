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
          className="w-full h-full object-cover scale-105"
        />

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
      </div>

      {/* Floating Banner */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-[700px]"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md">
          {/* Banner Image */}
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-24 md:h-28 object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/45" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-between px-5 md:px-8">
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/70 mb-1">
                Limited Sessions Open
              </p>

              <h2 className="text-white text-sm md:text-xl font-semibold">
                Wedding & Brand Photography 2026
              </h2>
            </div>

            <Link
              to="/contact"
              className="bg-white text-black px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center text-center px-6 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 border border-white/20 bg-white/10 backdrop-blur-md rounded-full mb-8"
          >
            <FontAwesomeIcon
              icon={faCamera}
              className="text-white text-xs"
            />

            <span className="text-white/80 text-xs uppercase tracking-[0.3em]">
              Based in Rwanda
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[1.05] tracking-tight">
            Capturing
            <span className="block font-semibold mt-2">
              Timeless Moments
            </span>
          </h1>

          {/* Accent Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[2px] bg-white/60 mx-auto mt-8 mb-8"
          />

          {/* Description */}
          <p className="text-white/75 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
            Luxury documentary photography for weddings, portraits,
            editorials, and modern brands.
            <br className="hidden md:block" />
            Creating emotional imagery that feels authentic and timeless.
          </p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12"
          >
            <Link
              to="/work"
              className="group px-8 py-4 bg-white text-black rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:scale-105 transition-all duration-300 flex items-center"
            >
              View Portfolio

              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-3 text-xs group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              to="/contact"
              className="group px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-md text-white rounded-full uppercase tracking-[0.2em] text-xs font-semibold hover:bg-white/20 transition-all duration-300 flex items-center"
            >
              Inquire Now

              <FontAwesomeIcon
                icon={faCamera}
                className="ml-3 text-xs"
              />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-10 md:gap-16 mt-20"
          >
            {[
              { value: "3+", label: "Years Experience" },
              { value: "200+", label: "Weddings" },
              { value: "50+", label: "Brands" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-white text-3xl md:text-4xl font-light">
                  {item.value}
                </h3>

                <p className="text-white/50 text-xs uppercase tracking-[0.2em] mt-2">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Social Links */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-5 z-20">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white transition-all hover:scale-110"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>

        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white transition-all hover:scale-110"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white transition-all hover:scale-110"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>

        <div className="w-[1px] h-20 bg-white/20" />
      </div>

      {/* Bottom Right Indicator */}
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