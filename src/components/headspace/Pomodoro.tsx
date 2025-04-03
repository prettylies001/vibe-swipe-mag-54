
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Clock, Play, Pause, SkipForward, Coffee, Brain, 
  Settings, RotateCcw, X, Volume2, VolumeX
} from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { toast } from "sonner";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const Pomodoro = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [mode, setMode] = useState<TimerMode>("focus");
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settings, setSettings] = useState({
    focusTime: 25, // minutes
    shortBreakTime: 5, // minutes
    longBreakTime: 15, // minutes
    pomodorosUntilLongBreak: 4
  });

  // Initialize audio elements
  const tickSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  const completionSound = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  
  // Timer logic
  useEffect(() => {
    let timer: number;
    
    if (isActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prevTime => {
          // Play tick sound at every minute
          if (prevTime % 60 === 0 && prevTime > 0 && soundEnabled) {
            tickSound.play().catch(e => console.error("Error playing sound:", e));
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      if (soundEnabled) {
        completionSound.play().catch(e => console.error("Error playing sound:", e));
      }
      
      // Show toast notification
      toast.success(`${mode === "focus" ? "Focus session" : "Break"} completed!`, {
        duration: 5000,
        action: {
          label: "Next",
          onClick: () => handleSkipToNext()
        }
      });
      
      // Automatic mode switch
      if (mode === "focus") {
        const newCount = pomodorosCompleted + 1;
        setPomodorosCompleted(newCount);
        
        if (newCount % settings.pomodorosUntilLongBreak === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        switchMode("focus");
      }
      
      setIsActive(false);
    }
    
    return () => clearInterval(timer);
  }, [isActive, timeLeft, mode, pomodorosCompleted, settings, soundEnabled]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Switch timer mode
  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    
    // Set appropriate time based on mode
    switch (newMode) {
      case "focus":
        setTimeLeft(settings.focusTime * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreakTime * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreakTime * 60);
        break;
    }
    
    setIsActive(false);
  };
  
  // Reset the current session
  const resetTimer = () => {
    switch (mode) {
      case "focus":
        setTimeLeft(settings.focusTime * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreakTime * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreakTime * 60);
        break;
    }
    setIsActive(false);
  };
  
  // Skip to next session
  const handleSkipToNext = () => {
    if (mode === "focus") {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      if (newCount % settings.pomodorosUntilLongBreak === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("focus");
    }
  };
  
  // Calculate progress percentage for circular indicator
  const getProgressPercentage = () => {
    let totalTime;
    switch (mode) {
      case "focus":
        totalTime = settings.focusTime * 60;
        break;
      case "shortBreak":
        totalTime = settings.shortBreakTime * 60;
        break;
      case "longBreak":
        totalTime = settings.longBreakTime * 60;
        break;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 text-aselit-purple" />
          Pomodoro Timer
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={isActive}
              >
                <Settings size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Settings</h4>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X size={16} />
                    </Button>
                  </PopoverTrigger>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Focus time: {settings.focusTime} min</span>
                  </div>
                  <Slider
                    value={[settings.focusTime]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={value => setSettings({...settings, focusTime: value[0]})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Short break: {settings.shortBreakTime} min</span>
                  </div>
                  <Slider
                    value={[settings.shortBreakTime]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={value => setSettings({...settings, shortBreakTime: value[0]})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Long break: {settings.longBreakTime} min</span>
                  </div>
                  <Slider
                    value={[settings.longBreakTime]}
                    min={5}
                    max={30}
                    step={5}
                    onValueChange={value => setSettings({...settings, longBreakTime: value[0]})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sessions until long break: {settings.pomodorosUntilLongBreak}</span>
                  </div>
                  <Slider
                    value={[settings.pomodorosUntilLongBreak]}
                    min={2}
                    max={6}
                    step={1}
                    onValueChange={value => setSettings({...settings, pomodorosUntilLongBreak: value[0]})}
                  />
                </div>
                
                <Button 
                  className="w-full bg-aselit-purple hover:bg-aselit-purple/90"
                  onClick={resetTimer}
                >
                  Apply Changes
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-48 h-48 mb-4">
            {/* Circular progress background */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
            
            {/* Circular progress indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="hsl(267, 84%, 81%)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - getProgressPercentage() / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            
            {/* Timer display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-sm font-medium mt-1 capitalize text-muted-foreground">{mode.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className={`px-4 py-1 rounded-full cursor-pointer transition-colors ${mode === "focus" ? "bg-aselit-purple text-white" : "bg-gray-100"}`} onClick={() => switchMode("focus")}>
              <div className="flex items-center">
                <Brain size={16} className="mr-1" />
                Focus
              </div>
            </div>
            
            <div className={`px-4 py-1 rounded-full cursor-pointer transition-colors ${mode === "shortBreak" ? "bg-aselit-purple text-white" : "bg-gray-100"}`} onClick={() => switchMode("shortBreak")}>
              <div className="flex items-center">
                <Coffee size={16} className="mr-1" />
                Short Break
              </div>
            </div>
            
            <div className={`px-4 py-1 rounded-full cursor-pointer transition-colors ${mode === "longBreak" ? "bg-aselit-purple text-white" : "bg-gray-100"}`} onClick={() => switchMode("longBreak")}>
              <div className="flex items-center">
                <Coffee size={16} className="mr-1" />
                Long Break
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button 
            onClick={() => setIsActive(!isActive)} 
            className="bg-aselit-purple hover:bg-aselit-purple/90"
            size="lg"
          >
            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          
          <Button 
            onClick={resetTimer} 
            variant="outline"
            size="icon"
          >
            <RotateCcw size={18} />
          </Button>
          
          <Button 
            onClick={handleSkipToNext} 
            variant="outline"
            size="icon"
          >
            <SkipForward size={18} />
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Sessions completed: {pomodorosCompleted}</p>
          <p className="mt-1">Next: {mode === "focus" ? "Break" : "Focus session"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Pomodoro;
