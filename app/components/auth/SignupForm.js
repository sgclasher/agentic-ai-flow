'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Signup Form Component
 * 
 * Modern registration form with email/password authentication, validation,
 * comprehensive error handling, and user metadata collection.
 */

export default function SignupForm({ onSuccess, onSwitchToLogin }) {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const metadata = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`
      };

      const result = await signUp(formData.email, formData.password, metadata);
      
      console.log('Signup successful:', result.user?.email);
      
      // Check if email confirmation is required
      if (!result.session && result.user && !result.user.email_confirmed_at) {
        setSignupComplete(true);
      } else if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific Supabase auth errors
      let errorMessage = 'Account creation failed. Please try again.';
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please try signing in instead.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Password does not meet requirements. Please choose a stronger password.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('signup is disabled')) {
        errorMessage = 'Account registration is currently disabled. Please contact support.';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message if email confirmation is required
  if (signupComplete) {
    return (
      <div className="signup-success">
        <div className="success-icon">
          <CheckCircle size={48} />
        </div>
        <h2>Check Your Email</h2>
        <p>
          We've sent a confirmation link to <strong>{formData.email}</strong>
        </p>
        <p>
          Please check your email and click the confirmation link to complete your account setup.
        </p>
        <button
          type="button"
          className="link-button"
          onClick={onSwitchToLogin}
        >
          Back to Sign In
        </button>

        <style jsx>{`
          .signup-success {
            text-align: center;
            padding: 2rem;
            max-width: 400px;
            margin: 0 auto;
          }

          .success-icon {
            color: #10b981;
            margin-bottom: 1rem;
          }

          h2 {
            color: #2d3748;
            margin-bottom: 1rem;
          }

          p {
            color: #718096;
            margin-bottom: 1rem;
            line-height: 1.5;
          }

          .link-button {
            background: none;
            border: none;
            color: #3498db;
            font-weight: 500;
            cursor: pointer;
            text-decoration: underline;
            margin-top: 1rem;
          }

          .link-button:hover {
            color: #2980b9;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="signup-form-container">
      <div className="signup-form-header">
        <div className="signup-icon">
          <UserPlus size={24} />
        </div>
        <h2>Create Account</h2>
        <p>Join us to start managing your AI transformation journey</p>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* General Error */}
        {errors.general && (
          <div className="form-error">
            <AlertCircle size={16} />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Name Fields */}
        <div className="name-fields">
          <div className="form-group">
            <label htmlFor="firstName">
              <User size={16} />
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className={errors.firstName ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <span className="field-error">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              <User size={16} />
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className={errors.lastName ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <span className="field-error">{errors.lastName}</span>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">
            <Mail size={16} />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={errors.email ? 'error' : ''}
            disabled={isSubmitting}
            autoComplete="email"
          />
          {errors.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">
            <Lock size={16} />
            Password
          </label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={errors.password ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
          <div className="password-requirements">
            <small>Password must be at least 8 characters with uppercase, lowercase, and number</small>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">
            <Lock size={16} />
            Confirm Password
          </label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isSubmitting}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="signup-button"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? (
            <>
              <div className="spinner" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Create Account
            </>
          )}
        </button>

        {/* Switch to Login */}
        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
              disabled={isSubmitting}
            >
              Sign In
            </button>
          </p>
        </div>
      </form>

      <style jsx>{`
        .signup-form-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .signup-form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .signup-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .signup-form-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.5rem;
        }

        .signup-form-header p {
          color: #718096;
          font-size: 0.9rem;
          margin: 0;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.9rem;
        }

        .name-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4a5568;
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: #f7fafc;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
          background-color: white;
        }

        .form-group input.error {
          border-color: #dc2626;
          background-color: #fef2f2;
        }

        .form-group input:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: #4a5568;
        }

        .field-error {
          font-size: 0.8rem;
          color: #dc2626;
        }

        .password-requirements {
          margin-top: 0.25rem;
        }

        .password-requirements small {
          color: #718096;
          font-size: 0.75rem;
        }

        .signup-button {
          width: 100%;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .signup-button:hover:not(:disabled) {
          background-color: #059669;
          transform: translateY(-1px);
        }

        .signup-button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 1rem;
        }

        .form-footer p {
          color: #718096;
          font-size: 0.9rem;
          margin: 0;
        }

        .link-button {
          background: none;
          border: none;
          color: #3498db;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
        }

        .link-button:hover:not(:disabled) {
          color: #2980b9;
        }

        .link-button:disabled {
          color: #a0aec0;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
} 