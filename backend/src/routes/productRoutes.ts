import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { MongoProductRepository } from '../repositories/MongoProductRepository';

/**
 * Product Routes
 * Defines API endpoints for product operations
 */
export function createProductRoutes(): Router {
  const router = Router();

  // Initialize dependencies
  const productRepository = new MongoProductRepository();
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  // Route definitions
  router.get('/', productController.getAllProducts);
  router.get('/search', productController.searchProducts);
  router.get('/category/:category', productController.getProductsByCategory);
  router.get('/:id', productController.getProductById);
  router.post('/', productController.createProduct);
  router.put('/:id', productController.updateProduct);
  router.delete('/:id', productController.deleteProduct);

  return router;
} 