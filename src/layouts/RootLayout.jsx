import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import WhatsAppButton from "../components/WhatsAppButton";
import { motion, AnimatePresence } from "framer-motion";

const RootLayout = () => {
  const location = useLocation();

  // Detect admin route
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Hide Navigation on /admin */}
      {!isAdmin && <Navigation />}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Hide Footer on /admin */}
      {!isAdmin && <Footer />}

      {/* Floating Buttons (Hidden on /admin) */}
      {!isAdmin && (
        <>
          <WhatsAppButton />
          <ScrollToTopButton />
        </>
      )}
    </div>
  );
};

export default RootLayout;
