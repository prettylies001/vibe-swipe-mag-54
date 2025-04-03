
import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, VolumeX, Volume2, Pause, Play } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  username: string;
  description: string;
  userAvatar: string;
  likes: number;
  comments: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  username,
  description,
  userAvatar,
  likes,
  comments
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
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

  // Auto-play when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
          } else if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        className="full-screen-video"
        loop
        playsInline
        poster={poster}
        onClick={togglePlay}
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
      
      {/* Video interaction controls */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-4">
        <button 
          onClick={handleLike}
          className="flex flex-col items-center"
        >
          <div className={`w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center ${isLiked ? 'text-aselit-purple' : 'text-white'}`}>
            <Heart fill={isLiked ? "var(--aselit-purple)" : "none"} />
          </div>
          <span className="text-white text-xs mt-1">{likeCount}</span>
        </button>
        
        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white">
            <MessageCircle />
          </div>
          <span className="text-white text-xs mt-1">{comments}</span>
        </button>
        
        <button className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white">
            <Share2 />
          </div>
          <span className="text-white text-xs mt-1">Share</span>
        </button>
        
        <button 
          onClick={toggleMute}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center text-white">
            {isMuted ? <VolumeX /> : <Volume2 />}
          </div>
        </button>
      </div>
      
      {/* Video info */}
      <div className="absolute bottom-4 left-4 max-w-[70%] bg-black bg-opacity-30 p-3 rounded-lg">
        <div className="flex items-center mb-2">
          <img 
            src={userAvatar}
            alt={username}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-white font-semibold ml-2">@{username}</span>
        </div>
        <p className="text-white text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
