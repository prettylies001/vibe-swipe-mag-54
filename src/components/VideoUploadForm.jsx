
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Film } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const VideoUploadForm = ({ onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Check file size (limit to 100MB for example)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File is too large. Please select a file under 100MB.");
      return;
    }

    setVideoFile(file);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video to upload");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for your video");
      return;
    }

    setIsUploading(true);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    try {
      // In a real app, we would upload the video to a server
      // For now, we'll create a URL and save to localStorage
      const videoUrl = videoPreview;
      
      // Create video object
      const newVideo = {
        id: `video-${Date.now()}`,
        src: videoUrl,
        poster: videoPreview,
        username: currentUser?.username || "Anonymous",
        description: description || title,
        userAvatar: currentUser?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        likes: 0,
        comments: 0,
        tags: tags.split(',').map(tag => tag.trim())
      };
      
      // Get existing videos from localStorage
      const existingVideos = localStorage.getItem("vibeswipe_videos");
      let videos = [];
      if (existingVideos) {
        videos = JSON.parse(existingVideos);
      }
      
      // Add new video
      videos.unshift(newVideo);
      
      // Save to localStorage
      localStorage.setItem("vibeswipe_videos", JSON.stringify(videos));

      toast.success("Video uploaded successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setVideoPreview(null);
      setTags("");
      setUploadProgress(0);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/videos");
      }
    } catch (error) {
      toast.error("Failed to upload video. Please try again.");
      console.error("Error uploading video:", error);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!videoPreview ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-aselit-purple transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-1">Drag and drop your video or click to browse</p>
              <p className="text-sm text-gray-500">MP4, WebM, or OGG (Max 100MB)</p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video 
                src={videoPreview} 
                className="w-full h-48 object-contain"
                controls
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 text-white"
                onClick={() => {
                  setVideoFile(null);
                  setVideoPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title that describes your video"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. travel, food, headspace"
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-aselit-purple h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }} 
                />
              </div>
              <p className="text-sm text-gray-500 text-right">{uploadProgress}%</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel || (() => navigate(-1))}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-aselit-purple hover:bg-aselit-purple/90"
            disabled={isUploading || !videoFile}
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VideoUploadForm;
