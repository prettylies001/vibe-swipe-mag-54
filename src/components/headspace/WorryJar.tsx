
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Archive, Trash2, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Worry {
  id: string;
  text: string;
  date: string;
  archived: boolean;
}

const WorryJar = () => {
  const [worries, setWorries] = useState<Worry[]>([]);
  const [currentWorry, setCurrentWorry] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  
  // Load worries from localStorage
  useEffect(() => {
    const storedWorries = localStorage.getItem("aselit_worry_jar");
    if (storedWorries) {
      setWorries(JSON.parse(storedWorries));
    }
  }, []);
  
  // Save worries to localStorage
  useEffect(() => {
    localStorage.setItem("aselit_worry_jar", JSON.stringify(worries));
  }, [worries]);
  
  // Add a new worry
  const addWorry = () => {
    if (!currentWorry.trim()) {
      toast.error("Please enter your worry or thought");
      return;
    }
    
    const newWorry: Worry = {
      id: Math.random().toString(36).substring(2, 9),
      text: currentWorry.trim(),
      date: new Date().toISOString(),
      archived: false
    };
    
    setWorries([newWorry, ...worries]);
    setCurrentWorry("");
    toast.success("Thought added to the jar");
  };
  
  // Archive a worry
  const archiveWorry = (id: string) => {
    setWorries(worries.map(worry => 
      worry.id === id ? { ...worry, archived: true } : worry
    ));
    toast.success("Thought archived");
  };
  
  // Delete a worry
  const deleteWorry = (id: string) => {
    setWorries(worries.filter(worry => worry.id !== id));
    toast.success("Thought removed");
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Clear all worries
  const clearAllWorries = () => {
    setWorries([]);
    toast.success("All thoughts cleared");
  };
  
  // Filter worries based on selected filter
  const filteredWorries = worries.filter(worry => {
    if (filter === "all") return true;
    if (filter === "active") return !worry.archived;
    if (filter === "archived") return worry.archived;
    return true;
  });
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Archive className="mr-2 text-aselit-purple" />
          Worry Jar
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <Textarea
            placeholder="Write down your worry or intrusive thought here..."
            value={currentWorry}
            onChange={e => setCurrentWorry(e.target.value)}
            className="mb-3 min-h-[100px] transition-all focus:border-aselit-purple"
          />
          
          <div className="flex justify-between">
            <Button 
              onClick={addWorry} 
              className="bg-aselit-purple hover:bg-aselit-purple/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Jar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  disabled={worries.length === 0}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all thoughts in your worry jar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllWorries} className="bg-aselit-purple hover:bg-aselit-purple/90">
                    Yes, clear all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="mb-4 flex space-x-2">
          <Badge 
            onClick={() => setFilter("all")}
            className={`cursor-pointer transition-colors ${filter === "all" ? "bg-aselit-purple text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            All
          </Badge>
          <Badge 
            onClick={() => setFilter("active")}
            className={`cursor-pointer transition-colors ${filter === "active" ? "bg-aselit-purple text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            Active
          </Badge>
          <Badge 
            onClick={() => setFilter("archived")}
            className={`cursor-pointer transition-colors ${filter === "archived" ? "bg-aselit-purple text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            Archived
          </Badge>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {filteredWorries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {filter === "archived" ? 
                "No archived thoughts yet." : 
                "Your worry jar is empty. Add your thoughts to help clear your mind."}
            </div>
          ) : (
            filteredWorries.map(worry => (
              <div 
                key={worry.id} 
                className={`p-3 rounded-lg transition-all ${worry.archived ? 'bg-gray-100 opacity-70' : 'bg-white border shadow-sm hover:shadow-md'}`}
              >
                <p className="mb-2 whitespace-pre-line">{worry.text}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{formatDate(worry.date)}</span>
                  <div className="flex space-x-1">
                    {!worry.archived && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => archiveWorry(worry.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Archive className="h-4 w-4" />
                        <span className="sr-only">Archive</span>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteWorry(worry.id)}
                      className="h-8 w-8 p-0 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorryJar;
