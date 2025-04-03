
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, BarChart2 } from "lucide-react";
import { toast } from "sonner";

interface PollCreationFormProps {
  onSuccess?: () => void;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  author: string;
  authorImage: string;
  createdAt: string;
  totalVotes: number;
  category: string;
}

const PollCreationForm: React.FC<PollCreationFormProps> = ({ onSuccess }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "" },
    { id: "2", text: "" }
  ]);
  const [category, setCategory] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addOption = () => {
    if (options.length >= 6) {
      toast.error("Maximum 6 options allowed");
      return;
    }
    
    setOptions([...options, { id: Math.random().toString(36).substring(2, 9), text: "" }]);
  };
  
  const removeOption = (id: string) => {
    if (options.length <= 2) {
      toast.error("Minimum 2 options required");
      return;
    }
    
    setOptions(options.filter(option => option.id !== id));
  };
  
  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => (
      option.id === id ? { ...option, text } : option
    )));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a poll");
      navigate("/auth");
      return;
    }
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    const emptyOptions = options.filter(option => !option.text.trim());
    if (emptyOptions.length > 0) {
      toast.error("All options must have text");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new poll object
      const newPoll: Poll = {
        id: Math.random().toString(36).substring(2, 9),
        question,
        options: options.map(option => ({
          id: option.id,
          text: option.text,
          votes: 0
        })),
        author: currentUser?.username || "Anonymous",
        authorImage: currentUser?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        createdAt: new Date().toISOString(),
        totalVotes: 0,
        category
      };
      
      // Get existing polls from localStorage or initialize empty array
      const existingPolls = JSON.parse(localStorage.getItem("vibeswipe_polls") || "[]");
      
      // Add new poll to beginning of array
      const updatedPolls = [newPoll, ...existingPolls];
      
      // Save updated polls to localStorage
      localStorage.setItem("vibeswipe_polls", JSON.stringify(updatedPolls));
      
      // Show success message
      toast.success("Poll created successfully!");
      
      // Reset form
      setQuestion("");
      setOptions([
        { id: "1", text: "" },
        { id: "2", text: "" }
      ]);
      setCategory("General");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to create poll. Please try again.");
      console.error("Error creating poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Create a Poll
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={options.length >= 6}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="General">General</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Fashion">Fashion</option>
              <option value="Technology">Technology</option>
              <option value="Fitness">Fitness</option>
              <option value="Art">Art</option>
              <option value="Wellness">Wellness</option>
              <option value="Politics">Politics</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Headspace">Headspace</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => {
            setQuestion("");
            setOptions([
              { id: "1", text: "" },
              { id: "2", text: "" }
            ]);
            setCategory("General");
          }}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-aselit-purple hover:bg-aselit-purple/90">
            {isSubmitting ? "Creating..." : "Create Poll"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PollCreationForm;
