
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PollList from "../components/PollList";
import PollCreationForm from "../components/PollCreationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PollsPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreatePollForm, setShowCreatePollForm] = useState(false);
  
  const handleCreatePollSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowCreatePollForm(false);
  };
  
  const categories = ["All", "General", "Travel", "Food", "Fashion", "Technology", "Fitness", "Art", "Wellness", "Politics", "Entertainment", "Headspace"];
  
  return (
    <div className="container mx-auto px-4 pt-6 pb-20 md:pt-20 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Polls</h1>
            <p className="text-gray-500">Vote and share your opinion on trending topics</p>
          </div>
          
          <div className="mb-6">
            <div className="flex overflow-x-auto pb-4 mb-6 space-x-2 no-scrollbar">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    category === selectedCategory 
                      ? "bg-aselit-purple text-white" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <PollList 
            category={selectedCategory} 
            refreshTrigger={refreshTrigger} 
          />
        </div>
        
        <div className="space-y-6">
          {isAuthenticated ? (
            <>
              {showCreatePollForm ? (
                <PollCreationForm onSuccess={handleCreatePollSuccess} />
              ) : (
                <Card className="bg-gradient-to-r from-aselit-purple/10 to-aselit-blue/10 border-none">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mb-2">Create a Poll</h3>
                    <p className="text-gray-600 mb-4">Ask questions and get insights from the community</p>
                    <Button 
                      className="bg-aselit-purple hover:bg-aselit-purple/90"
                      onClick={() => setShowCreatePollForm(true)}
                    >
                      Create a Poll
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-gradient-to-r from-aselit-purple/10 to-aselit-blue/10 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">Join the conversation</h3>
                <p className="text-gray-600 mb-4">Log in to create polls and vote</p>
                <Button 
                  className="bg-aselit-purple hover:bg-aselit-purple/90"
                  onClick={() => window.location.href = "/auth"}
                >
                  Log In / Sign Up
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
              <div className="flex flex-wrap gap-2">
                {["Politics", "Entertainment", "Technology", "Sports", "Food", "Travel", "Fashion", "Headspace"].map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                    onClick={() => setSelectedCategory(tag)}
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

export default PollsPage;
