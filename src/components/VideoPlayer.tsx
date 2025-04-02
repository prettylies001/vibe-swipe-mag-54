
import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

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

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="relative h-full w-full">
      <video
        className="full-screen-video"
        loop
        playsInline
        poster={poster}
        controls
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video interaction controls */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-4">
        <button 
          onClick={handleLike}
          className="flex flex-col items-center"
        >
          <div className={`w-10 h-10 rounded-full bg-black bg-opacity-40 flex items-center justify-center ${isLiked ? 'text-vibe-red' : 'text-white'}`}>
            <Heart fill={isLiked ? "#FF385C" : "none"} />
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
      </div>
      
      {/* Video info */}
      <div className="absolute bottom-4 left-4 max-w-[70%]">
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
