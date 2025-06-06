import { SpecialPrice, CreateSpecialPriceDto, UpdateSpecialPriceDto, UserSpecialPricing } from '../../models/SpecialPrice';

/**
 * Special Price Repository Interface
 * Defines the contract for special price data access operations
 */
export interface ISpecialPriceRepository {
  /**
   * Retrieves all special price entries
   */
  findAll(): Promise<SpecialPrice[]>;

  /**
   * Finds a special price entry by its ID
   */
  findById(id: string): Promise<SpecialPrice | null>;

  /**
   * Creates a new special price entry
   */
  create(specialPrice: CreateSpecialPriceDto): Promise<SpecialPrice>;

  /**
   * Updates an existing special price entry
   */
  update(id: string, specialPrice: UpdateSpecialPriceDto): Promise<SpecialPrice | null>;

  /**
   * Deletes a special price entry by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Finds all special prices for a specific user
   */
  findByUserId(userId: string): Promise<SpecialPrice[]>;

  /**
   * Finds special price for a specific user and product combination
   */
  findByUserAndProduct(userId: string, productId: string): Promise<SpecialPrice | null>;

  /**
   * Checks if a user has special pricing and returns their pricing info
   */
  getUserSpecialPricing(userId: string): Promise<UserSpecialPricing>;

  /**
   * Finds all active special prices for a user
   */
  findActiveByUserId(userId: string): Promise<SpecialPrice[]>;

  /**
   * Deactivates expired special prices
   */
  deactivateExpired(): Promise<number>;
} 