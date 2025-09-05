import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Hash, User, Phone, MapPin, CheckCircle } from 'lucide-react';
import { step1Schema, step2Schema, Step1FormData, Step2FormData } from './utils/validation';
import { verifyCredentials, registerUser } from './services/api';
import PasswordReset from './components/PasswordReset';
import './App.css';

// Password Reset Route Component
const PasswordResetRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md text-center border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">The password reset link is invalid or missing a token.</p>
          <button
            onClick={() => window.location.href = 'https://signup.thelivingroomloja21.com'}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Return to Signup
          </button>
        </div>
      </div>
    );
  }

  return <PasswordReset token={token} />;
};

// Main Signup Component
function SignupApp() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);

  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: '',
      tlrCode: '',
    },
  });

  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '1970-01-01',
      phone: '',
      nif: '',
      address: '',
      tlrCode: '',
    },
  });

  const onStep1Submit = async (data: Step1FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the signup API to validate TLR code and check if email exists
      const response = await verifyCredentials(data);
      
      if (response.success) {
        setStep1Data(data);
        step2Form.setValue('email', data.email);
        step2Form.setValue('tlrCode', data.tlrCode);
        setStep(2);
      } else {
        // Stay on step 1 if validation fails
        setError(response.message || 'Invalid TLR code or email already exists');
      }
    } catch (err: any) {
      // Stay on step 1 if there's an error
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onStep2Submit = async (data: Step2FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerUser(data);
      
      if (response.success) {
        setShowSuccess(true);
        
        // Redirect after 8 seconds
        setTimeout(() => {
          window.location.href = 'https://signup.thelivingroomloja21.com';
        }, 8000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = 'https://signup.thelivingroomloja21.com';
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md text-center border border-white/20">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your account has been created successfully! You should receive an email in a couple of days.
          </p>
          <div className="text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-lg">
            Redirecting to signup.thelivingroomloja21.com...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            The Living Room
          </h1>
          <p className="text-gray-600 text-xl mb-8">Private Members Club</p>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className={`w-4 h-4 rounded-full transition-colors duration-200 ${step >= 1 ? 'bg-blue-600 shadow-md' : 'bg-gray-300'}`}></div>
            <div className={`w-4 h-4 rounded-full transition-colors duration-200 ${step >= 2 ? 'bg-blue-600 shadow-md' : 'bg-gray-300'}`}></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Step {step} of 2</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl mb-8 flex items-center shadow-sm">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Step 1: Email and TLR Code */}
        {step === 1 && (
          <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-8">
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                Email Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...step1Form.register('email')}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                  placeholder="Enter your email address"
                />
              </div>
              {step1Form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {step1Form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                TLR Code*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...step1Form.register('tlrCode')}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-center text-lg font-mono tracking-widest shadow-sm"
                  placeholder="000"
                  maxLength={3}
                />
              </div>
              {step1Form.formState.errors.tlrCode && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {step1Form.formState.errors.tlrCode.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        )}

        {/* Step 2: User Details */}
        {step === 2 && (
          <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-8">
            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                Email Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...step2Form.register('email')}
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed shadow-sm"
                  value={step1Data?.email}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-800 text-sm font-semibold mb-3">
                  First Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...step2Form.register('firstName')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                    placeholder="First name"
                  />
                </div>
                {step2Form.formState.errors.firstName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {step2Form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-800 text-sm font-semibold mb-3">
                  Last Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...step2Form.register('lastName')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                    placeholder="Last name"
                  />
                </div>
                {step2Form.formState.errors.lastName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {step2Form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                Date of Birth*
              </label>
              <input
                type="date"
                {...step2Form.register('dateOfBirth')}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                defaultValue="1970-01-01"
              />
              {step2Form.formState.errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {step2Form.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                Phone Number*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...step2Form.register('phone')}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                  placeholder="Phone number"
                />
              </div>
              {step2Form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {step2Form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                NIF*
              </label>
              <input
                type="text"
                {...step2Form.register('nif')}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="NIF number"
              />
              {step2Form.formState.errors.nif && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {step2Form.formState.errors.nif.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-semibold mb-3">
                Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...step2Form.register('address')}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                  placeholder="Full address (min. 10 chars)"
                />
              </div>
              {step2Form.formState.errors.address && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {step2Form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !step2Form.formState.isValid}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>© 2024 The Living Room. All rights reserved.</p>
          <p className="mt-1">Private members club.</p>
        </div>
      </div>
    </div>
  );
}

// Main App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/password_reset" element={<PasswordResetRoute />} />
        <Route path="/*" element={<SignupApp />} />
      </Routes>
    </Router>
  );
}

export default App;
