
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PollCard from "./PollCard";
import { Poll } from "./PollCreationForm";
import { toast } from "sonner";
import { dbOperations } from "../utils/db";

interface PollListProps {
  category?: string;
  refreshTrigger?: number;
}

const PollList: React.FC<PollListProps> = ({ category = "All", refreshTrigger = 0 }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  // Load polls from database
  useEffect(() => {
    const loadPolls = async () => {
      setLoading(true);
      try {
        const dbPolls = await dbOperations.polls.getAll();
        setPolls(dbPolls);
      } catch (error) {
        console.error("Error loading polls:", error);
        toast.error("Failed to load polls");
      } finally {
        setLoading(false);
      }
    };
    
    loadPolls();
  }, [refreshTrigger]);
  
  // Filter polls by category
  useEffect(() => {
    if (category === "All") {
      setFilteredPolls(polls);
    } else {
      setFilteredPolls(polls.filter(poll => poll.category === category));
    }
  }, [polls, category]);
  
  const handleVote = async (pollId: string, optionId: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    try {
      await dbOperations.polls.vote(pollId, optionId);
      
      // Update local state to reflect the vote
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
      toast.success("Vote recorded successfully!");
    } catch (error) {
      console.error("Error recording vote:", error);
      toast.error("Failed to record vote");
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading polls...</p>
      </div>
    );
  }
  
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
