
import React, { useEffect, useRef } from "react";
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
  embedUrl?: string;  // New property for social media embeds
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const embedRef = useRef<HTMLDivElement>(null);
  
  // Process embeds when component mounts or when embedUrl changes
  useEffect(() => {
    if (post.embedUrl && embedRef.current) {
      processEmbed(post.embedUrl, embedRef.current);
    }
  }, [post.embedUrl]);

  // Function to process social media embed links
  const processEmbed = (url: string, container: HTMLDivElement) => {
    // Clear previous content
    container.innerHTML = '';
    
    if (url.includes('twitter.com') || url.includes('x.com')) {
      // Twitter/X embed
      const twitterScript = document.createElement('script');
      twitterScript.setAttribute('src', 'https://platform.twitter.com/widgets.js');
      twitterScript.setAttribute('async', 'true');
      
      const tweetContainer = document.createElement('div');
      tweetContainer.innerHTML = `<blockquote class="twitter-tweet"><a href="${url}">Loading tweet...</a></blockquote>`;
      
      container.appendChild(tweetContainer);
      container.appendChild(twitterScript);
    } 
    else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // YouTube embed
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      
      if (videoId) {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '200';
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
      }
    } 
    else if (url.includes('instagram.com')) {
      // Instagram embed
      const instaScript = document.createElement('script');
      instaScript.setAttribute('src', 'https://www.instagram.com/embed.js');
      instaScript.setAttribute('async', 'true');
      
      const postId = url.split('/p/')[1]?.split('/')[0] || '';
      if (postId) {
        const instaContainer = document.createElement('blockquote');
        instaContainer.className = 'instagram-media';
        instaContainer.setAttribute('data-instgrm-permalink', `https://www.instagram.com/p/${postId}/`);
        instaContainer.setAttribute('data-instgrm-version', '14');
        
        container.appendChild(instaContainer);
        container.appendChild(instaScript);
      }
    }
    else if (url.includes('facebook.com')) {
      // Facebook embed
      const fbScript = document.createElement('script');
      fbScript.setAttribute('src', 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0');
      fbScript.setAttribute('async', 'true');
      fbScript.setAttribute('defer', 'true');
      
      const fbContainer = document.createElement('div');
      fbContainer.className = 'fb-post';
      fbContainer.setAttribute('data-href', url);
      
      container.appendChild(fbContainer);
      container.appendChild(fbScript);
      
      // Initialize Facebook SDK if not already done
      if (!window.FB) {
        window.fbAsyncInit = function() {
          FB.init({
            xfbml: true,
            version: 'v12.0'
          });
          FB.XFBML.parse(container);
        };
      } else {
        FB.XFBML.parse(container);
      }
    }
  };
  
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 animate-fade-in">
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
        
        {/* Social media embed container */}
        {post.embedUrl && (
          <div 
            ref={embedRef} 
            className="mt-4 border rounded-md overflow-hidden transition-all duration-300 hover:shadow-md"
          />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-gray-600 hover:text-vibe-red transition-colors"
          onClick={() => onLike && onLike(post.id)}
        >
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-gray-600 transition-colors" 
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
          className="flex items-center gap-1 text-gray-600 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
