
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, LinkIcon, X } from "lucide-react";
import { toast } from "sonner";

interface CreatePostFormProps {
  onSuccess?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }
    
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    
    setIsSubmitting(true);
    
    // Create post object
    const post = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      content,
      category,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
      author: currentUser?.username || "Anonymous",
      authorImage: currentUser?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      embedUrl: embedUrl || undefined // Add embedUrl if provided
    };
    
    // Get existing posts from localStorage
    const existingPosts = localStorage.getItem("vibeswipe_posts");
    let posts = [];
    
    if (existingPosts) {
      posts = JSON.parse(existingPosts);
    }
    
    // Add new post to the beginning of the array
    posts.unshift(post);
    
    // Save to localStorage
    localStorage.setItem("vibeswipe_posts", JSON.stringify(posts));
    
    toast.success("Post created successfully!");
    
    // Reset form and navigate to home page
    setTitle("");
    setContent("");
    setCategory("");
    setImageUrl("");
    setEmbedUrl("");
    setIsSubmitting(false);
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/");
    }
  };
  
  const validateEmbedUrl = (url: string) => {
    if (!url) return true;
    
    // Check if URL is valid
    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    
    // Check if URL is from supported platforms
    return (
      url.includes('twitter.com') || 
      url.includes('x.com') || 
      url.includes('youtube.com') || 
      url.includes('youtu.be') ||
      url.includes('instagram.com') ||
      url.includes('facebook.com')
    );
  };
  
  const handleEmbedUrlChange = (url: string) => {
    setEmbedUrl(url);
    
    if (url && !validateEmbedUrl(url)) {
      toast.error("Please enter a valid URL from Twitter/X, YouTube, Instagram, or Facebook");
    }
  };
  
  const categories = ["Travel", "Food", "Fashion", "Technology", "Fitness", "Art", "Wellness", "Headspace"];
  
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setImageUrl("")}
                disabled={!imageUrl}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="embedUrl">
              <div className="flex items-center">
                <LinkIcon size={16} className="mr-2" />
                <span>Embed Social Media (optional)</span>
              </div>
            </Label>
            <div className="flex gap-2">
              <Input
                id="embedUrl"
                placeholder="Twitter/X, YouTube, Instagram, or Facebook URL"
                value={embedUrl}
                onChange={(e) => handleEmbedUrlChange(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setEmbedUrl("")}
                disabled={!embedUrl}
              >
                <X size={16} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported platforms: Twitter/X, YouTube, Instagram, Facebook
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-vibe-red hover:bg-vibe-red/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Post..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
