
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreatePostForm from "../components/CreatePostForm";
import VideoUploadForm from "../components/VideoUploadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Image, BarChart2 } from "lucide-react";
import { toast } from "sonner";

const CreateContentPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("post");

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  const handlePostSuccess = () => {
    toast.success("Post created successfully!");
    // Navigate programmatically after success
    window.location.href = "/";
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Content</h1>
        
        <Tabs defaultValue="post" value={activeTab} onValueChange={setActiveTab}>
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
            <VideoUploadForm />
          </TabsContent>
          
          <TabsContent value="poll">
            <div className="text-center py-16">
              <BarChart2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Poll Creation</h2>
              <p className="text-muted-foreground mb-6">
                Create polls to engage with the community and gather opinions.
              </p>
              <p className="text-sm text-muted-foreground">
                Coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateContentPage;
