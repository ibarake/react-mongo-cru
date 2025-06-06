import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

/**
 * Product Controller
 * Handles HTTP requests and responses for product operations
 */
export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   * GET /api/products
   * Retrieves all products
   */
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json({
        success: true,
        data: products,
        message: 'Products retrieved successfully'
      });
    } catch (error) {
      console.error('Controller error getting all products:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve products'
      });
    }
  };

  /**
   * GET /api/products/:id
   * Retrieves a product by ID
   */
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
          message: `Product with ID ${id} does not exist`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
        message: 'Product retrieved successfully'
      });
    } catch (error) {
      console.error('Controller error getting product by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve product'
      });
    }
  };

  /**
   * POST /api/products
   * Creates a new product
   */
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productData = req.body;
      const newProduct = await this.productService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        data: newProduct,
        message: 'Product created successfully'
      });
    } catch (error) {
      console.error('Controller error creating product:', error);
      
      if (error instanceof Error) {
        // Handle validation errors
        if (error.message.includes('Validation errors') || 
            error.message.includes('already exists') ||
            error.message.includes('required')) {
          res.status(400).json({
            success: false,
            error: 'Bad request',
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create product'
      });
    }
  };

  /**
   * PUT /api/products/:id
   * Updates an existing product
   */
  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      const updatedProduct = await this.productService.updateProduct(id, productData);
      
      if (!updatedProduct) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
          message: `Product with ID ${id} does not exist`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Controller error updating product:', error);
      
      if (error instanceof Error) {
        // Handle validation errors
        if (error.message.includes('Validation errors') || 
            error.message.includes('required') ||
            error.message.includes('not found')) {
          res.status(400).json({
            success: false,
            error: 'Bad request',
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update product'
      });
    }
  };

  /**
   * DELETE /api/products/:id
   * Deletes a product
   */
  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.productService.deleteProduct(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
          message: `Product with ID ${id} does not exist`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Controller error deleting product:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete product'
      });
    }
  };

  /**
   * GET /api/products/search?q=query
   * Searches products by name or description
   */
  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;
      const query = typeof q === 'string' ? q : '';
      
      const products = await this.productService.searchProducts(query);
      
      res.status(200).json({
        success: true,
        data: products,
        message: `Found ${products.length} products matching "${query}"`
      });
    } catch (error) {
      console.error('Controller error searching products:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to search products'
      });
    }
  };

  /**
   * GET /api/products/category/:category
   * Gets products by category
   */
  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      const products = await this.productService.getProductsByCategory(category);
      
      res.status(200).json({
        success: true,
        data: products,
        message: `Found ${products.length} products in category "${category}"`
      });
    } catch (error) {
      console.error('Controller error getting products by category:', error);
      
      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({
          success: false,
          error: 'Bad request',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to get products by category'
      });
    }
  };
} 