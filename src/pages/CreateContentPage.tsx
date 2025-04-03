
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreatePostForm from "../components/CreatePostForm";
import PollCreationForm from "../components/PollCreationForm";
import VideoUploadForm from "../components/VideoUploadForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { FileText, BarChart2, Video } from "lucide-react";

const CreateContentPage = () => {
  const [activeTab, setActiveTab] = useState("post");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to create content");
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Content</h1>
      
      <Tabs defaultValue="post" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="post" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Create Post
          </TabsTrigger>
          <TabsTrigger value="poll" className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" /> Create Poll
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center">
            <Video className="h-4 w-4 mr-2" /> Upload Video
          </TabsTrigger>
        </TabsList>
        
        <Card className="mt-6">
          <TabsContent value="post">
            <CardHeader>
              <CardTitle>Create a New Post</CardTitle>
              <CardDescription>
                Share your thoughts, ideas, or stories with the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatePostForm 
                onSuccess={() => {
                  toast.success("Post created successfully!");
                  navigate("/");
                }}
              />
            </CardContent>
          </TabsContent>
          
          <TabsContent value="poll">
            <CardHeader>
              <CardTitle>Create a New Poll</CardTitle>
              <CardDescription>
                Ask a question and gather opinions from the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PollCreationForm 
                onSuccess={() => {
                  toast.success("Poll created successfully!");
                  navigate("/polls");
                }}
              />
            </CardContent>
          </TabsContent>
          
          <TabsContent value="video">
            <CardHeader>
              <CardTitle>Upload a Video</CardTitle>
              <CardDescription>
                Share your moments, tutorials, or creative content with the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoUploadForm 
                onSuccess={() => {
                  toast.success("Video uploaded successfully!");
                  navigate("/videos");
                }}
                onCancel={() => setActiveTab("post")}
              />
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CreateContentPage;
