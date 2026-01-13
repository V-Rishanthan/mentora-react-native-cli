// utils/firebaseErrors.js
export const getAuthErrorMessage = errorCode => {
  const errorMessages = {
    // Registration Errors
    'auth/email-already-in-use':
      'Email already registered. Try logging in or use a different email.',
    'auth/invalid-email': 'Invalid email address. Please enter a valid email.',
    'auth/weak-password':
      'Password is too weak. It should be at least 6 characters.',
    'auth/operation-not-allowed':
      'Email/password accounts are not enabled. Contact support.',

    // Login Errors
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/user-disabled': 'This account has been disabled. Contact support.',
    'auth/user-not-found':
      'No account found with this email. Please register first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',

    // Common Errors
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed':
      'Network error. Please check your internet connection.',
    'auth/internal-error': 'An internal error occurred. Please try again.',

    // Default
    default: 'An error occurred. Please try again.',
  };

  return errorMessages[errorCode] || errorMessages['default'];
};
