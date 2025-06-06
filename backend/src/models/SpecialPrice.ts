import { ObjectId } from 'mongodb';

/**
 * Special Price interface for the preciosEspecialesBarake78 collection
 * Optimized structure for user-product price relationships
 */
export interface SpecialPrice {
  _id?: ObjectId;
  userId: string;
  userName: string;
  email: string;
  productId: string;
  productName: string;
  specialPrice: number;
  discount: number; // Percentage discount from original price
  isActive: boolean;
  notes?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

/**
 * DTO for creating a new special price entry
 */
export interface CreateSpecialPriceDto {
  userId: string;
  userName: string;
  email: string;
  productId: string;
  productName: string;
  specialPrice: number;
  discount: number;
  notes?: string;
}

/**
 * DTO for updating an existing special price entry
 */
export interface UpdateSpecialPriceDto {
  specialPrice?: number;
  discount?: number;
  isActive?: boolean;
  notes?: string;
}

/**
 * Interface for checking if a user has special pricing
 */
export interface UserSpecialPricing {
  userId: string;
  hasSpecialPricing: boolean;
  specialPrices: SpecialPrice[];
}

/**
 * Collection name for special prices
 * Format: preciosEspeciales<lastName><twoNumbers>
 */
export const SPECIAL_PRICES_COLLECTION = 'preciosEspecialesBarake78'; 