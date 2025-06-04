'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

/**
 * Authentication Modal Component
 * 
 * Modal wrapper that handles switching between login and signup forms.
 * Provides a unified authentication interface with smooth transitions.
 */

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode); // 'login' or 'signup'

  // Handle successful authentication
  const handleAuthSuccess = (result) => {
    console.log('Authentication successful:', result.user?.email);
    onClose();
  };

  // Switch between login and signup
  const switchToLogin = () => setMode('login');
  const switchToSignup = () => setMode('signup');

  // Handle modal close
  const handleClose = () => {
    setMode('login'); // Reset to login mode
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleBackdropClick}>
      <div className="auth-modal">
        {/* Close Button */}
        <button
          className="close-button"
          onClick={handleClose}
          aria-label="Close authentication modal"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="auth-modal-content">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignup={switchToSignup}
            />
          ) : (
            <SignupForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={switchToLogin}
            />
          )}
        </div>

        {/* Footer */}
        <div className="auth-modal-footer">
          <p>
            By {mode === 'login' ? 'signing in' : 'creating an account'}, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .auth-modal {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #f7fafc;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #718096;
          transition: all 0.2s ease;
          z-index: 1;
        }

        .close-button:hover {
          background: #e2e8f0;
          color: #4a5568;
        }

        .auth-modal-content {
          padding: 2rem;
          padding-top: 3rem; /* Make room for close button */
        }

        .auth-modal-footer {
          padding: 1rem 2rem 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f7fafc;
          border-radius: 0 0 16px 16px;
        }

        .auth-modal-footer p {
          text-align: center;
          font-size: 0.8rem;
          color: #718096;
          margin: 0;
          line-height: 1.5;
        }

        .auth-modal-footer a {
          color: #3498db;
          text-decoration: none;
        }

        .auth-modal-footer a:hover {
          text-decoration: underline;
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .auth-modal-overlay {
            padding: 0.5rem;
          }

          .auth-modal {
            max-height: 95vh;
          }

          .auth-modal-content {
            padding: 1.5rem;
            padding-top: 2.5rem;
          }

          .auth-modal-footer {
            padding: 1rem 1.5rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
} 