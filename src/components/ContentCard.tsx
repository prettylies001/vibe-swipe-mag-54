
import React from "react";
import { Link } from "react-router-dom";

interface ContentCardProps {
  image: string;
  title: string;
  author: string;
  authorImage: string;
  category: string;
  estimatedHeight: number;
  id: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  image,
  title,
  author,
  authorImage,
  category,
  estimatedHeight,
  id
}) => {
  return (
    <div 
      className="rounded-xl overflow-hidden bg-white card-shadow hover:shadow-lg transition-shadow duration-300"
      style={{ gridRowEnd: `span ${estimatedHeight}` }}
    >
      <Link to={`/article/${id}`}>
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-2 right-2 bg-vibe-red text-white text-xs px-2 py-1 rounded-full">
            {category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-center">
            <img
              src={authorImage}
              alt={author}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">{author}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContentCard;
