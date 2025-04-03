
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2 } from "lucide-react";

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  authorImage: string;
  createdAt: string;
  likes: number;
  comments: Array<{
    id: string;
    author: string;
    authorImage: string;
    content: string;
    createdAt: string;
  }>;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      {post.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="flex flex-row items-start space-y-0 gap-3 pb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.authorImage} alt={post.author} />
          <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{post.author}</p>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
        </div>
        
        <div className="ml-auto">
          <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
            {post.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Link to={`/article/${post.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-vibe-red transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600">
          {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-gray-600 hover:text-vibe-red"
          onClick={() => onLike && onLike(post.id)}
        >
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-gray-600" 
          asChild
        >
          <Link to={`/article/${post.id}`}>
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-gray-600"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
