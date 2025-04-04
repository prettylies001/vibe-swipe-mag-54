
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PollCard from "./PollCard";
import { Poll } from "./PollCreationForm";
import { toast } from "sonner";

interface PollListProps {
  category?: string;
  refreshTrigger?: number;
}

const PollList: React.FC<PollListProps> = ({ category = "All", refreshTrigger = 0 }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const { isAuthenticated } = useAuth();
  
  // Load polls from localStorage
  useEffect(() => {
    const storedPolls = localStorage.getItem("vibeswipe_polls");
    if (storedPolls) {
      setPolls(JSON.parse(storedPolls));
    } else {
      // Sample polls data if none exists
      const samplePolls: Poll[] = [
        {
          id: "p1",
          question: "What's your favorite programming language?",
          options: [
            { id: "o1", text: "JavaScript", votes: 15 },
            { id: "o2", text: "Python", votes: 12 },
            { id: "o3", text: "TypeScript", votes: 8 },
            { id: "o4", text: "Java", votes: 5 }
          ],
          author: "Robert Fox",
          authorImage: "https://randomuser.me/api/portraits/men/2.jpg",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          totalVotes: 40,
          category: "Technology"
        },
        {
          id: "p2",
          question: "Which city would you most like to visit?",
          options: [
            { id: "o1", text: "Paris", votes: 22 },
            { id: "o2", text: "Tokyo", votes: 18 },
            { id: "o3", text: "New York", votes: 14 },
            { id: "o4", text: "London", votes: 12 }
          ],
          author: "Jane Cooper",
          authorImage: "https://randomuser.me/api/portraits/women/1.jpg",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          totalVotes: 66,
          category: "Travel"
        }
      ];
      
      localStorage.setItem("vibeswipe_polls", JSON.stringify(samplePolls));
      setPolls(samplePolls);
    }
  }, [refreshTrigger]);
  
  // Filter polls by category
  useEffect(() => {
    if (category === "All") {
      setFilteredPolls(polls);
    } else {
      setFilteredPolls(polls.filter(poll => poll.category === category));
    }
  }, [polls, category]);
  
  const handleVote = (pollId: string, optionId: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map(option => {
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });
        
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    });
    
    setPolls(updatedPolls);
    localStorage.setItem("vibeswipe_polls", JSON.stringify(updatedPolls));
    toast.success("Vote recorded successfully!");
  };
  
  if (filteredPolls.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No polls found</h3>
        <p className="text-muted-foreground mt-2">
          {category !== "All" 
            ? `There are no polls in the ${category} category yet.` 
            : "Be the first to create a poll!"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredPolls.map(poll => (
        <PollCard 
          key={poll.id} 
          poll={poll}
          onVote={handleVote}
        />
      ))}
    </div>
  );
};

export default PollList;
