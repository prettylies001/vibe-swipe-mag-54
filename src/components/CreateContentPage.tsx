
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreatePostForm from "../components/CreatePostForm";
import VideoUploadForm from "../components/VideoUploadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Image } from "lucide-react";
import { toast } from "sonner";

const CreateContentPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const defaultTab = location.state?.activeTab || "post";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  const handlePostSuccess = () => {
    toast.success("Post created successfully!");
    // Navigate programmatically after success
    window.location.href = "/";
  };

  const handleVideoSuccess = () => {
    toast.success("Video uploaded successfully!");
    // Navigate programmatically after success
    window.location.href = "/videos";
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Content</h1>
        
        <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="post" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Post</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Video</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="post">
            <CreatePostForm onSuccess={handlePostSuccess} />
          </TabsContent>
          
          <TabsContent value="video">
            <VideoUploadForm onSuccess={handleVideoSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateContentPage;
