
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart2, Users } from "lucide-react";
import { toast } from "sonner";
import { Poll, PollOption } from "./PollCreationForm";

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  const { isAuthenticated } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userVoted, setUserVoted] = useState(false);
  
  // Format date to relative time
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
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  };
  
  const handleVote = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    if (!selectedOption) {
      toast.error("Please select an option");
      return;
    }
    
    if (userVoted) {
      toast.error("You have already voted in this poll");
      return;
    }
    
    if (onVote) {
      onVote(poll.id, selectedOption);
      setUserVoted(true);
    }
  };
  
  // Calculate percentages for each option
  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };
  
  // Get badge color based on category
  const getBadgeColor = (category: string) => {
    switch(category) {
      case "Headspace":
        return "bg-aselit-purple/10 hover:bg-aselit-purple/20 text-aselit-purple";
      case "Technology":
        return "bg-blue-100 hover:bg-blue-200 text-blue-800";
      case "Travel":
        return "bg-green-100 hover:bg-green-200 text-green-800";
      case "Food":
        return "bg-orange-100 hover:bg-orange-200 text-orange-800";
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-800";
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start space-y-0 gap-3 pb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={poll.authorImage} alt={poll.author} />
          <AvatarFallback>{poll.author.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{poll.author}</p>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(poll.createdAt)}</p>
        </div>
        
        <div className="ml-auto">
          <Badge variant="outline" className={getBadgeColor(poll.category)}>
            {poll.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-5 w-5 text-aselit-purple" />
          <h3 className="text-xl font-semibold">{poll.question}</h3>
        </div>
        
        <div className="space-y-2">
          {poll.options.map((option: PollOption) => (
            <div 
              key={option.id} 
              className={`relative border rounded-md p-3 cursor-pointer transition-all ${
                selectedOption === option.id 
                  ? "border-aselit-purple bg-aselit-purple/5" 
                  : "border-gray-200 hover:border-gray-300"
              } ${
                userVoted 
                  ? "cursor-default"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => !userVoted && setSelectedOption(option.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {!userVoted && (
                    <div 
                      className={`h-4 w-4 rounded-full border ${
                        selectedOption === option.id 
                          ? "border-aselit-purple bg-aselit-purple" 
                          : "border-gray-300"
                      }`}
                    />
                  )}
                  <span className="font-medium">{option.text}</span>
                </div>
                {userVoted && (
                  <span className="text-sm font-medium">
                    {getPercentage(option.votes)}%
                  </span>
                )}
              </div>
              
              {userVoted && (
                <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-aselit-purple" 
                    style={{ width: `${getPercentage(option.votes)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}</span>
        </div>
        
        {!userVoted ? (
          <Button 
            className="bg-aselit-purple hover:bg-aselit-purple/90"
            onClick={handleVote}
            disabled={!selectedOption || !isAuthenticated}
          >
            Vote
          </Button>
        ) : (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Voted
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default PollCard;
