import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorImage?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  embedUrl?: string; 
  author: string;
  authorImage?: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  category?: string;
}

interface PostCardProps {
  post: Post;
  className?: string;
  onLike?: (postId: string) => void;
}

const PostCard = ({ post, className = "", onLike }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const handleLike = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
      toast.success("Post liked!");
      
      if (onLike) {
        onLike(post.id);
      }
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/article/" + post.id);
    toast.success("Link copied to clipboard!");
  };

  const renderEmbed = () => {
    if (!post.embedUrl) return null;
    
    if (post.embedUrl.includes('youtube.com') || post.embedUrl.includes('youtu.be')) {
      let videoId;
      if (post.embedUrl.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(post.embedUrl).search);
        videoId = urlParams.get('v');
      } else if (post.embedUrl.includes('youtu.be')) {
        videoId = post.embedUrl.split('/').pop();
      }
      
      if (videoId) {
        return (
          <div className="aspect-video w-full mt-4">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${videoId}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
              className="rounded-md"
            ></iframe>
          </div>
        );
      }
    }
    
    if (post.embedUrl.includes('twitter.com') || post.embedUrl.includes('x.com')) {
      return (
        <div className="mt-4">
          <blockquote className="twitter-tweet">
            <a href={post.embedUrl}></a>
          </blockquote>
        </div>
      );
    }
    
    if (post.embedUrl.includes('instagram.com')) {
      return (
        <div className="mt-4 overflow-hidden">
          <blockquote 
            className="instagram-media rounded-md" 
            data-instgrm-permalink={post.embedUrl}
            style={{ maxWidth: '100%', border: '1px solid #ddd', padding: '10px' }}
          >
            <a href={post.embedUrl} target="_blank" rel="noreferrer">View on Instagram</a>
          </blockquote>
        </div>
      );
    }
    
    if (post.embedUrl.includes('facebook.com')) {
      return (
        <div className="mt-4">
          <div 
            className="fb-post" 
            data-href={post.embedUrl}
            data-width="100%"
          >
            <a href={post.embedUrl} target="_blank" rel="noreferrer">View on Facebook</a>
          </div>
        </div>
      );
    }
    
    return <a href={post.embedUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mt-4 block">View embedded content</a>;
  };
  
  useEffect(() => {
    if (post.embedUrl?.includes('twitter.com') || post.embedUrl?.includes('x.com')) {
      const script = document.createElement('script');
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
    
    if (post.embedUrl?.includes('instagram.com')) {
      const script = document.createElement('script');
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [post.embedUrl]);
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      {post.imageUrl && (
        <Link to={`/article/${post.id}`} className="block overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-48 object-cover transform transition hover:scale-105"
          />
        </Link>
      )}
      
      <CardContent className="p-4">
        {post.category && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {post.category}
          </span>
        )}
        
        <Link to={`/article/${post.id}`}>
          <h3 className="font-semibold text-lg mt-2 hover:text-aselit-purple transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mt-2 line-clamp-3">
          {post.content}
        </p>
        
        {renderEmbed()}
        
        <div className="flex items-center mt-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.authorImage} />
            <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-medium">{post.author}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
            onClick={handleLike}
          >
            <Heart size={18} className={liked ? 'fill-current' : ''} />
            <span>{likeCount}</span>
          </button>
          
          <Link to={`/article/${post.id}`} className="flex items-center space-x-1 text-muted-foreground">
            <MessageCircle size={18} />
            <span>{post.comments.length}</span>
          </Link>
        </div>
        
        <button 
          className="text-muted-foreground hover:text-aselit-purple transition-colors"
          onClick={handleShare}
        >
          <Share2 size={18} />
        </button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
