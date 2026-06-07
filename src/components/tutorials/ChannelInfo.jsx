import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

const ChannelInfo = () => {
  return (
    <div className="flex items-center gap-3 py-4 border-y border-gray-800 mb-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
        <Camera className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <Link to="/" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors">
          Jacques Photography
        </Link>
        <p className="text-xs text-gray-500">Photography Tutorials</p>
      </div>
      <Link
        to="/tutorials"
        className="text-xs px-3 py-1.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors shrink-0"
      >
        View all
      </Link>
    </div>
  );
};

export default ChannelInfo;
