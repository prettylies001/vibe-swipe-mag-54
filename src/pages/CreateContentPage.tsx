
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CreatePostForm from "../components/CreatePostForm";
import PollCreationForm from "../components/PollCreationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, BarChart2 } from "lucide-react";
import { toast } from "sonner";
import { initializeDatabase } from "../utils/db";
import { Card, CardContent } from "@/components/ui/card";

const CreateContentPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("post");

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
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto p-6">
          <CardContent className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-6 w-48 bg-muted rounded mx-auto mb-4"></div>
              <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
            </div>
            <p className="mt-4 text-muted-foreground">Initializing application...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handlePostSuccess = () => {
    toast.success("Post created successfully!");
    // Navigate programmatically after success
    navigate("/");
  };
  
  const handlePollSuccess = () => {
    toast.success("Poll created successfully!");
    // Navigate to home page 
    navigate("/");
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto overflow-hidden border-border">
        <div className="p-6 pb-2">
          <h1 className="text-3xl font-bold mb-4">Create Content</h1>
          <p className="text-muted-foreground mb-6">Share your thoughts or create a poll to engage with the community</p>
        
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md">
              <TabsTrigger value="post" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Post</span>
              </TabsTrigger>
              <TabsTrigger value="poll" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Poll</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="post" className="mt-4">
              <CreatePostForm onSuccess={handlePostSuccess} />
            </TabsContent>
            
            <TabsContent value="poll" className="mt-4">
              <PollCreationForm onSuccess={handlePollSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default CreateContentPage;
