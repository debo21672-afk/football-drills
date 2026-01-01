import { PasswordStrength, getPasswordStrengthColor, getPasswordStrengthText } from '@/utils/passwordValidation';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  showFeedback?: boolean;
}

export const PasswordStrengthIndicator = ({
  strength,
  showFeedback = true
}: PasswordStrengthIndicatorProps) => {
  const strengthColor = getPasswordStrengthColor(strength.strength);
  const strengthText = getPasswordStrengthText(strength.strength);
  const barWidth = `${(strength.score / 5) * 100}%`;

  return (
    <div className="space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-gray-500" />
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${strengthColor} transition-all duration-300`}
              style={{ width: barWidth }}
              role="progressbar"
              aria-valuenow={strength.score}
              aria-valuemin={0}
              aria-valuemax={5}
              aria-label={`Password strength: ${strengthText}`}
            />
          </div>
        </div>
        <span className={`text-sm font-medium ${
          strength.meetsRequirements ? 'text-green-700' : 'text-gray-600'
        }`}>
          {strengthText}
        </span>
      </div>

      {/* Feedback */}
      {showFeedback && strength.feedback.length > 0 && (
        <div className="text-xs space-y-1">
          {strength.feedback.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-1 ${
                strength.meetsRequirements && strength.feedback.length === 1
                  ? 'text-green-700'
                  : 'text-gray-600'
              }`}
            >
              {strength.meetsRequirements && strength.feedback.length === 1 ? (
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              )}
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
