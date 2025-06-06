import { Collection, ObjectId } from 'mongodb';
import { ISpecialPriceRepository } from './interfaces/ISpecialPriceRepository';
import { SpecialPrice, CreateSpecialPriceDto, UpdateSpecialPriceDto, UserSpecialPricing, SPECIAL_PRICES_COLLECTION } from '../models/SpecialPrice';
import DatabaseConnection from '../config/database';

/**
 * MongoDB implementation of the Special Price Repository
 * Handles all special price-related database operations
 */
export class MongoSpecialPriceRepository implements ISpecialPriceRepository {
  private collection: Collection<SpecialPrice>;

  constructor() {
    const db = DatabaseConnection.getInstance().getDb();
    this.collection = db.collection<SpecialPrice>(SPECIAL_PRICES_COLLECTION);
    
    // Create indexes for optimized queries
    this.createIndexes();
  }

  /**
   * Creates database indexes for optimized queries
   */
  private async createIndexes(): Promise<void> {
    try {
      await this.collection.createIndex({ userId: 1 });
      await this.collection.createIndex({ productId: 1 });
      await this.collection.createIndex({ userId: 1, productId: 1 }, { unique: true });
      await this.collection.createIndex({ isActive: 1 });
      await this.collection.createIndex({ validUntil: 1 });
    } catch (error) {
      console.warn('Warning: Could not create indexes:', error);
    }
  }

  /**
   * Retrieves all special price entries
   */
  async findAll(): Promise<SpecialPrice[]> {
    try {
      const specialPrices = await this.collection.find({}).toArray();
      return specialPrices;
    } catch (error) {
      console.error('Error finding all special prices:', error);
      throw new Error('Failed to retrieve special prices');
    }
  }

  /**
   * Finds a special price entry by its ID
   */
  async findById(id: string): Promise<SpecialPrice | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }
      
      const specialPrice = await this.collection.findOne({ _id: new ObjectId(id) });
      return specialPrice;
    } catch (error) {
      console.error(`Error finding special price by ID ${id}:`, error);
      throw new Error('Failed to find special price');
    }
  }

  /**
   * Creates a new special price entry
   */
  async create(specialPriceData: CreateSpecialPriceDto): Promise<SpecialPrice> {
    try {
      const newSpecialPrice: SpecialPrice = {
        ...specialPriceData,
        isActive: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };

      const result = await this.collection.insertOne(newSpecialPrice);
      const createdSpecialPrice = await this.findById(result.insertedId.toHexString());
      
      if (!createdSpecialPrice) {
        throw new Error('Failed to retrieve created special price');
      }
      
      return createdSpecialPrice;
    } catch (error: any) {
      console.error('Error creating special price:', error);
      
      // Handle duplicate key error specifically
      if (error.code === 11000) {
        throw new Error('A special price already exists for this user and product combination. Please update the existing one instead.');
      }
      
      throw new Error('Failed to create special price');
    }
  }

  /**
   * Updates an existing special price entry
   */
  async update(id: string, specialPriceData: UpdateSpecialPriceDto): Promise<SpecialPrice | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const updateData = {
        ...specialPriceData,
        fechaActualizacion: new Date()
      };

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result || null;
    } catch (error) {
      console.error(`Error updating special price ${id}:`, error);
      throw new Error('Failed to update special price');
    }
  }

  /**
   * Deletes a special price entry by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting special price ${id}:`, error);
      throw new Error('Failed to delete special price');
    }
  }

  /**
   * Finds all special prices for a specific user
   */
  async findByUserId(userId: string): Promise<SpecialPrice[]> {
    try {
      const specialPrices = await this.collection.find({ userId }).toArray();
      return specialPrices;
    } catch (error) {
      console.error(`Error finding special prices for user ${userId}:`, error);
      throw new Error('Failed to find special prices for user');
    }
  }

  /**
   * Finds special price for a specific user and product combination
   */
  async findByUserAndProduct(userId: string, productId: string): Promise<SpecialPrice | null> {
    try {
      const specialPrice = await this.collection.findOne({ 
        userId, 
        productId, 
        isActive: true
      });
      return specialPrice;
    } catch (error) {
      console.error(`Error finding special price for user ${userId} and product ${productId}:`, error);
      throw new Error('Failed to find special price for user and product');
    }
  }

  /**
   * Checks if a user has special pricing and returns their pricing info
   */
  async getUserSpecialPricing(userId: string): Promise<UserSpecialPricing> {
    try {
      const specialPrices = await this.findActiveByUserId(userId);
      
      return {
        userId,
        hasSpecialPricing: specialPrices.length > 0,
        specialPrices
      };
    } catch (error) {
      console.error(`Error getting user special pricing for ${userId}:`, error);
      throw new Error('Failed to get user special pricing');
    }
  }

  /**
   * Finds all active special prices for a user
   */
  async findActiveByUserId(userId: string): Promise<SpecialPrice[]> {
    try {
      const specialPrices = await this.collection.find({
        userId,
        isActive: true
      }).toArray();
      
      return specialPrices;
    } catch (error) {
      console.error(`Error finding active special prices for user ${userId}:`, error);
      throw new Error('Failed to find active special prices for user');
    }
  }

  /**
   * Deactivates expired special prices (no longer needed since dates are removed)
   */
  async deactivateExpired(): Promise<number> {
    try {
      // No expiration logic needed since dates are removed
      console.log('No expired special prices to deactivate (dates removed)');
      return 0;
    } catch (error) {
      console.error('Error deactivating expired special prices:', error);
      throw new Error('Failed to deactivate expired special prices');
    }
  }
} 