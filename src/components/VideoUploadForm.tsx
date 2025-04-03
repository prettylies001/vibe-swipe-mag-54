
import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Video, Image, Upload, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { uploadVideo } from "../lib/videoUtils";

interface VideoUploadFormProps {
  onSuccess?: () => void;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        toast.error("Please select a valid video file");
        return;
      }
      
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video file size should be less than 100MB");
        return;
      }
      
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };
  
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("You must be logged in to upload videos");
      navigate('/auth');
      return;
    }
    
    if (!videoFile) {
      toast.error("Please select a video to upload");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      await uploadVideo(
        videoFile,
        title,
        description,
        currentUser.id,
        posterFile || undefined
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Video uploaded successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setPosterFile(null);
      setVideoPreview("");
      setPosterPreview("");
      
      // Navigate or call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/videos');
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload */}
          <div className="space-y-2">
            <Label>Video</Label>
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => videoInputRef.current?.click()}
            >
              {videoPreview ? (
                <div className="aspect-video relative">
                  <video 
                    src={videoPreview} 
                    className="h-full w-full object-contain" 
                    controls
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoFile(null);
                      setVideoPreview("");
                      if (videoInputRef.current) videoInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-1">Click to upload a video</p>
                  <p className="text-xs text-muted-foreground">MP4, WebM, or MOV (Max 100MB)</p>
                </div>
              )}
              <input 
                ref={videoInputRef}
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleVideoChange}
                disabled={isUploading}
              />
            </div>
          </div>
          
          {/* Poster Image (Thumbnail) */}
          <div className="space-y-2">
            <Label>Thumbnail Image (Optional)</Label>
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => posterInputRef.current?.click()}
            >
              {posterPreview ? (
                <div className="aspect-video relative">
                  <img 
                    src={posterPreview} 
                    alt="Video thumbnail" 
                    className="h-full w-full object-contain" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPosterFile(null);
                      setPosterPreview("");
                      if (posterInputRef.current) posterInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Image className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload a thumbnail image</p>
                </div>
              )}
              <input 
                ref={posterInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePosterChange}
                disabled={isUploading}
              />
            </div>
          </div>
          
          {/* Video Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                disabled={isUploading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video..."
                className="min-h-20"
                disabled={isUploading}
              />
            </div>
          </div>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-vibe-red h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-vibe-red hover:bg-vibe-red/90"
            disabled={isUploading || !videoFile}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoUploadForm;
