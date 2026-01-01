
interface TimerDisplayProps {
  phase: 'countdown' | 'active';
  countdown?: number;
  timeLeft?: number;
}

export const TimerDisplay = ({ phase, countdown, timeLeft }: TimerDisplayProps) => {
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  if (phase === 'countdown') {
    return (
      <div className="text-center space-y-3">
        <div className="text-6xl font-bold text-blue-600 animate-pulse" aria-live="assertive" aria-atomic="true">
          {countdown}
        </div>
        <h2 className="text-lg font-semibold">Get Ready!</h2>
      </div>
    );
  }

  if (phase === 'active' && timeLeft !== undefined) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div
            className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}
            aria-live={timeLeft <= 10 ? 'assertive' : 'polite'}
            aria-atomic="true"
          >
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-gray-600">Time Remaining</p>
        </div>
        <div className="text-center text-sm italic text-gray-500">
          Enter your score after the timer ends!
        </div>
      </div>
    );
  }

  return null;
};
