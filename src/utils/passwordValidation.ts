export interface PasswordStrength {
  score: number; // 0-4 (very weak to very strong)
  strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
  meetsRequirements: boolean;
}

const MIN_PASSWORD_LENGTH = 8;
const RECOMMENDED_PASSWORD_LENGTH = 12;

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < MIN_PASSWORD_LENGTH) {
    feedback.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    return {
      score: 0,
      strength: 'very-weak',
      feedback,
      meetsRequirements: false
    };
  }

  // Length checks
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (password.length >= RECOMMENDED_PASSWORD_LENGTH) score += 1;

  // Character variety checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (hasLowercase && hasUppercase) score += 1;
  if (hasNumbers) score += 1;
  if (hasSpecialChars) score += 1;

  // Generate feedback
  if (!hasLowercase || !hasUppercase) {
    feedback.push('Include both uppercase and lowercase letters');
  }
  if (!hasNumbers) {
    feedback.push('Include at least one number');
  }
  if (!hasSpecialChars) {
    feedback.push('Include at least one special character (!@#$%^&*)');
  }
  if (password.length < RECOMMENDED_PASSWORD_LENGTH) {
    feedback.push(`Recommended: Use ${RECOMMENDED_PASSWORD_LENGTH}+ characters`);
  }

  // Check for common weak patterns
  const commonPasswords = [
    'password', 'Password', 'Password1', 'Password123',
    '12345678', '123456789', 'qwerty', 'abc123',
    'password1', 'Password!', 'Welcome1', 'Admin123'
  ];

  if (commonPasswords.some(common => password.includes(common))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common passwords');
  }

  // Check for repeated characters (e.g., 'aaaa', '1111')
  if (/(.)\1{3,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeated characters');
  }

  // Check for sequential characters (e.g., '1234', 'abcd')
  const sequential = ['0123', '1234', '2345', '3456', '4567', '5678', '6789',
                      'abcd', 'bcde', 'cdef', 'defg', 'efgh'];
  if (sequential.some(seq => password.toLowerCase().includes(seq))) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid sequential characters');
  }

  // Determine strength level
  let strength: PasswordStrength['strength'];
  if (score <= 1) {
    strength = 'very-weak';
  } else if (score === 2) {
    strength = 'weak';
  } else if (score === 3) {
    strength = 'medium';
  } else if (score === 4) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  // Password meets requirements if it's at least medium strength and has minimum length
  const meetsRequirements = score >= 3 && password.length >= MIN_PASSWORD_LENGTH;

  if (feedback.length === 0 && meetsRequirements) {
    feedback.push('Strong password!');
  }

  return {
    score,
    strength,
    feedback,
    meetsRequirements
  };
};

export const getPasswordStrengthColor = (strength: PasswordStrength['strength']): string => {
  switch (strength) {
    case 'very-weak':
      return 'bg-red-500';
    case 'weak':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-lime-500';
    case 'very-strong':
      return 'bg-green-500';
  }
};

export const getPasswordStrengthText = (strength: PasswordStrength['strength']): string => {
  switch (strength) {
    case 'very-weak':
      return 'Very Weak';
    case 'weak':
      return 'Weak';
    case 'medium':
      return 'Medium';
    case 'strong':
      return 'Strong';
    case 'very-strong':
      return 'Very Strong';
  }
};
