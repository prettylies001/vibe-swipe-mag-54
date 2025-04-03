
import React, { createContext, useState, useContext, useEffect } from "react";

// Define user type
export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: string;
}

// Define auth context type
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@vibeswipe.com",
    username: "admin",
    avatarUrl: "https://i.pravatar.cc/150?u=admin",
    password: "password123",
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@example.com",
    username: "regularuser",
    avatarUrl: "https://i.pravatar.cc/150?u=user",
    password: "password123",
    isAdmin: false,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkLoggedIn = () => {
      const userData = localStorage.getItem("vibeswipe_user");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
      setIsLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }
    
    // Remove password before storing
    const { password: _, ...userWithoutPassword } = user;
    
    // Store user in localStorage
    localStorage.setItem("vibeswipe_user", JSON.stringify(userWithoutPassword));
    setCurrentUser(userWithoutPassword);
    setIsLoading(false);
  };

  // Register function
  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      setIsLoading(false);
      throw new Error("Email already in use");
    }
    
    // Create new user
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      username,
      avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };
    
    // Store user in localStorage
    localStorage.setItem("vibeswipe_user", JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("vibeswipe_user");
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      isAuthenticated,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
