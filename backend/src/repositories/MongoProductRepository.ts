import { Collection, ObjectId } from 'mongodb';
import { IProductRepository } from './interfaces/IProductRepository';
import { Product, CreateProductDto, UpdateProductDto } from '../models/Product';
import DatabaseConnection from '../config/database';

/**
 * MongoDB implementation of the Product Repository
 * Handles all product-related database operations
 */
export class MongoProductRepository implements IProductRepository {
  private collection: Collection<Product>;
  private readonly collectionName = 'productos';

  constructor() {
    const db = DatabaseConnection.getInstance().getDb();
    this.collection = db.collection<Product>(this.collectionName);
  }

  /**
   * Retrieves all products from the collection
   */
  async findAll(): Promise<Product[]> {
    try {
      const products = await this.collection.find({}).toArray();
      return products;
    } catch (error) {
      console.error('Error finding all products:', error);
      throw new Error('Failed to retrieve products');
    }
  }

  /**
   * Finds a product by its ID
   */
  async findById(id: string): Promise<Product | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }
      
      const product = await this.collection.findOne({ _id: new ObjectId(id) });
      return product;
    } catch (error) {
      console.error(`Error finding product by ID ${id}:`, error);
      throw new Error('Failed to find product');
    }
  }

  /**
   * Creates a new product
   */
  async create(productData: CreateProductDto): Promise<Product> {
    try {
      const newProduct: Product = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(newProduct);
      const createdProduct = await this.findById(result.insertedId.toHexString());
      
      if (!createdProduct) {
        throw new Error('Failed to retrieve created product');
      }
      
      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Updates an existing product
   */
  async update(id: string, productData: UpdateProductDto): Promise<Product | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const updateData = {
        ...productData,
        updatedAt: new Date()
      };

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result || null;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error('Failed to update product');
    }
  }

  /**
   * Deletes a product by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw new Error('Failed to delete product');
    }
  }

  /**
   * Finds products by category
   */
  async findByCategory(category: string): Promise<Product[]> {
    try {
      const products = await this.collection.find({ category: category }).toArray();
      return products;
    } catch (error) {
      console.error(`Error finding products by category ${category}:`, error);
      throw new Error('Failed to find products by category');
    }
  }

  /**
   * Searches products by name or description
   */
  async search(query: string): Promise<Product[]> {
    try {
      const searchRegex = new RegExp(query, 'i');
      const products = await this.collection.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).toArray();
      
      return products;
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error);
      throw new Error('Failed to search products');
    }
  }
} 