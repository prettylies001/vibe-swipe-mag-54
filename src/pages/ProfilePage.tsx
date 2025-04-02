
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  LogOut, 
  Settings, 
  Video, 
  Image, 
  BarChart2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  // Format join date
  const joinDate = currentUser ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        onClick={() => navigate("/")} 
        variant="ghost" 
        className="mb-8 hover:bg-transparent flex items-center gap-2 hover:text-vibe-red"
      >
        <ArrowLeft size={16} />
        <span>Back to home</span>
      </Button>
      
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="w-full md:w-1/3">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username} />
                    <AvatarFallback>{currentUser?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">{currentUser?.username}</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {currentUser?.isAdmin ? "Administrator" : "Member"}
                  </p>
                  
                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{currentUser?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined {joinDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </CardFooter>
            </Card>
            
            {currentUser?.isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full mb-3 justify-start text-sm"
                    onClick={() => navigate("/admin")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Profile content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="posts">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>Posts</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Videos</span>
                </TabsTrigger>
                <TabsTrigger value="polls" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Polls</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Posts</CardTitle>
                    <CardDescription>
                      Content you've shared with the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Image className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">No posts yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        You haven't created any posts yet. Share your thoughts, ideas, or stories with the community!
                      </p>
                      <Button className="mt-6 bg-vibe-red hover:bg-vibe-red/90">
                        Create New Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="videos">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Videos</CardTitle>
                    <CardDescription>
                      Videos you've uploaded to VibeSwipe
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Video className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">No videos yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        You haven't uploaded any videos yet. Share your creativity with short-form videos!
                      </p>
                      <Button className="mt-6 bg-vibe-red hover:bg-vibe-red/90">
                        Upload New Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="polls">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Polls</CardTitle>
                    <CardDescription>
                      Polls you've created to engage with the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">No polls yet</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        You haven't created any polls yet. Ask the community questions and see what they think!
                      </p>
                      <Button className="mt-6 bg-vibe-red hover:bg-vibe-red/90">
                        Create New Poll
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
