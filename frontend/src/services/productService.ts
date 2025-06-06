import apiService from './api';
import { Product, CreateProductDto, UpdateProductDto, ProductWithSpecialPrice } from '@/types';

/**
 * Product Service
 * Handles all product-related API operations
 */
export class ProductService {
  private readonly endpoint = '/products';

  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    return apiService.get<Product[]>(this.endpoint);
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    return apiService.get<Product>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new product
   */
  async createProduct(productData: CreateProductDto): Promise<Product> {
    return apiService.post<Product>(this.endpoint, productData);
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    return apiService.put<Product>(`${this.endpoint}/${id}`, productData);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string): Promise<Product[]> {
    return apiService.get<Product[]>(`${this.endpoint}/search`, { q: query });
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    return apiService.get<Product[]>(`${this.endpoint}/category/${category}`);
  }

  /**
   * Get products with special pricing for a user
   */
  async getProductsWithSpecialPricing(userId: string): Promise<ProductWithSpecialPrice[]> {
    return apiService.get<ProductWithSpecialPrice[]>(`/special-prices/user/${userId}/products`);
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService; 