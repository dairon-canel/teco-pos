export const validateField = (name: string, value: string): string | null => {
  value = value.trim();

  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!value) return 'This field is required';
      if (value.length < 2) return 'Must be at least 2 characters';
      if (value.length > 50) return 'Cannot exceed 50 characters';
      if (!/^[A-Za-z\s'-]+$/.test(value))
        return 'Can only contain letters, spaces, hyphens and apostrophes';
      return null;

    case 'address':
      if (!value) return 'This field is required';
      if (value.length < 5) return 'Address is too short';
      if (value.length > 100) return 'Address is too long (max 100 characters)';
      // Should contain at least a number and some text
      if (!/\d/.test(value) || !/[a-zA-Z]/.test(value))
        return 'Please enter a valid address with number and street';
      return null;

    case 'city':
      if (!value) return 'This field is required';
      if (value.length < 2) return 'City name is too short';
      if (value.length > 50) return 'City name is too long';
      // Allow letters, spaces, hyphens, and periods (for abbreviations like "St.")
      if (!/^[A-Za-z\s.-]+$/.test(value))
        return 'Can only contain letters, spaces, periods, and hyphens';
      return null;

    case 'postalCode':
      if (!value) return 'This field is required';
      // US postal code format: 5 digits or 5+4 format
      if (!/^\d{5}(-\d{4})?$/.test(value))
        return 'Please enter a valid postal code (e.g., 12345 or 12345-6789)';
      return null;

    case 'email':
      if (!value) return 'This field is required';
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'Please enter a valid email address';
      return null;

    case 'phone':
      if (!value) return 'This field is required';
      // Allow common phone formats: (123) 456-7890 or 123-456-7890 or 1234567890
      if (!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value))
        return 'Please enter a valid phone number';
      return null;

    default:
      return null;
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
