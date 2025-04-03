
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import CreatePostForm from "../components/CreatePostForm";
import PostList from "../components/PostList";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Post } from "../components/PostCard";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  
  // Initialize with sample posts if none exist
  useEffect(() => {
    const existingPosts = localStorage.getItem("vibeswipe_posts");
    if (!existingPosts) {
      // Sample posts data
      const samplePosts: Post[] = [
        {
          id: "1",
          title: "Breathtaking Views: The Most Beautiful Landscapes Around the World",
          content: "From the majestic mountains of Patagonia to the serene beaches of Thailand, our planet offers countless breathtaking vistas. In this post, we explore some of the most stunning natural landscapes that will inspire your next adventure.",
          category: "Travel",
          imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          author: "Jane Cooper",
          authorImage: "https://randomuser.me/api/portraits/women/1.jpg",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          likes: 42,
          comments: []
        },
        {
          id: "2",
          title: "Healthy Eating: Colorful Meals That Boost Your Immune System",
          content: "Eating a rainbow of fruits and vegetables is one of the best ways to get a wide variety of nutrients that support your immune system. Here are some delicious and colorful meal ideas that are as nutritious as they are beautiful.",
          category: "Food",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          author: "Robert Fox",
          authorImage: "https://randomuser.me/api/portraits/men/2.jpg",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          likes: 29,
          comments: []
        },
        {
          id: "3",
          title: "Tech Talk: The Latest Gadgets You Need to Check Out",
          content: "Technology is evolving faster than ever, and staying up-to-date with the latest gadgets can be challenging. In this post, we review some of the most innovative tech products that have hit the market recently.",
          category: "Technology",
          imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
          author: "Devon Lane",
          authorImage: "https://randomuser.me/api/portraits/men/4.jpg",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
          likes: 15,
          comments: []
        }
      ];
      
      localStorage.setItem("vibeswipe_posts", JSON.stringify(samplePosts));
    }
  }, []);
  
  const handleCreatePostSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowCreatePostForm(false);
  };
  
  const categories = ["All", "Travel", "Food", "Fashion", "Technology", "Fitness", "Art", "Wellness"];
  
  return (
    <div className="container mx-auto px-4 pt-6 pb-20 md:pt-20 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-gray-500">Explore the latest trends and stories</p>
          </div>
          
          <div className="mb-6">
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center">
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" className="ml-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex overflow-x-auto pb-4 mb-6 space-x-2 no-scrollbar">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    category === selectedCategory 
                      ? "bg-vibe-red text-white" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <PostList 
            category={selectedCategory} 
            searchQuery={searchQuery} 
            refreshTrigger={refreshTrigger} 
          />
        </div>
        
        <div className="space-y-6">
          {isAuthenticated ? (
            <>
              {showCreatePostForm ? (
                <CreatePostForm onSuccess={handleCreatePostSuccess} />
              ) : (
                <Card className="bg-gradient-to-r from-vibe-red/10 to-vibe-purple/10 border-none">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mb-2">Share your thoughts</h3>
                    <p className="text-gray-600 mb-4">Create a post and connect with the community</p>
                    <Button 
                      className="bg-vibe-red hover:bg-vibe-red/90"
                      onClick={() => setShowCreatePostForm(true)}
                    >
                      Create a Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-gradient-to-r from-vibe-red/10 to-vibe-purple/10 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">Join the conversation</h3>
                <p className="text-gray-600 mb-4">Log in to create posts and interact with other users</p>
                <Button 
                  className="bg-vibe-red hover:bg-vibe-red/90"
                  onClick={() => window.location.href = "/auth"}
                >
                  Log In / Sign Up
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["#photography", "#cooking", "#travel", "#fitness", "#technology", "#fashion", "#art", "#health"].map(tag => (
                  <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
