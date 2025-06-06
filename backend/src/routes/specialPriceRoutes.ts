import { Router } from 'express';
import { SpecialPriceController } from '../controllers/SpecialPriceController';
import { SpecialPriceService } from '../services/SpecialPriceService';
import { MongoSpecialPriceRepository } from '../repositories/MongoSpecialPriceRepository';
import { MongoProductRepository } from '../repositories/MongoProductRepository';

/**
 * Special Price Routes
 * Defines API endpoints for special pricing operations
 */
export function createSpecialPriceRoutes(): Router {
  const router = Router();

  // Initialize dependencies
  const productRepository = new MongoProductRepository();
  const specialPriceRepository = new MongoSpecialPriceRepository();
  const specialPriceService = new SpecialPriceService(specialPriceRepository, productRepository);
  const specialPriceController = new SpecialPriceController(specialPriceService);

  // Route definitions
  router.get('/', specialPriceController.getAllSpecialPrices);
  router.get('/user/:userId', specialPriceController.getSpecialPricesForUser);
  router.get('/user/:userId/pricing', specialPriceController.getUserSpecialPricing);
  router.get('/user/:userId/products', specialPriceController.getProductsWithSpecialPricing);
  router.get('/user/:userId/product/:productId', specialPriceController.getSpecialPriceByUserAndProduct);
  router.get('/:id', specialPriceController.getSpecialPriceById);
  router.post('/', specialPriceController.createSpecialPrice);
  router.post('/cleanup', specialPriceController.deactivateExpiredSpecialPrices);
  router.put('/:id', specialPriceController.updateSpecialPrice);
  router.delete('/:id', specialPriceController.deleteSpecialPrice);

  return router;
} 