
import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, Upload, Plus } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const videoData = [
  {
    id: "1",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-the-streets-of-a-city-34892-large.mp4",
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    username: "cityrunner",
    description: "Morning run through the city streets. Best way to start the day! #fitness #citylife",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    likes: 1245,
    comments: 89
  },
  {
    id: "2",
    src: "https://assets.mixkit.co/videos/preview/mixkit-making-a-smoothie-with-fresh-fruits-and-yogurt-42541-large.mp4",
    poster: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    username: "healthyeats",
    description: "Simple recipe for the perfect post-workout smoothie! Packed with nutrients and tastes amazing. #foodie #healthyrecipes",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    likes: 3567,
    comments: 142
  },
  {
    id: "3",
    src: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-taking-photos-with-a-vintage-camera-34351-large.mp4",
    poster: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
    username: "creativephotos",
    description: "Exploring the city with my vintage camera. Finding beauty in every corner! #photography #vintage",
    userAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    likes: 2198,
    comments: 104
  },
  {
    id: "4",
    src: "https://assets.mixkit.co/videos/preview/mixkit-painter-creating-colorful-artwork-in-a-studio-43258-large.mp4",
    poster: "https://images.unsplash.com/photo-1579762715459-3d2d5e4fa68f",
    username: "artistry",
    description: "Creating abstract art is my form of meditation. Colors and emotions flow freely. #artist #creative",
    userAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    likes: 4721,
    comments: 231
  },
  {
    id: "5",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-meditating-in-a-yoga-position-42693-large.mp4",
    poster: "https://images.unsplash.com/photo-1545389336-cf090694435e",
    username: "mindfulmovement",
    description: "Finding inner peace through daily meditation practice. #headspace #wellness #meditation",
    userAvatar: "https://randomuser.me/api/portraits/women/23.jpg",
    likes: 3210,
    comments: 145
  }
];

const VideosPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSwipe = (direction: "up" | "down") => {
    if (direction === "up" && currentIndex < videoData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "down" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to upload videos");
      navigate("/auth");
      return;
    }
    
    // For now just show a toast since we're not implementing full upload functionality
    toast.success("Video upload feature coming soon!");
    // setShowUploadModal(true);
  };

  // Set up touch event handlers for swipe
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchEndY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
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

  // Scroll to current video
  useEffect(() => {
    const videoEl = videoRefs.current[currentIndex];
    if (videoEl) {
      videoEl.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex]);

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

      {currentIndex > 0 && (
        <button
          onClick={() => handleSwipe("down")}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 p-2 rounded-full text-white z-10"
        >
          <ChevronUp size={24} />
        </button>
      )}
      
      {/* Upload button */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button 
          onClick={handleUploadClick}
          className="bg-aselit-purple hover:bg-aselit-purple-dark rounded-full h-14 w-14 shadow-lg"
        >
          <Upload className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideosPage;
