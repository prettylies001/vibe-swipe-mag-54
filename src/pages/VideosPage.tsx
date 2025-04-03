
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Plus } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Video data structure
const VideosPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoData, setVideoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const observer = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load videos from localStorage on mount
  useEffect(() => {
    const storedVideos = localStorage.getItem("vibeswipe_videos");
    if (storedVideos) {
      setVideoData(JSON.parse(storedVideos));
    }
  }, []);

  const handleSwipe = (direction) => {
    if (direction === "up" && currentIndex < videoData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "down" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!containerRef.current || videoData.length === 0) return;
    
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const videoIndex = videoRefs.current.findIndex(ref => ref === entry.target);
            if (videoIndex !== -1) {
              setCurrentIndex(videoIndex);
            }
          }
        });
      },
      { threshold: 0.6 }
    );
    
    videoRefs.current.forEach(ref => {
      if (ref) {
        observer.current.observe(ref);
      }
    });
    
    return () => {
      if (observer.current) {
        videoRefs.current.forEach(ref => {
          if (ref) {
            observer.current.unobserve(ref);
          }
        });
      }
    };
  }, [videoData.length]);

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to upload videos");
      navigate("/auth");
      return;
    }
    
    navigate("/create", { state: { activeTab: "video" } });
  };

  // Set up touch event handlers for swipe
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchEndY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      touchEndY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = () => {
      const difference = touchStartY - touchEndY;
      // If difference is significant enough (50px), consider it a swipe
      if (Math.abs(difference) > 50) {
        if (difference > 0) {
          // Swiped up
          handleSwipe("up");
        } else {
          // Swiped down
          handleSwipe("down");
        }
      }
    };
    
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]);

  // Empty state when no videos are available
  if (videoData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-black text-white p-6 text-center">
        <Upload className="h-16 w-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">No Videos Yet</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          Be the first to upload a video and start the trend!
        </p>
        <Button 
          onClick={handleUploadClick}
          className="bg-aselit-purple hover:bg-aselit-purple-dark"
        >
          Upload Your First Video
        </Button>
        
        {/* Upload button for quick access */}
        <div className="fixed bottom-20 right-6 z-20">
          <Button 
            onClick={handleUploadClick}
            className="bg-aselit-purple hover:bg-aselit-purple-dark rounded-full h-14 w-14 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="video-container bg-black" 
      ref={containerRef}
      style={{ 
        height: "calc(100vh - 64px)",
        scrollSnapType: "y mandatory",
        overflowY: "auto",
        overflowX: "hidden"
      }}
    >
      {videoData.map((video, index) => (
        <div 
          key={video.id}
          ref={el => videoRefs.current[index] = el}
          className="h-full w-full"
          style={{ 
            scrollSnapAlign: "start",
            scrollSnapStop: "always"
          }}
        >
          <VideoPlayer 
            src={video.src}
            poster={video.poster}
            username={video.username}
            description={video.description}
            userAvatar={video.userAvatar}
            likes={video.likes}
            comments={video.comments}
          />
        </div>
      ))}
      
      {/* Upload button */}
      <div className="fixed bottom-20 right-6 z-20">
        <Button 
          onClick={handleUploadClick}
          className="bg-aselit-purple hover:bg-aselit-purple-dark rounded-full h-14 w-14 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideosPage;
