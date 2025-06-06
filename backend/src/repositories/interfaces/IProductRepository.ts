import { Product, CreateProductDto, UpdateProductDto } from '../../models/Product';

/**
 * Product Repository Interface
 * Defines the contract for product data access operations
 */
export interface IProductRepository {
  /**
   * Retrieves all products from the collection
   */
  findAll(): Promise<Product[]>;

  /**
   * Finds a product by its ID
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Creates a new product
   */
  create(product: CreateProductDto): Promise<Product>;

  /**
   * Updates an existing product
   */
  update(id: string, product: UpdateProductDto): Promise<Product | null>;

  /**
   * Deletes a product by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Finds products by category
   */
  findByCategory(category: string): Promise<Product[]>;

  /**
   * Searches products by name or description
   */
  search(query: string): Promise<Product[]>;
} 