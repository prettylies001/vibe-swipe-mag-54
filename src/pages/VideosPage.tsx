
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronUp, Upload, Plus } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Starting video data 
const initialVideoData = [
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

// Additional video sources for infinite scroll
const additionalVideos = [
  {
    id: "6",
    src: "https://assets.mixkit.co/videos/preview/mixkit-urban-lifestyle-city-traffic-at-night-10767-large.mp4",
    poster: "https://images.unsplash.com/photo-1534445967719-8ae7b972b1a6",
    username: "urbanvibes",
    description: "City lights and night vibes. The energy never stops! #citylife #nightphotography",
    userAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    likes: 2789,
    comments: 123
  },
  {
    id: "7",
    src: "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4",
    poster: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0",
    username: "travelbug",
    description: "Ocean views that take your breath away. Nature's masterpiece. #travel #ocean #meditation",
    userAvatar: "https://randomuser.me/api/portraits/women/89.jpg",
    likes: 4532,
    comments: 201
  },
  {
    id: "8",
    src: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smart-watch-with-the-stopwatch-running-32808-large.mp4",
    poster: "https://images.unsplash.com/photo-1541351991055-b55c0fb72004",
    username: "techenthusiast",
    description: "Tracking my fitness goals with the latest tech. Every second counts! #technology #fitness #headspace",
    userAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
    likes: 1876,
    comments: 98
  },
  {
    id: "9",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-at-the-living-room-14085-large.mp4",
    poster: "https://images.unsplash.com/photo-1599447292180-45fd84092ef0",
    username: "yogalife",
    description: "Home yoga practice for stress relief. Find your center wherever you are. #yoga #mindfulness #headspace",
    userAvatar: "https://randomuser.me/api/portraits/women/55.jpg",
    likes: 3421,
    comments: 187
  },
  {
    id: "10",
    src: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4",
    poster: "https://images.unsplash.com/photo-1517411018799-c6b5cbfbcd7f",
    username: "dronepilot",
    description: "Aerial nightscapes show the city in a different light. The pulse of urban life from above. #drone #cityscape",
    userAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    likes: 5210,
    comments: 265
  }
];

const VideosPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoData, setVideoData] = useState(initialVideoData);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSwipe = (direction: "up" | "down") => {
    if (direction === "up" && currentIndex < videoData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "down" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const loadMoreVideos = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Shuffle and select random videos from additional videos
      const shuffled = [...additionalVideos].sort(() => 0.5 - Math.random());
      const newVideos = shuffled.slice(0, 3).map((video, index) => ({
        ...video,
        id: `new-${Date.now()}-${index}`, // Ensure unique ID
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 300)
      }));
      
      setVideoData(prevVideos => [...prevVideos, ...newVideos]);
      setIsLoading(false);
    }, 1500);
  }, [isLoading]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!containerRef.current) return;
    
    observer.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && videoData.length - currentIndex < 3) {
          loadMoreVideos();
        }
      },
      { threshold: 0.5 }
    );
    
    const containerElement = containerRef.current;
    const lastVideoElement = videoRefs.current[videoData.length - 1];
    
    if (lastVideoElement) {
      observer.current.observe(lastVideoElement);
    }
    
    return () => {
      if (observer.current && lastVideoElement) {
        observer.current.unobserve(lastVideoElement);
      }
    };
  }, [videoData.length, currentIndex, loadMoreVideos]);

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
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center h-20 w-full bg-black bg-opacity-75 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aselit-purple"></div>
        </div>
      )}
      
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
