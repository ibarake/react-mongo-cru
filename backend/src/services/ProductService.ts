import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { Product, CreateProductDto, UpdateProductDto } from '../models/Product';

/**
 * Product Service
 * Contains business logic for product operations
 */
export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  /**
   * Retrieves all products
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.findAll();
    } catch (error) {
      console.error('Service error getting all products:', error);
      throw new Error('Failed to retrieve products');
    }
  }

  /**
   * Retrieves a product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Product ID is required');
      }

      return await this.productRepository.findById(id);
    } catch (error) {
      console.error(`Service error getting product by ID ${id}:`, error);
      throw new Error('Failed to retrieve product');
    }
  }

  /**
   * Creates a new product
   */
  async createProduct(productData: CreateProductDto): Promise<Product> {
    try {
      // Validate required fields
      this.validateProductData(productData);

      // Check for duplicate product names
      const existingProducts = await this.productRepository.search(productData.name);
      const duplicateProduct = existingProducts.find(
        product => product.name.toLowerCase() === productData.name.toLowerCase()
      );

      if (duplicateProduct) {
        throw new Error('A product with this name already exists');
      }

      return await this.productRepository.create(productData);
    } catch (error) {
      console.error('Service error creating product:', error);
      throw error;
    }
  }

  /**
   * Updates an existing product
   */
  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Product ID is required');
      }

      // Validate update data
      this.validateUpdateData(productData);

      // Check if product exists
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      return await this.productRepository.update(id, productData);
    } catch (error) {
      console.error(`Service error updating product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a product
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Product ID is required');
      }

      // Check if product exists
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      return await this.productRepository.delete(id);
    } catch (error) {
      console.error(`Service error deleting product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Searches products by query
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      if (!query || query.trim() === '') {
        return await this.getAllProducts();
      }

      return await this.productRepository.search(query.trim());
    } catch (error) {
      console.error(`Service error searching products with query ${query}:`, error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Gets products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      if (!category || category.trim() === '') {
        throw new Error('Category is required');
      }

      return await this.productRepository.findByCategory(category);
    } catch (error) {
      console.error(`Service error getting products by category ${category}:`, error);
      throw new Error('Failed to get products by category');
    }
  }

  /**
   * Validates product data for creation
   */
  private validateProductData(productData: CreateProductDto): void {
    const errors: string[] = [];

    if (!productData.name || productData.name.trim() === '') {
      errors.push('Product name is required');
    }

    if (!productData.description || productData.description.trim() === '') {
      errors.push('Product description is required');
    }

    if (typeof productData.price !== 'number' || productData.price <= 0) {
      errors.push('Product price must be a positive number');
    }

    if (!productData.category || productData.category.trim() === '') {
      errors.push('Product category is required');
    }

    if (typeof productData.stock !== 'number' || productData.stock < 0) {
      errors.push('Product stock must be a non-negative number');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }

  /**
   * Validates product data for updates
   */
  private validateUpdateData(productData: UpdateProductDto): void {
    const errors: string[] = [];

    if (productData.name !== undefined && (!productData.name || productData.name.trim() === '')) {
      errors.push('Product name cannot be empty');
    }

    if (productData.description !== undefined && (!productData.description || productData.description.trim() === '')) {
      errors.push('Product description cannot be empty');
    }

    if (productData.price !== undefined && (typeof productData.price !== 'number' || productData.price <= 0)) {
      errors.push('Product price must be a positive number');
    }

    if (productData.category !== undefined && (!productData.category || productData.category.trim() === '')) {
      errors.push('Product category cannot be empty');
    }

    if (productData.stock !== undefined && (typeof productData.stock !== 'number' || productData.stock < 0)) {
      errors.push('Product stock must be a non-negative number');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }
} 