
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PostCard, { Post } from "./PostCard";
import { toast } from "sonner";

interface PostListProps {
  category?: string;
  searchQuery?: string;
  refreshTrigger?: number;
}

const PostList: React.FC<PostListProps> = ({ category = "All", searchQuery = "", refreshTrigger = 0 }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const { isAuthenticated } = useAuth();
  
  // Load posts from localStorage
  useEffect(() => {
    const storedPosts = localStorage.getItem("vibeswipe_posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, [refreshTrigger]);
  
  // Filter posts by category and search query
  useEffect(() => {
    let filtered = posts;
    
    if (category !== "All") {
      filtered = filtered.filter(post => post.category === category);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post => 
          post.title.toLowerCase().includes(query) || 
          post.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, category, searchQuery]);
  
  const handleLike = (postId: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to like posts");
      return;
    }
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem("vibeswipe_posts", JSON.stringify(updatedPosts));
  };
  
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No posts found</h3>
        <p className="text-muted-foreground mt-2">
          {category !== "All" 
            ? `There are no posts in the ${category} category yet.` 
            : searchQuery 
              ? `No posts match "${searchQuery}".`
              : "Be the first to create a post!"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map(post => (
        <PostCard 
          key={post.id} 
          post={post}
          onLike={handleLike}
        />
      ))}
    </div>
  );
};

export default PostList;
