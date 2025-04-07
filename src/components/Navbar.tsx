
import { Link } from "react-router-dom";
import { Home, LogIn, User, PlusCircle, Brain } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-3 md:top-0 md:bottom-auto md:border-t-0 md:border-b dark-transition">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex justify-center flex-1">
          <div className="flex space-x-6 md:space-x-8">
            <Link 
              to="/" 
              className="flex flex-col items-center md:flex-row md:space-x-2 text-foreground hover:text-aselit-purple transition-colors"
            >
              <Home size={24} />
              <span className="text-xs md:text-sm">Discover</span>
            </Link>
            <Link 
              to="/headspace" 
              className="flex flex-col items-center md:flex-row md:space-x-2 text-foreground hover:text-aselit-purple transition-colors"
            >
              <Brain size={24} />
              <span className="text-xs md:text-sm">Headspace</span>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground hover:text-aselit-purple hover:bg-transparent"
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
                      <AvatarFallback>{currentUser?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
            <Button className="bg-aselit-purple hover:bg-aselit-purple-dark transition-colors" asChild>
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
