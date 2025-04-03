
import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, VolumeX, Volume2, Play, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const VideoPlayer = ({
  src,
  poster,
  username,
  description,
  userAvatar,
  likes,
  comments
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to like videos");
      return;
    }

    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
      toast.success("Video liked!");
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to save videos");
      return;
    }
    
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Video removed from saved items" : "Video saved to your collection");
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.log("Playback prevented:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Update progress bar
  const updateProgress = () => {
    if (videoRef.current) {
      const value = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(value) ? 0 : value);
    }
  };

  // Double tap to like
  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
      
      // Show heart animation
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      videoRef.current?.parentElement?.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 1000);
    }
  };

  // Auto-play when visible
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoElement) {
            videoElement.play().catch(() => {
              console.log("Autoplay prevented, waiting for user interaction");
            });
            setIsPlaying(true);
          } else if (videoElement) {
            videoElement.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(videoElement);
    
    // Add event listeners for progress and ended
    videoElement.addEventListener('timeupdate', updateProgress);
    
    const handleVideoEnd = () => {
      videoElement.currentTime = 0;
      videoElement.play().catch(err => console.log("Replay prevented:", err));
    };
    
    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      observer.unobserve(videoElement);
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        className="full-screen-video object-contain w-full h-full bg-black"
        loop
        playsInline
        poster={poster || ''}
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video overlay for play/pause */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-10" 
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="bg-black bg-opacity-50 rounded-full p-4 transform transition-transform duration-200 hover:scale-110">
            <Play className="h-10 w-10 text-white" />
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 z-20">
        <div 
          className="h-full bg-aselit-purple transition-all duration-100"
          style={{ width: `${progress}%` }} 
        />
      </div>
      
      {/* Video interaction controls */}
      <div className="absolute bottom-16 right-4 flex flex-col items-center space-y-4">
        <button 
          onClick={handleLike}
          className="flex flex-col items-center"
        >
          <div className={`w-12 h-12 rounded-full glass-morphism flex items-center justify-center ${isLiked ? 'text-aselit-purple' : 'text-white'} transition-all duration-200 hover:scale-110`}>
            <Heart fill={isLiked ? "var(--aselit-purple)" : "none"} size={24} />
          </div>
          <span className="text-white text-xs mt-1 font-medium">{likeCount}</span>
        </button>
        
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white transition-all duration-200 hover:scale-110">
            <MessageCircle size={24} />
          </div>
          <span className="text-white text-xs mt-1 font-medium">{comments || 0}</span>
        </button>
        
        <button 
          onClick={handleSave}
          className="flex flex-col items-center"
        >
          <div className={`w-12 h-12 rounded-full glass-morphism flex items-center justify-center ${isSaved ? 'text-aselit-purple' : 'text-white'} transition-all duration-200 hover:scale-110`}>
            <Bookmark fill={isSaved ? "var(--aselit-purple)" : "none"} size={24} />
          </div>
          <span className="text-white text-xs mt-1 font-medium">Save</span>
        </button>
        
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white transition-all duration-200 hover:scale-110">
            <Share2 size={24} />
          </div>
          <span className="text-white text-xs mt-1 font-medium">Share</span>
        </button>
        
        <button 
          onClick={toggleMute}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white transition-all duration-200 hover:scale-110">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </div>
        </button>
      </div>
      
      {/* Video info */}
      <div className="absolute bottom-16 left-4 max-w-[70%] glass-morphism p-3 rounded-lg">
        <div className="flex items-center mb-2">
          <img 
            src={userAvatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
            alt={username}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-white font-semibold ml-2">@{username}</span>
        </div>
        <p className="text-white text-sm line-clamp-2">{description}</p>
      </div>
      
      {/* CSS for heart animation */}
      <style>
        {`
        .glass-morphism {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
        }
        .heart-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238860ff' stroke='%238860ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'%3E%3C/path%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0;
          animation: heartBeat 1s ease-in-out;
        }
        
        @keyframes heartBeat {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
        `}
      </style>
    </div>
  );
};

export default VideoPlayer;
