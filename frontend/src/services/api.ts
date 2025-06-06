import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '@/types';

/**
 * API Service Configuration
 * Handles HTTP requests to the backend API
 */
class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        console.error(`❌ ${error.response?.status} ${error.config?.url}`);
        
        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const message = error.response.data?.message || 'Server error occurred';
          throw new Error(message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('Network error - please check your connection');
        } else {
          // Something else happened
          throw new Error('An unexpected error occurred');
        }
      }
    );
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(endpoint, { params });
      return response.data.data as T;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(endpoint, data);
      return response.data.data as T;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(endpoint, data);
      return response.data.data as T;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(endpoint);
      return response.data.data as T;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ message: string; timestamp: string }> {
    try {
      const response = await axios.get(`${this.baseURL.replace('/api', '')}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Unable to connect to server');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 