
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, LinkIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPost } from "../lib/postUtils";

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
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    if (!currentUser) {
      toast.error("You must be logged in to create a post");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createPost(
        title,
        content,
        category,
        currentUser.id,
        imageUrl || undefined,
        validateEmbedUrl(embedUrl) ? embedUrl : undefined
      );
      
      toast.success("Post created successfully!");
      
      // Reset form and navigate to home page
      setTitle("");
      setContent("");
      setCategory("");
      setImageUrl("");
      setEmbedUrl("");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validateEmbedUrl = (url: string) => {
    if (!url) return false;
    
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
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating Post...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
