// API service for sign.thelivingroomloja21.com

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.thelivingroomloja21.com';

export interface SignupVerifyRequest {
  email: string;
  tlrCode: string;
}

export interface SignupVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    tlrCode: string;
  };
}

export interface SignupRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  nif: string;
  address: string;
  tlrCode: string;
}

export interface SignupRegisterResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    firstName: string;
    lastName: string;
    status: string;
  };
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Step 1: Verify email and TLR code
  async verifyCredentials(data: SignupVerifyRequest): Promise<SignupVerifyResponse> {
    return this.request<SignupVerifyResponse>('/api/signup/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Step 2: Register user with full details
  async registerUser(data: SignupRegisterRequest): Promise<SignupRegisterResponse> {
    return this.request<SignupRegisterResponse>('/api/signup/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check endpoint
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/health');
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export individual functions for convenience
export const verifyCredentials = (data: SignupVerifyRequest) => apiService.verifyCredentials(data);
export const registerUser = (data: SignupRegisterRequest) => apiService.registerUser(data);
export const healthCheck = () => apiService.healthCheck();
