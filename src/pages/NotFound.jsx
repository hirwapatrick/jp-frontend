import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Simple 404 */}
        <div className="mb-8">
          <h1 className="text-8xl font-light text-gray-900 dark:text-white mb-2">
            404
          </h1>
          <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            This page doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full py-3 px-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <Link
            to="/work"
            className="block w-full py-3 px-4 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <FontAwesomeIcon icon={faCompass} className="w-4 h-4 mr-2" />
            Explore Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;