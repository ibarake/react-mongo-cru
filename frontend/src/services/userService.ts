import { User, PublicUser, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * User Service
 * Handles API calls for user operations
 */
class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/users`;
  }

  /**
   * Makes HTTP requests with error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return data.data as T;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  /**
   * Get all users (public data only)
   */
  async getAllPublicUsers(): Promise<PublicUser[]> {
    return this.makeRequest<PublicUser[]>('/public');
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    return this.makeRequest<User>(`/${id}`);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User> {
    const encodedEmail = encodeURIComponent(email);
    return this.makeRequest<User>(`/email/${encodedEmail}`);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    return this.makeRequest<User[]>(`/role/${role}`);
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<User[]> {
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest<User[]>(`/search/${encodedQuery}`);
  }

  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, '_id' | '__v'>): Promise<User> {
    return this.makeRequest<User>('', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.makeRequest<User>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Delete a user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    return this.makeRequest<void>(`/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const userService = new UserService(); 