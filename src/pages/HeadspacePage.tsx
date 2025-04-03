
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, Brain } from "lucide-react";
import PollList from "../components/PollList";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const HeadspacePage = () => {
  const { isAuthenticated } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  
  const handleCreateClick = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to create content");
      navigate("/auth");
      return;
    }
    navigate("/create");
  };

  return (
    <div className="container mx-auto px-4 pt-6 pb-20 md:pt-20 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Brain className="mr-2 text-aselit-purple" /> 
              Headspace
            </h1>
            <p className="text-gray-500">A place for mindfulness, wellness, and mental health discussions</p>
          </div>
          
          <div className="bg-gradient-to-r from-aselit-purple/10 to-aselit-blue/10 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <Sparkles className="text-aselit-purple h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Wellness Poll Zone</h2>
            </div>
            <p className="mb-4">Share your wellness journey and participate in mindful discussions.</p>
            <Button 
              onClick={handleCreateClick}
              className="bg-aselit-purple hover:bg-aselit-purple/90 flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Poll
            </Button>
          </div>
          
          <PollList 
            category="Headspace" 
            refreshTrigger={refreshTrigger} 
          />
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-aselit-purple/10 to-aselit-blue/10 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mindfulness Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-aselit-purple/20 rounded-full p-1 mr-2 mt-0.5">
                    <Sparkles className="h-4 w-4 text-aselit-purple" />
                  </div>
                  <p className="text-sm">Take 5 minutes each day for deep breathing exercises</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-aselit-purple/20 rounded-full p-1 mr-2 mt-0.5">
                    <Sparkles className="h-4 w-4 text-aselit-purple" />
                  </div>
                  <p className="text-sm">Practice mindful eating by savoring each bite</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-aselit-purple/20 rounded-full p-1 mr-2 mt-0.5">
                    <Sparkles className="h-4 w-4 text-aselit-purple" />
                  </div>
                  <p className="text-sm">Create a calming bedtime routine for better sleep</p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["Meditation", "Sleep", "Anxiety", "Stress Relief", "Yoga", "Journaling", "Breathing"].map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeadspacePage;
