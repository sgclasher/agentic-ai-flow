'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

/**
 * Login Form Component
 * 
 * Modern login form with email/password authentication, validation,
 * and comprehensive error handling. Integrates with AuthContext.
 */

export default function LoginForm({ onSuccess, onSwitchToSignup }) {
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const result = await signIn(formData.email, formData.password);
      
      console.log('Login successful:', result.user?.email);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific Supabase auth errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <div className="login-icon">
          <LogIn size={24} />
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {/* General Error */}
        {errors.general && (
          <div className="form-error">
            <AlertCircle size={16} />
            <span>{errors.general}</span>
          </div>
        )}

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
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="current-password"
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="login-button"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? (
            <>
              <div className="spinner" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn size={16} />
              Sign In
            </>
          )}
        </button>

        {/* Switch to Signup */}
        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToSignup}
              disabled={isSubmitting}
            >
              Create Account
            </button>
          </p>
        </div>
      </form>

      <style jsx>{`
        .login-form-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .login-form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          background: #3498db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .login-form-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.5rem;
        }

        .login-form-header p {
          color: #718096;
          font-size: 0.9rem;
          margin: 0;
        }

        .login-form {
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
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
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

        .login-button {
          width: 100%;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          background-color: #2980b9;
          transform: translateY(-1px);
        }

        .login-button:disabled {
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