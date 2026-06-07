import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const Description = ({ description, tags }) => {
  const [expanded, setExpanded] = useState(false);

  if (!description && (!tags || tags.length === 0)) return null;

  const lines = description ? description.split("\n") : [];
  const preview = lines.slice(0, 3).join("\n");

  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-4">
      {description && (
        <>
          <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
            {expanded ? description : preview}
            {lines.length > 3 && !expanded && (
              <span className="text-gray-500">...</span>
            )}
          </div>

          {lines.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </>
      )}

      {tags && tags.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${description ? "mt-4 pt-4 border-t border-gray-800" : ""}`}>
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/tutorials?tag=${encodeURIComponent(tag)}`}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Description;
