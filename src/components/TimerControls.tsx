
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

interface TimerControlsProps {
  onStartTimer: () => void;
}

export const TimerControls = ({ onStartTimer }: TimerControlsProps) => {
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl">⚽</div>
      <h2 className="text-xl font-bold">Ready to start?</h2>
      <p className="text-gray-600 text-sm">1 minute to do as many reps as possible!</p>
      <Button size="lg" onClick={onStartTimer} className="px-6 py-2">
        <Timer className="w-4 h-4 mr-2" />
        Start Challenge
      </Button>
    </div>
  );
};
