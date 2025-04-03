
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Post } from "../components/PostCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Get all posts from localStorage
    const storedPosts = localStorage.getItem("vibeswipe_posts");
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      // Find the post with the matching id
      const foundPost = posts.find((p: Post) => p.id === id);
      if (foundPost) {
        setPost(foundPost);
      }
    }
  }, [id]);
  
  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to like posts");
      return;
    }
    
    if (!post) return;
    
    // Get all posts from localStorage
    const storedPosts = localStorage.getItem("vibeswipe_posts");
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      // Update the likes count for the current post
      const updatedPosts = posts.map((p: Post) => {
        if (p.id === post.id) {
          return { ...p, likes: p.likes + 1 };
        }
        return p;
      });
      
      // Save updated posts to localStorage
      localStorage.setItem("vibeswipe_posts", JSON.stringify(updatedPosts));
      
      // Update the post state
      setPost({
        ...post,
        likes: post.likes + 1
      });
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to comment");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    if (!post) return;
    
    setIsSubmitting(true);
    
    // Create new comment
    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      author: currentUser?.username || "Anonymous",
      authorImage: currentUser?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
      content: comment,
      createdAt: new Date().toISOString()
    };
    
    // Get all posts from localStorage
    const storedPosts = localStorage.getItem("vibeswipe_posts");
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      // Add the comment to the current post
      const updatedPosts = posts.map((p: Post) => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: [newComment, ...p.comments]
          };
        }
        return p;
      });
      
      // Save updated posts to localStorage
      localStorage.setItem("vibeswipe_posts", JSON.stringify(updatedPosts));
      
      // Update the post state
      setPost({
        ...post,
        comments: [newComment, ...post.comments]
      });
      
      // Reset the comment input
      setComment("");
      
      toast.success("Comment added successfully!");
    }
    
    setIsSubmitting(false);
  };
  
  if (!post) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} className="bg-vibe-red hover:bg-vibe-red/90">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-vibe-red mb-6"
      >
        <ArrowLeft size={18} />
        <span>Back to posts</span>
      </Link>
      
      <div className="max-w-4xl mx-auto">
        {post.imageUrl && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg mb-6">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.authorImage} alt={post.author} />
                <AvatarFallback>{post.author.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-gray-100">
              {post.category}
            </Badge>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
          
          <div className="flex gap-4 py-4 border-t border-b">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-gray-600 hover:text-vibe-red"
              onClick={handleLike}
            >
              <Heart className="h-5 w-5" />
              <span>{post.likes} Likes</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-gray-600"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{post.comments.length} Comments</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-gray-600 ml-auto"
            >
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-6">Comments</h3>
          
          {isAuthenticated ? (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleCommentSubmit}>
                  <div className="flex items-start gap-4">
                    <Avatar className="mt-1">
                      <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username} />
                      <AvatarFallback>{currentUser?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="mb-3"
                      />
                      <Button 
                        type="submit" 
                        className="bg-vibe-red hover:bg-vibe-red/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 bg-gray-50">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="mb-3">You need to be logged in to comment</p>
                  <Button 
                    onClick={() => navigate("/auth")} 
                    className="bg-vibe-red hover:bg-vibe-red/90"
                  >
                    Log In / Sign Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="mt-1">
                    <AvatarImage src={comment.authorImage} alt={comment.author} />
                    <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
