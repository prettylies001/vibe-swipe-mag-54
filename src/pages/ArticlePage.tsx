
import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, this would fetch the article data based on the ID
  // For now, we'll use mock data
  const article = {
    title: "The Future of Social Media",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "Jane Doe",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    date: "June 12, 2023"
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link to="/" className="inline-flex items-center mb-6 text-vibe-red hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Discover
      </Link>
      
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-vibe-red text-white text-xs px-2 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">{article.date}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center mb-6">
            <img
              src={article.authorImage}
              alt={article.author}
              className="w-10 h-10 rounded-full mr-4"
            />
            <span className="text-gray-700">{article.author}</span>
          </div>
          
          <div className="prose max-w-none">
            <p>{article.content}</p>
            <p>{article.content}</p>
            <p>{article.content}</p>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button variant="outline" className="text-vibe-red border-vibe-red hover:bg-vibe-red hover:text-white">
              Share
            </Button>
            <Button className="bg-vibe-red hover:bg-opacity-90">
              Follow Author
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
