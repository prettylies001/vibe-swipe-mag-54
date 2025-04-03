
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Post, Comment } from "../components/PostCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  useEffect(() => {
    // Get posts from localStorage
    const storedPosts = localStorage.getItem("vibeswipe_posts");
    if (storedPosts && id) {
      const posts: Post[] = JSON.parse(storedPosts);
      const foundPost = posts.find(p => p.id === id);
      
      if (foundPost) {
        setPost(foundPost);
        setLikeCount(foundPost.likes);
      } else {
        navigate("/404");
      }
    } else {
      navigate("/404");
    }
  }, [id, navigate]);
  
  // Format date
  const formattedDate = post ? new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';
  
  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like posts");
      return;
    }
    
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
      
      // Update post in localStorage
      const storedPosts = localStorage.getItem("vibeswipe_posts");
      if (storedPosts && post) {
        const posts: Post[] = JSON.parse(storedPosts);
        const updatedPosts = posts.map(p => {
          if (p.id === post.id) {
            return { ...p, likes: p.likes + 1 };
          }
          return p;
        });
        localStorage.setItem("vibeswipe_posts", JSON.stringify(updatedPosts));
      }
      
      toast.success("Post liked!");
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
      
      // Update post in localStorage
      const storedPosts = localStorage.getItem("vibeswipe_posts");
      if (storedPosts && post) {
        const posts: Post[] = JSON.parse(storedPosts);
        const updatedPosts = posts.map(p => {
          if (p.id === post.id) {
            return { ...p, likes: p.likes - 1 };
          }
          return p;
        });
        localStorage.setItem("vibeswipe_posts", JSON.stringify(updatedPosts));
      }
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    if (!post) return;
    
    // Create new comment
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      text: comment,
      author: currentUser?.username || "Anonymous",
      authorImage: currentUser?.avatarUrl,
      createdAt: new Date().toISOString(),
    };
    
    // Update post with new comment
    const updatedPost = {
      ...post,
      comments: [newComment, ...post.comments],
    };
    
    // Update post in localStorage
    const storedPosts = localStorage.getItem("vibeswipe_posts");
    if (storedPosts) {
      const posts: Post[] = JSON.parse(storedPosts);
      const updatedPosts = posts.map(p => {
        if (p.id === post.id) {
          return updatedPost;
        }
        return p;
      });
      localStorage.setItem("vibeswipe_posts", JSON.stringify(updatedPosts));
    }
    
    // Update state
    setPost(updatedPost);
    setComment("");
    toast.success("Comment added!");
  };
  
  // Function to render embedUrl content
  const renderEmbed = () => {
    if (!post?.embedUrl) return null;
    
    // YouTube embed
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
          <div className="aspect-video w-full mt-6">
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
    
    // Twitter/X embed
    if (post.embedUrl.includes('twitter.com') || post.embedUrl.includes('x.com')) {
      return (
        <div className="mt-6">
          <blockquote className="twitter-tweet">
            <a href={post.embedUrl}></a>
          </blockquote>
        </div>
      );
    }
    
    // Instagram embed
    if (post.embedUrl.includes('instagram.com')) {
      return (
        <div className="mt-6 overflow-hidden">
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

    // Facebook embed
    if (post.embedUrl.includes('facebook.com')) {
      return (
        <div className="mt-6">
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
    
    return <a href={post.embedUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mt-6 block">View embedded content</a>;
  };
  
  // Load Twitter widget script
  useEffect(() => {
    if (post?.embedUrl?.includes('twitter.com') || post?.embedUrl?.includes('x.com')) {
      // Add Twitter widget.js script
      const script = document.createElement('script');
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
    
    // Load Instagram embed script
    if (post?.embedUrl?.includes('instagram.com')) {
      const script = document.createElement('script');
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [post?.embedUrl]);
  
  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        onClick={() => navigate(-1)} 
        variant="ghost" 
        className="mb-8 hover:bg-transparent flex items-center gap-2 hover:text-vibe-red"
      >
        <ArrowLeft size={16} />
        <span>Go back</span>
      </Button>
      
      <article className="max-w-4xl mx-auto">
        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.authorImage} />
              <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h5 className="font-semibold">{post.author}</h5>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          {post.category && (
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {post.category}
            </span>
          )}
        </div>
        
        {/* Featured image */}
        {post.imageUrl && (
          <div className="mb-8">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto rounded-lg object-cover"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}
        
        {/* Article content */}
        <div className="prose max-w-none dark:prose-invert mb-8">
          {post.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        {/* Render social media embed */}
        {renderEmbed()}
        
        {/* Article actions */}
        <div className="flex items-center justify-between py-6 border-t border-b my-8">
          <div className="flex items-center space-x-6">
            <button 
              className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleLike}
            >
              <Heart size={20} className={liked ? 'fill-current' : ''} />
              <span>{likeCount}</span>
            </button>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MessageCircle size={20} />
              <span>{post.comments.length}</span>
            </div>
          </div>
          
          <button 
            className="text-muted-foreground hover:text-aselit-purple transition-colors"
            onClick={handleShare}
          >
            <Share2 size={20} />
          </button>
        </div>
        
        {/* Comments section */}
        <section>
          <h3 className="text-xl font-bold mb-6">Comments ({post.comments.length})</h3>
          
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback>{currentUser?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="resize-none mb-3"
                  />
                  <Button type="submit" className="bg-vibe-red hover:bg-vibe-red/90">
                    Post Comment
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <Card className="mb-8">
              <CardContent className="p-4">
                <p className="text-center mb-3">Sign in to join the conversation</p>
                <Button asChild className="bg-vibe-red hover:bg-vibe-red/90 w-full">
                  <Link to="/auth">Log In / Sign Up</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Comments list */}
          <div className="space-y-6">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => {
                const commentDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarImage src={comment.authorImage} />
                      <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{comment.author}</h5>
                        <span className="text-xs text-muted-foreground">{commentDate}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default ArticlePage;
