import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { z } from 'zod';
import axios from 'axios';

const passwordResetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

interface PasswordResetProps {
  token: string;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { watch } = form;
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const onSubmit = async (data: PasswordResetFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://api.thelivingroomloja21.com/api/auth/change_password', {
        token,
        password: data.password,
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Network error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md text-center border border-white/20">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
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

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            The Living Room
          </h1>
          <p className="text-gray-600 text-xl mb-8">Reset Your Password</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl mb-8 flex items-center shadow-sm">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Password Reset Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label className="block text-gray-800 text-sm font-semibold mb-3">
              New Password*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...form.register('password')}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="Enter new password"
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-800 text-sm font-semibold mb-3">
              New Password Again*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...form.register('confirmPassword')}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
                placeholder="Confirm new password"
              />
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Setting Password...
              </div>
            ) : (
              'Set Password'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>© 2024 The Living Room. All rights reserved.</p>
          <p className="mt-1">Private members club.</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
