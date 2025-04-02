
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Video, BarChart2, Image, PlusCircle, AlertCircle, Settings, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const mockUsers = [
  { id: "1", username: "admin", email: "admin@vibeswipe.com", isAdmin: true, avatarUrl: "https://i.pravatar.cc/150?u=admin" },
  { id: "2", username: "regularuser", email: "user@example.com", isAdmin: false, avatarUrl: "https://i.pravatar.cc/150?u=user" },
  { id: "3", username: "sarah_smith", email: "sarah@example.com", isAdmin: false, avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: "4", username: "tech_guru", email: "guru@example.com", isAdmin: false, avatarUrl: "https://i.pravatar.cc/150?u=tech" },
];

const mockContent = [
  { id: "1", type: "post", title: "Getting Started with VibeSwipe", author: "admin", status: "published", date: "2023-06-01" },
  { id: "2", type: "video", title: "Travel Vlog: Paris", author: "sarah_smith", status: "published", date: "2023-06-05" },
  { id: "3", type: "poll", title: "What's your favorite feature?", author: "tech_guru", status: "active", date: "2023-06-10" },
  { id: "4", type: "post", title: "Photography Tips", author: "regularuser", status: "flagged", date: "2023-06-15" },
];

const mockReports = [
  { id: "1", contentId: "4", reportedBy: "sarah_smith", reason: "Inappropriate content", date: "2023-06-16" },
  { id: "2", contentId: "2", reportedBy: "tech_guru", reason: "Copyright infringement", date: "2023-06-11" },
];

const AdminDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If user is not authenticated or not an admin, redirect to home
  if (!isAuthenticated || !currentUser?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        onClick={() => navigate("/profile")} 
        variant="ghost" 
        className="mb-8 hover:bg-transparent flex items-center gap-2 hover:text-vibe-red"
      >
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </Button>
      
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-vibe-red mr-3" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-12 w-12 text-vibe-red mb-4" />
            <CardTitle className="text-3xl font-bold">{mockUsers.length}</CardTitle>
            <CardDescription>Total Users</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Image className="h-12 w-12 text-vibe-purple mb-4" />
            <CardTitle className="text-3xl font-bold">
              {mockContent.filter(c => c.type === 'post').length}
            </CardTitle>
            <CardDescription>Total Posts</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Video className="h-12 w-12 text-vibe-teal mb-4" />
            <CardTitle className="text-3xl font-bold">
              {mockContent.filter(c => c.type === 'video').length}
            </CardTitle>
            <CardDescription>Total Videos</CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart2 className="h-12 w-12 text-secondary mb-4" />
            <CardTitle className="text-3xl font-bold">
              {mockContent.filter(c => c.type === 'poll').length}
            </CardTitle>
            <CardDescription>Total Polls</CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 border-b font-medium">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">User</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {mockUsers.map((user, index) => (
                  <div key={user.id} className="grid grid-cols-12 p-4 border-b items-center">
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{user.username}</span>
                    </div>
                    <div className="col-span-4 text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.isAdmin ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {user.isAdmin ? 'Admin' : 'Member'}
                      </span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Review and manage all content on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 border-b font-medium">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Author</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {mockContent.map((content, index) => (
                  <div key={content.id} className="grid grid-cols-12 p-4 border-b items-center">
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-4">{content.title}</div>
                    <div className="col-span-2 capitalize">{content.type}</div>
                    <div className="col-span-2">{content.author}</div>
                    <div className="col-span-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        content.status === 'published' ? 'bg-green-100 text-green-800' : 
                        content.status === 'flagged' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {content.status}
                      </span>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Report Management</CardTitle>
              <CardDescription>
                Review and handle user reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockReports.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-4 border-b font-medium">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Content</div>
                    <div className="col-span-2">Reported By</div>
                    <div className="col-span-3">Reason</div>
                    <div className="col-span-1">Date</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  
                  {mockReports.map((report, index) => {
                    const relatedContent = mockContent.find(c => c.id === report.contentId);
                    
                    return (
                      <div key={report.id} className="grid grid-cols-12 p-4 border-b items-center">
                        <div className="col-span-1">{index + 1}</div>
                        <div className="col-span-3">
                          {relatedContent?.title || "Unknown content"}
                        </div>
                        <div className="col-span-2">{report.reportedBy}</div>
                        <div className="col-span-3 text-sm text-muted-foreground">
                          {report.reason}
                        </div>
                        <div className="col-span-1 text-sm">
                          {new Date(report.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <Button variant="destructive" size="sm">Delete</Button>
                          <Button variant="outline" size="sm">Ignore</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No reports</h3>
                  <p className="text-muted-foreground mt-2">
                    There are no content reports to review at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
