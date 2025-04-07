
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <Card 
      className="overflow-hidden card-hover bg-card"
      style={{ gridRowEnd: `span ${estimatedHeight}` }}
    >
      <Link to={`/article/${id}`} className="block">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-aselit-purple text-white border-none">
              {category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-3 hover:text-aselit-purple transition-colors">
            {title}
          </h3>
          <div className="flex items-center">
            <Avatar className="h-7 w-7 mr-2">
              <AvatarImage src={authorImage} alt={author} />
              <AvatarFallback>{author.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{author}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ContentCard;
