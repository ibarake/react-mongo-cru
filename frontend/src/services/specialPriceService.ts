import apiService from './api';
import { SpecialPrice, CreateSpecialPriceDto } from '@/types';

/**
 * Special Price Service
 * Handles all special pricing-related API operations
 */
export class SpecialPriceService {
  private readonly endpoint = '/special-prices';

  /**
   * Get all special prices
   */
  async getAllSpecialPrices(): Promise<SpecialPrice[]> {
    return apiService.get<SpecialPrice[]>(this.endpoint);
  }

  /**
   * Get special price by ID
   */
  async getSpecialPriceById(id: string): Promise<SpecialPrice> {
    return apiService.get<SpecialPrice>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new special price entry
   */
  async createSpecialPrice(specialPriceData: CreateSpecialPriceDto): Promise<SpecialPrice> {
    return apiService.post<SpecialPrice>(this.endpoint, specialPriceData);
  }

  /**
   * Update an existing special price entry
   */
  async updateSpecialPrice(id: string, specialPriceData: Partial<CreateSpecialPriceDto>): Promise<SpecialPrice> {
    return apiService.put<SpecialPrice>(`${this.endpoint}/${id}`, specialPriceData);
  }

  /**
   * Delete a special price entry
   */
  async deleteSpecialPrice(id: string): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Get special prices for a specific user
   */
  async getSpecialPricesForUser(userId: string): Promise<SpecialPrice[]> {
    return apiService.get<SpecialPrice[]>(`${this.endpoint}/user/${userId}`);
  }

  /**
   * Get special price for a specific user and product combination
   */
  async getSpecialPriceByUserAndProduct(userId: string, productId: string): Promise<SpecialPrice> {
    return apiService.get<SpecialPrice>(`${this.endpoint}/user/${userId}/product/${productId}`);
  }

  /**
   * Get user special pricing information
   */
  async getUserSpecialPricing(userId: string): Promise<{
    userId: string;
    hasSpecialPricing: boolean;
    specialPrices: SpecialPrice[];
  }> {
    return apiService.get(`${this.endpoint}/user/${userId}/pricing`);
  }

  /**
   * Deactivate expired special prices
   */
  async deactivateExpiredSpecialPrices(): Promise<{ deactivatedCount: number }> {
    return apiService.post(`${this.endpoint}/cleanup`);
  }
}

// Export singleton instance
export const specialPriceService = new SpecialPriceService();
export default specialPriceService; 