import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCamera,
  faVideo,
  faImage
} from '@fortawesome/free-solid-svg-icons';

// Import brand icons from free-brands-svg-icons
import {
  faInstagram,
  faXTwitter,
  faFacebookF
} from '@fortawesome/free-brands-svg-icons';

const Home = () => {
  // Replace with your actual hero image or video
  const heroImage = '/photos/photo1.jpg';
  // Optional: Use video instead of image
  // const heroVideo = '/videos/hero-reel.mp4';

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {/* Option 1: Image Background */}
        <img
          src={heroImage}
          alt="Photography portfolio hero"
          className="w-full h-full object-cover"
        />
        
        {/* Option 2: Video Background (uncomment to use) */}
        {/* <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        /> */}
        
        {/* Gradient Overlay - More artistic than solid black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* Badge / Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block px-4 py-2 mb-6 text-xs uppercase tracking-[0.3em] text-white/80 border border-white/30 backdrop-blur-sm rounded-full"
          >
            Based in New York
          </motion.span>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-wide">
            Capturing Moments and 
            <br />
            <span className="font-medium relative inline-block">
              Best quality always
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-2 left-0 h-[2px] bg-white/50"
              />
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Documentary-style photography for weddings, portraits, and brands.
            <br className="hidden md:block" />
            Timeless images that tell your unique story.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/work"
              className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 text-sm uppercase tracking-wider font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>View Portfolio</span>
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              />
            </Link>
            
            <Link
              to="/contact"
              className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 text-sm uppercase tracking-wider font-medium backdrop-blur-sm"
            >
              <span>Inquire Now</span>
              <FontAwesomeIcon 
                icon={faCamera} 
                className="ml-3 w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" 
              />
            </Link>
          </motion.div>

          {/* Stats / Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center space-x-8 mt-16"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-white">3+</div>
              <div className="text-xs uppercase tracking-wider text-white/60 mt-1">Years</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-white">200+</div>
              <div className="text-xs uppercase tracking-wider text-white/60 mt-1">Weddings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-white">50+</div>
              <div className="text-xs uppercase tracking-wider text-white/60 mt-1">Brands</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Side Social Links (Vertical) - Optional */}
      <div className="absolute left-8 bottom-1/2 transform translate-y-1/2 hidden lg:block">
        <div className="flex flex-col items-center space-y-4">
          <a
            href="https://instagram.com/jacques_photographer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/jacques_photographer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com/KeddyJacques"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
          </a>
          <div className="w-[1px] h-12 bg-white/30 mt-2" />
        </div>
      </div>

      {/* Media Type Indicator */}
      <div className="absolute right-8 bottom-8 hidden lg:block">
        <div className="flex items-center space-x-3 text-white/60 text-xs uppercase tracking-wider">
          <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
          <span>Photo</span>
          <span className="mx-2">•</span>
          <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
          <span>Video</span>
        </div>
      </div>
    </div>
  );
};

export default Home;