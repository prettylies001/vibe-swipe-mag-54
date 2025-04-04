import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Archive, Trash2, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { dbOperations } from "../../utils/db";
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
  const [loading, setLoading] = useState(true);
  
  // Load worries from database
  useEffect(() => {
    const loadWorries = async () => {
      setLoading(true);
      try {
        const dbWorries = await dbOperations.worries.getAll();
        setWorries(dbWorries || []);
      } catch (error) {
        console.error("Error loading worries:", error);
        toast.error("Failed to load thoughts");
      } finally {
        setLoading(false);
      }
    };
    
    loadWorries();
  }, []);
  
  // Add a new worry
  const addWorry = async () => {
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
    
    try {
      await dbOperations.worries.add(newWorry);
      setWorries([newWorry, ...worries]);
      setCurrentWorry("");
      toast.success("Thought added to the jar");
    } catch (error) {
      console.error("Error adding worry:", error);
      toast.error("Failed to add thought");
    }
  };
  
  // Archive a worry
  const archiveWorry = async (id: string) => {
    try {
      await dbOperations.worries.archive(id);
      setWorries(worries.map(worry => 
        worry.id === id ? { ...worry, archived: true } : worry
      ));
      toast.success("Thought archived");
    } catch (error) {
      console.error("Error archiving worry:", error);
      toast.error("Failed to archive thought");
    }
  };
  
  // Delete a worry
  const deleteWorry = async (id: string) => {
    try {
      await dbOperations.worries.delete(id);
      setWorries(worries.filter(worry => worry.id !== id));
      toast.success("Thought removed");
    } catch (error) {
      console.error("Error deleting worry:", error);
      toast.error("Failed to remove thought");
    }
  };
  
  // Clear all worries
  const clearAllWorries = async () => {
    try {
      await dbOperations.worries.set([]);
      setWorries([]);
      toast.success("All thoughts cleared");
    } catch (error) {
      console.error("Error clearing worries:", error);
      toast.error("Failed to clear thoughts");
    }
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
  
  // Filter worries based on selected filter
  const filteredWorries = worries.filter(worry => {
    if (filter === "all") return true;
    if (filter === "active") return !worry.archived;
    if (filter === "archived") return worry.archived;
    return true;
  });
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          Loading worry jar...
        </CardContent>
      </Card>
    );
  }
  
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
