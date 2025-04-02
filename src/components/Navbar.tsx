
import { Link } from "react-router-dom";
import { Home, Video } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center md:mr-6">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-vibe-red to-vibe-purple bg-clip-text text-transparent">
              VibeSwipe
            </span>
          </Link>
        </div>
        
        <div className="flex justify-center flex-1 md:justify-start">
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className="flex flex-col items-center md:flex-row md:space-x-2 text-vibe-dark hover:text-vibe-red transition-colors"
            >
              <Home size={24} />
              <span className="text-xs md:text-sm">Discover</span>
            </Link>
            <Link 
              to="/videos" 
              className="flex flex-col items-center md:flex-row md:space-x-2 text-vibe-dark hover:text-vibe-red transition-colors"
            >
              <Video size={24} />
              <span className="text-xs md:text-sm">Videos</span>
            </Link>
          </div>
        </div>
        
        <div className="hidden md:block">
          <button className="px-4 py-2 bg-vibe-red text-white rounded-full hover:bg-opacity-90 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
