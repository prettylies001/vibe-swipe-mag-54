
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Image, Send } from "lucide-react";
import { toast } from "sonner";

interface CreatePostFormProps {
  onSuccess?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSuccess }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a post");
      navigate("/auth");
      return;
    }
    
    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new post object
      const newPost = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        content,
        category,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        author: currentUser?.username || "Anonymous",
        authorImage: currentUser?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      
      // Get existing posts from localStorage or initialize empty array
      const existingPosts = JSON.parse(localStorage.getItem("vibeswipe_posts") || "[]");
      
      // Add new post to beginning of array
      const updatedPosts = [newPost, ...existingPosts];
      
      // Save updated posts to localStorage
      localStorage.setItem("vibeswipe_posts", JSON.stringify(updatedPosts));
      
      // Show success message
      toast.success("Post created successfully!");
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("General");
      setImageUrl("");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Art">Art</SelectItem>
                <SelectItem value="Wellness">Wellness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              placeholder="Enter an image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => {
            setTitle("");
            setContent("");
            setCategory("General");
            setImageUrl("");
          }}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-vibe-red hover:bg-vibe-red/90">
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create Post
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePostForm;
