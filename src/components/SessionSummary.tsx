import { useEffect, useRef } from 'react';
import { Award, Target, TrendingUp, TrendingDown, Clock, BarChart3, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getExerciseStats } from '@/utils/progressUtils';

interface SessionSummaryProps {
  exerciseId: string;
  currentScore: number;
  onClose: () => void;
  onRetry: () => void;
}

export const SessionSummary = ({ exerciseId, currentScore, onClose, onRetry }: SessionSummaryProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus trap: keep focus within modal
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, move to last
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        // Tab: if on last element, move to first
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);

  // Focus close button when modal opens
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);
  const stats = getExerciseStats(exerciseId);
  const isNewBest = currentScore >= stats.bestScore && stats.attempts > 0;
  const percentageVsAverage = stats.averageScore > 0 
    ? ((currentScore - stats.averageScore) / stats.averageScore) * 100 
    : 0;

  const getPerformanceBadge = () => {
    if (percentageVsAverage > 20) {
      return { text: '🔥 Outstanding Performance!', color: 'text-green-600 bg-green-100' };
    } else if (percentageVsAverage > 0) {
      return { text: '👍 Above Average!', color: 'text-blue-600 bg-blue-100' };
    } else if (percentageVsAverage >= -20) {
      return { text: '💪 Keep Practicing!', color: 'text-gray-600 bg-gray-100' };
    } else {
      return { text: '🎯 Room for Improvement', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const performanceBadge = getPerformanceBadge();
  const recentScores = stats.recentScores.slice(-5);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card ref={modalRef} className="w-full max-w-md bg-white shadow-2xl animate-in fade-in zoom-in duration-300" role="dialog" aria-modal="true" aria-labelledby="summary-title">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-end">
            <Button ref={closeButtonRef} variant="ghost" size="icon" onClick={onClose} aria-label="Close summary">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Celebration Icon */}
          <div className="flex justify-center mb-2">
            {isNewBest ? (
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                <Award className="w-10 h-10 text-yellow-500" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-10 h-10 text-blue-500" />
              </div>
            )}
          </div>
          
          <CardTitle id="summary-title" className="text-xl">
            {isNewBest ? 'New Personal Best!' : 'Session Complete!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Score */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">{currentScore}</div>
            <div className="text-sm text-muted-foreground">reps this session</div>
          </div>

          {/* Performance Badge */}
          {stats.attempts > 0 && (
            <div className={`text-center py-2 px-4 rounded-full mx-auto w-fit ${performanceBadge.color}`}>
              <span className="font-medium">{performanceBadge.text}</span>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <Award className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-yellow-700">{stats.bestScore}</div>
              <div className="text-xs text-yellow-600">Best Score</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <BarChart3 className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-700">{stats.averageScore}</div>
              <div className="text-xs text-blue-600">Average Score</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-700">{stats.attempts}</div>
              <div className="text-xs text-purple-600">Total Attempts</div>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${stats.improvementPercentage >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              {stats.improvementPercentage >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500 mx-auto mb-1" />
              )}
              <div className={`text-lg font-bold ${stats.improvementPercentage >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {stats.improvementPercentage > 0 ? '+' : ''}{stats.improvementPercentage}%
              </div>
              <div className={`text-xs ${stats.improvementPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Improvement
              </div>
            </div>
          </div>

          {/* Recent Scores */}
          {recentScores.length > 1 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground text-center">Recent Scores</div>
              <div className="flex justify-center gap-2 flex-wrap">
                {recentScores.map((score, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${score === stats.bestScore 
                        ? 'bg-yellow-400 text-yellow-900' 
                        : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {score}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onRetry}>
              Try Again
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
