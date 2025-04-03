
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import CreatePostForm from "../components/CreatePostForm";
import PostList from "../components/PostList";
import PollList from "../components/PollList";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { Post } from "../components/PostCard";
import { Poll } from "../components/PollCreationForm";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [contentType, setContentType] = useState("posts");
  const navigate = useNavigate();
  
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
    
    // Initialize sample polls if none exist
    const existingPolls = localStorage.getItem("aselit_polls");
    if (!existingPolls) {
      const samplePolls: Poll[] = [
        {
          id: "poll1",
          question: "What meditation technique do you find most effective?",
          options: [
            { id: "opt1", text: "Mindfulness meditation", votes: 45 },
            { id: "opt2", text: "Guided visualization", votes: 32 },
            { id: "opt3", text: "Breathing exercises", votes: 67 },
            { id: "opt4", text: "Body scan meditation", votes: 18 }
          ],
          totalVotes: 162,
          author: "Mindful Maven",
          authorImage: "https://randomuser.me/api/portraits/women/65.jpg",
          category: "Headspace",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
        },
        {
          id: "poll2",
          question: "How often do you practice mindfulness?",
          options: [
            { id: "opt1", text: "Daily", votes: 85 },
            { id: "opt2", text: "A few times a week", votes: 120 },
            { id: "opt3", text: "Occasionally", votes: 95 },
            { id: "opt4", text: "Rarely", votes: 40 }
          ],
          totalVotes: 340,
          author: "Zen Master",
          authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
          category: "Headspace",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
        }
      ];
      
      localStorage.setItem("aselit_polls", JSON.stringify(samplePolls));
    }
  }, []);
  
  const navigateToCreate = (type: string) => {
    navigate('/create', { state: { activeTab: type } });
  };
  
  const categories = ["All", "Travel", "Food", "Fashion", "Technology", "Fitness", "Art", "Wellness", "Headspace"];
  
  return (
    <div className="container mx-auto px-4 pt-6 pb-20 md:pt-20 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className="text-muted-foreground">Explore the latest trends and stories</p>
          </div>
          
          <div className="mb-6">
            <Card className="mb-6 bg-card dark-transition">
              <CardContent className="py-4">
                <div className="flex items-center">
                  <Input
                    placeholder="Search content..."
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
            
            <Tabs value={contentType} onValueChange={setContentType} className="mb-6">
              <TabsList className="w-full">
                <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
                <TabsTrigger value="polls" className="flex-1">Polls</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex overflow-x-auto pb-4 mb-6 space-x-2 no-scrollbar">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    category === selectedCategory 
                      ? "bg-aselit-purple text-white" 
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {contentType === "posts" ? (
            <PostList 
              category={selectedCategory} 
              searchQuery={searchQuery} 
              refreshTrigger={refreshTrigger} 
            />
          ) : (
            <PollList 
              category={selectedCategory} 
              refreshTrigger={refreshTrigger} 
            />
          )}
        </div>
        
        <div className="space-y-6">
          {isAuthenticated ? (
            <Card className="bg-gradient-to-r from-aselit-purple/10 to-aselit-blue/10 border-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Create content</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    className="flex flex-col items-center justify-center h-24 bg-aselit-purple/20 hover:bg-aselit-purple/30 text-foreground border border-transparent"
                    onClick={() => navigateToCreate('post')}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Post</span>
                  </Button>
                  
                  <Button 
                    className="flex flex-col items-center justify-center h-24 bg-aselit-purple/20 hover:bg-aselit-purple/30 text-foreground border border-transparent"
                    onClick={() => navigateToCreate('poll')}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Poll</span>
                  </Button>
                  
                  <Button 
                    className="flex flex-col items-center justify-center h-24 bg-aselit-purple/20 hover:bg-aselit-purple/30 text-foreground border border-transparent"
                    onClick={() => navigateToCreate('video')}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Video</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-r from-aselit-purple/10 to-aselit-blue/10 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">Join the conversation</h3>
                <p className="text-gray-600 mb-4">Log in to create posts and interact with other users</p>
                <Button 
                  className="bg-aselit-purple hover:bg-aselit-purple/90"
                  onClick={() => window.location.href = "/auth"}
                >
                  Log In / Sign Up
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-card dark-transition">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["#photography", "#cooking", "#travel", "#fitness", "#technology", "#fashion", "#art", "#health", "#headspace", "#meditation"].map(tag => (
                  <span key={tag} className="bg-muted px-3 py-1 rounded-full text-sm text-foreground hover:bg-muted/80 cursor-pointer">
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
