
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Wind, Pause, Play } from "lucide-react";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [progress, setProgress] = useState(0);
  const [breathsCompleted, setBreathsCompleted] = useState(0);
  const [settings, setSettings] = useState({
    inhaleTime: 4, // seconds
    holdTime: 4, // seconds
    exhaleTime: 4, // seconds
    restTime: 2, // seconds
    targetBreaths: 10
  });

  // Manage breathing animation
  useEffect(() => {
    let timer: number;
    
    if (isActive) {
      timer = window.setInterval(() => {
        setProgress(prevProgress => {
          let maxTime = 0;
          switch (currentPhase) {
            case 'inhale': maxTime = settings.inhaleTime; break;
            case 'hold': maxTime = settings.holdTime; break;
            case 'exhale': maxTime = settings.exhaleTime; break;
            case 'rest': maxTime = settings.restTime; break;
          }
          
          const newProgress = prevProgress + 0.1;
          
          // Phase transition logic
          if (newProgress >= maxTime) {
            // Move to next phase
            switch (currentPhase) {
              case 'inhale':
                setCurrentPhase('hold');
                return 0;
              case 'hold':
                setCurrentPhase('exhale');
                return 0;
              case 'exhale':
                setCurrentPhase('rest');
                return 0;
              case 'rest':
                setCurrentPhase('inhale');
                setBreathsCompleted(prev => {
                  const newCount = prev + 1;
                  if (newCount >= settings.targetBreaths && settings.targetBreaths > 0) {
                    setIsActive(false);
                  }
                  return newCount;
                });
                return 0;
            }
          }
          
          return newProgress;
        });
      }, 100);
    }
    
    return () => clearInterval(timer);
  }, [isActive, currentPhase, settings]);
  
  // Reset exercise
  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setProgress(0);
    setBreathsCompleted(0);
  };
  
  // Toggle exercise
  const toggleExercise = () => {
    if (breathsCompleted >= settings.targetBreaths) {
      resetExercise();
    }
    setIsActive(!isActive);
  };
  
  // Calculate circle scale for visual feedback
  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale':
        return 0.5 + (progress / settings.inhaleTime) * 0.5;
      case 'hold':
        return 1;
      case 'exhale':
        return 1 - (progress / settings.exhaleTime) * 0.5;
      case 'rest':
        return 0.5;
      default:
        return 0.5;
    }
  };
  
  // Get instruction text
  const getInstructionText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inhale slowly through your nose';
      case 'hold': return 'Hold your breath';
      case 'exhale': return 'Exhale slowly through your mouth';
      case 'rest': return 'Rest before next breath';
    }
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wind className="mr-2 text-aselit-purple" />
          Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div 
            className="h-48 w-48 rounded-full flex items-center justify-center mb-6 transition-all duration-700 relative"
            style={{ 
              transform: `scale(${getCircleScale()})`,
              background: 'linear-gradient(135deg, hsl(267, 84%, 81%), hsl(267, 84%, 71%))'
            }}
          >
            <div className="absolute inset-0 rounded-full animate-pulse opacity-50"
                 style={{ background: 'linear-gradient(135deg, hsl(267, 84%, 81%), hsl(267, 84%, 71%))' }} />
            <span className="text-white font-bold text-xl">{currentPhase.toUpperCase()}</span>
          </div>
          
          <p className="text-lg font-medium mb-2">{getInstructionText()}</p>
          <p className="text-muted-foreground">
            {breathsCompleted} / {settings.targetBreaths} breaths completed
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Inhale duration: {settings.inhaleTime}s</span>
            </div>
            <Slider
              disabled={isActive}
              value={[settings.inhaleTime]}
              min={2}
              max={8}
              step={1}
              onValueChange={value => setSettings({...settings, inhaleTime: value[0]})}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Hold duration: {settings.holdTime}s</span>
            </div>
            <Slider
              disabled={isActive}
              value={[settings.holdTime]}
              min={0}
              max={8}
              step={1}
              onValueChange={value => setSettings({...settings, holdTime: value[0]})}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Exhale duration: {settings.exhaleTime}s</span>
            </div>
            <Slider
              disabled={isActive}
              value={[settings.exhaleTime]}
              min={2}
              max={8}
              step={1}
              onValueChange={value => setSettings({...settings, exhaleTime: value[0]})}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Number of breaths: {settings.targetBreaths}</span>
            </div>
            <Slider
              disabled={isActive}
              value={[settings.targetBreaths]}
              min={1}
              max={20}
              step={1}
              onValueChange={value => setSettings({...settings, targetBreaths: value[0]})}
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-6 space-x-3">
          <Button 
            onClick={toggleExercise} 
            className="bg-aselit-purple hover:bg-aselit-purple/90"
            size="lg"
          >
            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isActive ? "Pause" : breathsCompleted >= settings.targetBreaths ? "Restart" : "Start"}
          </Button>
          
          {isActive && (
            <Button 
              onClick={resetExercise} 
              variant="outline"
              size="lg"
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
