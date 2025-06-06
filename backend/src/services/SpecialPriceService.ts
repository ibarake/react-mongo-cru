import { ISpecialPriceRepository } from '../repositories/interfaces/ISpecialPriceRepository';
import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { SpecialPrice, CreateSpecialPriceDto, UpdateSpecialPriceDto, UserSpecialPricing } from '../models/SpecialPrice';
import { Product } from '../models/Product';

/**
 * Special Price Service
 * Contains business logic for special pricing operations
 */
export class SpecialPriceService {
  constructor(
    private specialPriceRepository: ISpecialPriceRepository,
    private productRepository: IProductRepository
  ) {}

  /**
   * Retrieves all special price entries
   */
  async getAllSpecialPrices(): Promise<SpecialPrice[]> {
    try {
      return await this.specialPriceRepository.findAll();
    } catch (error) {
      console.error('Service error getting all special prices:', error);
      throw new Error('Failed to retrieve special prices');
    }
  }

  /**
   * Retrieves a special price by ID
   */
  async getSpecialPriceById(id: string): Promise<SpecialPrice | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Special price ID is required');
      }

      return await this.specialPriceRepository.findById(id);
    } catch (error) {
      console.error(`Service error getting special price by ID ${id}:`, error);
      throw new Error('Failed to retrieve special price');
    }
  }

  /**
   * Creates a new special price entry
   */
  async createSpecialPrice(specialPriceData: CreateSpecialPriceDto): Promise<SpecialPrice> {
    try {
      // Validate required fields
      await this.validateSpecialPriceData(specialPriceData);

      // Check if product exists
      const product = await this.productRepository.findById(specialPriceData.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Check for existing special price for this user-product combination
      const existingSpecialPrice = await this.specialPriceRepository.findByUserAndProduct(
        specialPriceData.userId,
        specialPriceData.productId
      );

      if (existingSpecialPrice) {
        throw new Error('A special price already exists for this user and product combination. Please update the existing one instead.');
      }

      // Validate that special price is lower than original price
      if (specialPriceData.specialPrice >= product.price) {
        throw new Error('Special price must be lower than the original product price');
      }

      return await this.specialPriceRepository.create(specialPriceData);
    } catch (error) {
      console.error('Service error creating special price:', error);
      
      // Handle MongoDB duplicate key error
      if (error instanceof Error && error.message.includes('E11000 duplicate key error')) {
        throw new Error('A special price already exists for this user and product combination. Please update the existing one instead.');
      }
      
      throw error;
    }
  }

  /**
   * Updates an existing special price entry
   */
  async updateSpecialPrice(id: string, specialPriceData: UpdateSpecialPriceDto): Promise<SpecialPrice | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Special price ID is required');
      }

      // Check if special price exists
      const existingSpecialPrice = await this.specialPriceRepository.findById(id);
      if (!existingSpecialPrice) {
        throw new Error('Special price not found');
      }

      // Validate update data
      await this.validateUpdateData(specialPriceData, existingSpecialPrice);

      return await this.specialPriceRepository.update(id, specialPriceData);
    } catch (error) {
      console.error(`Service error updating special price ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a special price entry
   */
  async deleteSpecialPrice(id: string): Promise<boolean> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Special price ID is required');
      }

      const existingSpecialPrice = await this.specialPriceRepository.findById(id);
      if (!existingSpecialPrice) {
        throw new Error('Special price not found');
      }

      return await this.specialPriceRepository.delete(id);
    } catch (error) {
      console.error(`Service error deleting special price ${id}:`, error);
      throw error;
    }
  }

  /**
   * Gets all special prices for a specific user
   */
  async getSpecialPricesForUser(userId: string): Promise<SpecialPrice[]> {
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      return await this.specialPriceRepository.findByUserId(userId);
    } catch (error) {
      console.error(`Service error getting special prices for user ${userId}:`, error);
      throw new Error('Failed to get special prices for user');
    }
  }

  /**
   * Gets special price for a specific user and product combination
   */
  async getSpecialPriceByUserAndProduct(userId: string, productId: string): Promise<SpecialPrice | null> {
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      if (!productId || productId.trim() === '') {
        throw new Error('Product ID is required');
      }

      return await this.specialPriceRepository.findByUserAndProduct(userId, productId);
    } catch (error) {
      console.error(`Service error getting special price for user ${userId} and product ${productId}:`, error);
      throw new Error('Failed to get special price for user and product');
    }
  }

  /**
   * Checks if a user has special pricing and returns comprehensive pricing info
   */
  async getUserSpecialPricing(userId: string): Promise<UserSpecialPricing> {
    try {
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      return await this.specialPriceRepository.getUserSpecialPricing(userId);
    } catch (error) {
      console.error(`Service error getting user special pricing for ${userId}:`, error);
      throw new Error('Failed to get user special pricing');
    }
  }

  /**
   * Gets products with special pricing applied for a specific user
   */
  async getProductsWithSpecialPricing(userId: string): Promise<(Product & { specialPrice?: number; hasSpecialPrice: boolean })[]> {
    try {
      // Get all products
      const products = await this.productRepository.findAll();
      
      // Get user's special pricing
      const userSpecialPricing = await this.getUserSpecialPricing(userId);
      
      // Map special prices to products
      const productsWithSpecialPricing = products.map(product => {
        const specialPrice = userSpecialPricing.specialPrices.find(
          sp => sp.productId === product._id?.toHexString()
        );
        
        return {
          ...product,
          specialPrice: specialPrice?.specialPrice,
          hasSpecialPrice: !!specialPrice
        };
      });

      return productsWithSpecialPricing;
    } catch (error) {
      console.error(`Service error getting products with special pricing for user ${userId}:`, error);
      throw new Error('Failed to get products with special pricing');
    }
  }

  /**
   * Deactivates expired special prices
   */
  async deactivateExpiredSpecialPrices(): Promise<number> {
    try {
      return await this.specialPriceRepository.deactivateExpired();
    } catch (error) {
      console.error('Service error deactivating expired special prices:', error);
      throw new Error('Failed to deactivate expired special prices');
    }
  }

  /**
   * Validates special price data for creation
   */
  private async validateSpecialPriceData(specialPriceData: CreateSpecialPriceDto): Promise<void> {
    const errors: string[] = [];

    if (!specialPriceData.userId || specialPriceData.userId.trim() === '') {
      errors.push('User ID is required');
    }

    if (!specialPriceData.userName || specialPriceData.userName.trim() === '') {
      errors.push('User name is required');
    }

    if (!specialPriceData.email || specialPriceData.email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(specialPriceData.email)) {
      errors.push('Email format is invalid');
    }

    if (!specialPriceData.productId || specialPriceData.productId.trim() === '') {
      errors.push('Product ID is required');
    }

    if (!specialPriceData.productName || specialPriceData.productName.trim() === '') {
      errors.push('Product name is required');
    }

    if (typeof specialPriceData.specialPrice !== 'number' || specialPriceData.specialPrice <= 0) {
      errors.push('Special price must be a positive number');
    }

    if (typeof specialPriceData.discount !== 'number' || specialPriceData.discount < 0 || specialPriceData.discount > 100) {
      errors.push('Discount must be a number between 0 and 100');
    }



    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }

  /**
   * Validates special price data for updates
   */
  private async validateUpdateData(specialPriceData: UpdateSpecialPriceDto, existingSpecialPrice: SpecialPrice): Promise<void> {
    const errors: string[] = [];

    if (specialPriceData.specialPrice !== undefined) {
      if (typeof specialPriceData.specialPrice !== 'number' || specialPriceData.specialPrice <= 0) {
        errors.push('Special price must be a positive number');
      } else {
        // Validate against product price
        const product = await this.productRepository.findById(existingSpecialPrice.productId);
        if (product && specialPriceData.specialPrice >= product.price) {
          errors.push('Special price must be lower than the original product price');
        }
      }
    }

    if (specialPriceData.discount !== undefined && 
        (typeof specialPriceData.discount !== 'number' || specialPriceData.discount < 0 || specialPriceData.discount > 100)) {
      errors.push('Discount must be a number between 0 and 100');
    }



    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }

  /**
   * Validates email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 