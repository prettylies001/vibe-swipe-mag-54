
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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
          <div className="aspect-video w-full mt-4 rounded-md overflow-hidden">
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
    
    // For non-YouTube embeds, show a simpler link
    return <a href={post.embedUrl} target="_blank" rel="noreferrer" className="text-aselit-blue hover:underline mt-4 block">View embedded content</a>;
  };
  
  useEffect(() => {
    // Reset any iframe-related scripts if needed
    return () => {
      // Cleanup code if necessary
    };
  }, [post.embedUrl]);
  
  return (
    <Card className={`overflow-hidden card-hover ${className}`}>
      {post.imageUrl && (
        <Link to={`/article/${post.id}`} className="block overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-52 object-cover transform transition hover:scale-105"
          />
        </Link>
      )}
      
      <CardContent className="p-5">
        {post.category && (
          <Badge variant="secondary" className="mb-3">
            {post.category}
          </Badge>
        )}
        
        <Link to={`/article/${post.id}`}>
          <h3 className="font-semibold text-xl mb-2 hover:text-aselit-purple transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mt-2 line-clamp-3">
          {post.content}
        </p>
        
        {renderEmbed()}
        
        <div className="flex items-center mt-5">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={post.authorImage} />
            <AvatarFallback className="bg-aselit-purple text-white">
              {post.author.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{post.author}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border mt-4">
        <div className="flex items-center space-x-6">
          <button 
            className={`flex items-center space-x-1.5 ${liked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
            onClick={handleLike}
            aria-label="Like post"
          >
            <Heart size={18} className={liked ? 'fill-current' : ''} />
            <span className="text-sm">{likeCount}</span>
          </button>
          
          <Link to={`/article/${post.id}`} className="flex items-center space-x-1.5 text-muted-foreground hover:text-aselit-purple transition-colors">
            <MessageCircle size={18} />
            <span className="text-sm">{post.comments.length}</span>
          </Link>
        </div>
        
        <button 
          className="text-muted-foreground hover:text-aselit-purple transition-colors"
          onClick={handleShare}
          aria-label="Share post"
        >
          <Share2 size={18} />
        </button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
