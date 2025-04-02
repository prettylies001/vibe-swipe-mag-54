
import { Link } from "react-router-dom";
import { Home, Video, LogIn, User, PlusCircle, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();

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
        
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-vibe-dark hover:text-vibe-red hover:bg-transparent"
              >
                <Bell size={20} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-vibe-dark hover:text-vibe-red hover:bg-transparent"
                asChild
              >
                <Link to="/create">
                  <PlusCircle size={20} />
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username} />
                      <AvatarFallback>{currentUser?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {currentUser?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button className="bg-vibe-red hover:bg-opacity-90 transition-colors" asChild>
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
        
        {/* Mobile bottom nav has login link */}
        <div className="md:hidden fixed bottom-0 right-4 mb-20">
          {isAuthenticated ? (
            <Link to="/profile">
              <Button className="rounded-full h-12 w-12 bg-vibe-red hover:bg-opacity-90 shadow-lg p-0">
                <User size={20} />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button className="rounded-full h-12 w-12 bg-vibe-red hover:bg-opacity-90 shadow-lg p-0">
                <LogIn size={20} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
