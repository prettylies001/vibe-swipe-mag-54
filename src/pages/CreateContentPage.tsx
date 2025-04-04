
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreatePostForm from "../components/CreatePostForm";
import VideoUploadForm from "../components/VideoUploadForm";
import PollCreationForm from "../components/PollCreationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Image, BarChart2 } from "lucide-react";
import { toast } from "sonner";
import { initializeDatabase } from "../utils/db";

const CreateContentPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dbInitialized, setDbInitialized] = useState(false);
  const defaultTab = location.state?.activeTab || "post";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Initialize database when component mounts
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        toast.error("Failed to initialize the application");
      }
    };
    
    initialize();
  }, []);

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!dbInitialized) {
    return <div className="container mx-auto py-8 px-4 text-center">Initializing application...</div>;
  }
  
  const handlePostSuccess = () => {
    toast.success("Post created successfully!");
    // Navigate programmatically after success
    navigate("/");
  };

  const handleVideoSuccess = () => {
    toast.success("Video uploaded successfully!");
    // Navigate programmatically after success
    navigate("/videos");
  };
  
  const handlePollSuccess = () => {
    toast.success("Poll created successfully!");
    // Navigate to polls page
    navigate("/polls");
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Content</h1>
        
        <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="post" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Post</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Video</span>
            </TabsTrigger>
            <TabsTrigger value="poll" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Poll</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="post">
            <CreatePostForm onSuccess={handlePostSuccess} />
          </TabsContent>
          
          <TabsContent value="video">
            <VideoUploadForm onSuccess={handleVideoSuccess} />
          </TabsContent>
          
          <TabsContent value="poll">
            <PollCreationForm onSuccess={handlePollSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateContentPage;
