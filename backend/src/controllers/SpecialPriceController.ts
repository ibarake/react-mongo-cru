import { Request, Response } from 'express';
import { SpecialPriceService } from '../services/SpecialPriceService';

/**
 * Special Price Controller
 * Handles HTTP requests and responses for special pricing operations
 */
export class SpecialPriceController {
  constructor(private specialPriceService: SpecialPriceService) {}

  /**
   * GET /api/special-prices
   * Retrieves all special price entries
   */
  getAllSpecialPrices = async (req: Request, res: Response): Promise<void> => {
    try {
      const specialPrices = await this.specialPriceService.getAllSpecialPrices();
      res.status(200).json({
        success: true,
        data: specialPrices,
        message: 'Special prices retrieved successfully'
      });
    } catch (error) {
      console.error('Controller error getting all special prices:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve special prices'
      });
    }
  };

  /**
   * GET /api/special-prices/:id
   * Retrieves a special price by ID
   */
  getSpecialPriceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const specialPrice = await this.specialPriceService.getSpecialPriceById(id);
      
      if (!specialPrice) {
        res.status(404).json({
          success: false,
          error: 'Special price not found',
          message: `Special price with ID ${id} does not exist`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: specialPrice,
        message: 'Special price retrieved successfully'
      });
    } catch (error) {
      console.error('Controller error getting special price by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve special price'
      });
    }
  };

  /**
   * POST /api/special-prices
   * Creates a new special price entry
   */
  createSpecialPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const specialPriceData = req.body;
      
      const newSpecialPrice = await this.specialPriceService.createSpecialPrice(specialPriceData);
      
      res.status(201).json({
        success: true,
        data: newSpecialPrice,
        message: 'Special price created successfully'
      });
    } catch (error) {
      console.error('Controller error creating special price:', error);
      
      if (error instanceof Error) {
        // Handle validation errors
        if (error.message.includes('Validation errors') || 
            error.message.includes('already exists') ||
            error.message.includes('not found') ||
            error.message.includes('required') ||
            error.message.includes('must be')) {
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
        message: 'Failed to create special price'
      });
    }
  };

  /**
   * PUT /api/special-prices/:id
   * Updates an existing special price entry
   */
  updateSpecialPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const specialPriceData = req.body;
      
      const updatedSpecialPrice = await this.specialPriceService.updateSpecialPrice(id, specialPriceData);
      
      if (!updatedSpecialPrice) {
        res.status(404).json({
          success: false,
          error: 'Special price not found',
          message: `Special price with ID ${id} does not exist`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedSpecialPrice,
        message: 'Special price updated successfully'
      });
    } catch (error) {
      console.error('Controller error updating special price:', error);
      
      if (error instanceof Error) {
        // Handle validation errors
        if (error.message.includes('Validation errors') || 
            error.message.includes('required') ||
            error.message.includes('not found') ||
            error.message.includes('must be')) {
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
        message: 'Failed to update special price'
      });
    }
  };

  /**
   * DELETE /api/special-prices/:id
   * Deletes a special price entry
   */
  deleteSpecialPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.specialPriceService.deleteSpecialPrice(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Special price not found',
          message: `Special price with ID ${id} does not exist`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Special price deleted successfully'
      });
    } catch (error) {
      console.error('Controller error deleting special price:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Special price not found',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete special price'
      });
    }
  };

  /**
   * GET /api/special-prices/user/:userId/product/:productId
   * Gets special price for a specific user and product combination
   */
  getSpecialPriceByUserAndProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, productId } = req.params;
      const specialPrice = await this.specialPriceService.getSpecialPriceByUserAndProduct(userId, productId);
      
      if (!specialPrice) {
        res.status(404).json({
          success: false,
          error: 'Special price not found',
          message: `No special price found for user ${userId} and product ${productId}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: specialPrice,
        message: 'Special price retrieved successfully'
      });
    } catch (error) {
      console.error('Controller error getting special price by user and product:', error);
      
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
        message: 'Failed to get special price'
      });
    }
  };

  /**
   * GET /api/special-prices/user/:userId
   * Gets all special prices for a specific user
   */
  getSpecialPricesForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const specialPrices = await this.specialPriceService.getSpecialPricesForUser(userId);
      
      res.status(200).json({
        success: true,
        data: specialPrices,
        message: `Found ${specialPrices.length} special prices for user ${userId}`
      });
    } catch (error) {
      console.error('Controller error getting special prices for user:', error);
      
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
        message: 'Failed to get special prices for user'
      });
    }
  };

  /**
   * GET /api/special-prices/user/:userId/pricing
   * Gets comprehensive special pricing information for a user
   */
  getUserSpecialPricing = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const userSpecialPricing = await this.specialPriceService.getUserSpecialPricing(userId);
      
      res.status(200).json({
        success: true,
        data: userSpecialPricing,
        message: `Special pricing information retrieved for user ${userId}`
      });
    } catch (error) {
      console.error('Controller error getting user special pricing:', error);
      
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
        message: 'Failed to get user special pricing'
      });
    }
  };

  /**
   * GET /api/special-prices/user/:userId/products
   * Gets products with special pricing applied for a specific user
   */
  getProductsWithSpecialPricing = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const productsWithSpecialPricing = await this.specialPriceService.getProductsWithSpecialPricing(userId);
      
      res.status(200).json({
        success: true,
        data: productsWithSpecialPricing,
        message: `Products with special pricing retrieved for user ${userId}`
      });
    } catch (error) {
      console.error('Controller error getting products with special pricing:', error);
      
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
        message: 'Failed to get products with special pricing'
      });
    }
  };

  /**
   * POST /api/special-prices/cleanup
   * Deactivates expired special prices
   */
  deactivateExpiredSpecialPrices = async (req: Request, res: Response): Promise<void> => {
    try {
      const deactivatedCount = await this.specialPriceService.deactivateExpiredSpecialPrices();
      
      res.status(200).json({
        success: true,
        data: { deactivatedCount },
        message: `Deactivated ${deactivatedCount} expired special prices`
      });
    } catch (error) {
      console.error('Controller error deactivating expired special prices:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to deactivate expired special prices'
      });
    }
  };
} 