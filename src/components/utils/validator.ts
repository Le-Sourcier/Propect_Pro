export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 25;

  // Uppercase check
  if (/[A-Z]/.test(password)) strength += 25;

  // Lowercase check
  if (/[a-z]/.test(password)) strength += 25;

  // Special character or number check
  if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

  return strength;
};
