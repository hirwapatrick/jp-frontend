import SocialLinks from './SocialLinks';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Jacques_Photographer. All rights reserved.
          </div>

          <SocialLinks />

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Designed for storytellers
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
