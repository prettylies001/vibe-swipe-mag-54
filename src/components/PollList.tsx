
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PollCard from "./PollCard";
import { Poll } from "./PollCreationForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PollListProps {
  category?: string;
  refreshTrigger?: number;
}

const PollList: React.FC<PollListProps> = ({ category = "All", refreshTrigger = 0 }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const { isAuthenticated } = useAuth();
  
  // Load polls from Supabase
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        let query = supabase
          .from('polls')
          .select(`
            id,
            question,
            category,
            created_at,
            total_votes,
            user_id,
            profiles:user_id(username, avatar_url),
            options:poll_options(id, text, votes)
          `)
          .order('created_at', { ascending: false });
          
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching polls:", error);
          return;
        }
        
        if (data) {
          const formattedPolls = data.map(poll => ({
            id: poll.id,
            question: poll.question,
            options: poll.options.map((option: any) => ({
              id: option.id,
              text: option.text,
              votes: option.votes || 0
            })),
            author: poll.profiles?.username || "Anonymous",
            authorImage: poll.profiles?.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg",
            createdAt: poll.created_at,
            totalVotes: poll.total_votes || 0,
            category: poll.category
          }));
          
          setPolls(formattedPolls);
        }
      } catch (error) {
        console.error("Error in fetchPolls:", error);
      }
    };
    
    fetchPolls();
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
      // Check if user has already voted in this poll
      const { data: existingVotes, error: checkError } = await supabase
        .from('poll_votes')
        .select()
        .eq('poll_id', pollId)
        .eq('user_id', supabase.auth.getUser().then(({ data }) => data.user?.id));
        
      if (checkError) {
        console.error("Error checking votes:", checkError);
        return;
      }
      
      if (existingVotes && existingVotes.length > 0) {
        toast.error("You have already voted in this poll");
        return;
      }
      
      // Begin a transaction to update votes
      // First, increment vote count for the option
      const { error: optionError } = await supabase.rpc('increment_option_vote', { 
        option_id_param: optionId 
      });
      
      if (optionError) {
        console.error("Error updating option votes:", optionError);
        toast.error("Failed to record your vote");
        return;
      }
      
      // Next, increment the total votes for the poll
      const { error: pollError } = await supabase.rpc('increment_poll_votes', { 
        poll_id_param: pollId 
      });
      
      if (pollError) {
        console.error("Error updating poll votes:", pollError);
        toast.error("Failed to record your vote");
        return;
      }
      
      // Finally, record the user's vote
      const { error: voteError } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
        
      if (voteError) {
        console.error("Error recording vote:", voteError);
        toast.error("Failed to record your vote");
        return;
      }
      
      toast.success("Vote recorded successfully!");
      
      // Refresh polls after voting
      const { data: updatedPoll, error: fetchError } = await supabase
        .from('polls')
        .select(`
          id,
          question,
          category,
          created_at,
          total_votes,
          user_id,
          profiles:user_id(username, avatar_url),
          options:poll_options(id, text, votes)
        `)
        .eq('id', pollId)
        .single();
        
      if (fetchError || !updatedPoll) {
        console.error("Error fetching updated poll:", fetchError);
        return;
      }
      
      // Update the local state with the updated poll
      setPolls(prevPolls => prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: updatedPoll.options.map((option: any) => ({
              id: option.id,
              text: option.text,
              votes: option.votes || 0
            })),
            totalVotes: updatedPoll.total_votes || 0
          };
        }
        return poll;
      }));
      
    } catch (error) {
      console.error("Error in handleVote:", error);
      toast.error("An error occurred while recording your vote");
    }
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
