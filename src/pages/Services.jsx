import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faHeart,
  faUsers,
  faLocationDot,
  faCheckCircle,
  faImage,
  faVideo,
  faPrint,
  faPhone,
  faBaby,
  faBrush,
  faPalette,
  faFilm,
  faScissors,
  faMusic,
  faChampagneGlasses,
  faGraduationCap,
  faHandshake,
  faPassport,
  faLeaf,
  faBriefcase,
  faWandMagicSparkles,
  faCrop,
  faTableCells,
  faTicket,
  faPodcast,
  faCut,
  faEnvelope,
  faHeartCircleBolt,
} from "@fortawesome/free-solid-svg-icons";

const Services = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: "event-coverage",
      icon: faCamera,
      title: "Event Coverage",
      description:
        "Professional photography for all types of events and celebrations.",
      features: [
        "Wedding ceremonies & receptions",
        "Birthday parties",
        "Graduation ceremonies",
        "Conferences & meetings",
        "Concerts & shows",
        "Corporate events",
      ],
      color: "rose",
      gradient: "from-rose-500/20 to-pink-600/20",
      border: "border-rose-500/30",
      iconList: [
        faHeart,
        faChampagneGlasses,
        faGraduationCap,
        faHandshake,
        faMusic,
      ],
    },
    {
      id: "studio-photography",
      icon: faCamera,
      title: "Studio Photography",
      description: "Professional studio sessions in a controlled environment.",
      features: [
        "Passport & ID photos",
        "Family portraits",
        "Couple & engagement photos",
        "Baby & maternity photography",
        "Professional headshots",
      ],
      color: "blue",
      gradient: "from-blue-500/20 to-cyan-600/20",
      border: "border-blue-500/30",
      iconList: [faPassport, faUsers, faHeartCircleBolt, faBaby],
    },
    {
      id: "outdoor-photoshoot",
      icon: faLocationDot,
      title: "Outdoor Photoshoot",
      description: "Capture stunning moments in natural light.",
      features: [
        "Pre-wedding shoots",
        "Brand photography",
        "Engagement sessions",
        "Fashion shoots",
        "Travel photography",
      ],
      color: "emerald",
      gradient: "from-emerald-500/20 to-green-600/20",
      border: "border-emerald-500/30",
      iconList: [faHeart, faBriefcase, faLeaf],
    },
    {
      id: "photo-editing",
      icon: faWandMagicSparkles,
      title: "Photo Editing",
      description: "Professional post-processing for perfect results.",
      features: [
        "Photo restoration",
        "Color correction",
        "Retouching",
        "Background removal",
      ],
      color: "purple",
      gradient: "from-purple-500/20 to-violet-600/20",
      border: "border-purple-500/30",
      iconList: [faCrop, faPalette, faScissors],
    },
    {
      id: "photo-printing",
      icon: faPrint,
      title: "Photo Printing",
      description: "High-quality prints to preserve your memories.",
      features: [
        "Photo prints",
        "Custom frames",
        "Canvas prints",
        "Photo albums",
      ],
      color: "amber",
      gradient: "from-amber-500/20 to-orange-600/20",
      border: "border-amber-500/30",
      iconList: [faImage, faTableCells],
    },
    {
      id: "video-services",
      icon: faVideo,
      title: "Video Services",
      description: "Professional videography for events & brands.",
      features: [
        "Event highlights",
        "Live streaming",
        "Video editing",
        "Wedding films",
      ],
      color: "red",
      gradient: "from-red-500/20 to-rose-600/20",
      border: "border-red-500/30",
      iconList: [faFilm, faPodcast, faCut, faVideo],
    },
    {
      id: "design-motion",
      icon: faBrush,
      title: "Design & Motion Design",
      description:
        "Creative graphic and motion design services for events, brands, and promotions.",
      features: [
        "Wedding & event invitations",
        "Banners & roll-ups",
        "Flyers & brochures",
        "Posters & signage",
        "Business & greeting cards",
        "Motion graphics & animations",
      ],
      color: "pink",
      gradient: "from-pink-500/20 to-rose-600/20",
      border: "border-pink-500/30",
      iconList: [faEnvelope, faImage, faTicket, faTableCells, faPalette],
    },
  ];

  return (
    <div className="pt-20 pb-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-light text-center mb-16 text-gray-900 dark:text-white">
          Our Services
        </h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -8 }}
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
              className={`rounded-2xl border ${service.border} bg-gradient-to-br ${service.gradient} p-8 transition-all duration-500`}
            >
              {/* BIG ICON HEADER */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={service.icon}
                    className="text-white w-10 h-10"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-light text-white text-center mb-3">
                {service.title}
              </h2>

              <p className="text-gray-300 text-center mb-6">
                {service.description}
              </p>

              {/* Feature list */}
              <div className="space-y-3">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start text-gray-300">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="w-4 h-4 text-white mr-3 mt-1"
                    />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Mini icon strip */}
              <div className="flex justify-center gap-3 mt-6">
                {service.iconList.map((icon, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={icon}
                    className="text-white/70 w-4 h-4"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
