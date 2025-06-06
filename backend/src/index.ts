import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import DatabaseConnection from './config/database';
import { createProductRoutes } from './routes/productRoutes';
import { createSpecialPriceRoutes } from './routes/specialPriceRoutes';
import { createUserRoutes } from './routes/userRoutes';

/**
 * Express Application Setup
 * Main entry point for the backend API
 */
class App {
  private app: express.Application;
  private initialized: boolean = false;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeErrorHandling();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Logging middleware
    this.app.use(morgan('combined'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: express.Request, res: express.Response) => {
      res.status(200).json({
        success: true,
        message: 'API is running successfully',
        timestamp: new Date().toISOString()
      });
    });

    // API routes - created after database connection
    this.app.use('/api/products', createProductRoutes());
    this.app.use('/api/special-prices', createSpecialPriceRoutes());
    this.app.use('/api/users', createUserRoutes());

    // 404 handler
    this.app.use('*', (req: express.Request, res: express.Response) => {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });
  }

  /**
   * Initialize the app for serverless environment
   */
  public async initialize(): Promise<express.Application> {
    if (!this.initialized) {
      try {
        // Connect to MongoDB
        await DatabaseConnection.getInstance().connect();
        
        // Initialize routes
        this.initializeRoutes();
        
        this.initialized = true;
        console.log('✅ App initialized for serverless deployment');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        throw error;
      }
    }
    
    return this.app;
  }

  /**
   * Get the Express app instance
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * Start the server (for local development)
   */
  public async start(): Promise<void> {
    const port = parseInt(process.env.PORT || '3001', 10);
    
    try {
      await this.initialize();
      
      // Start the server
      this.app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
        console.log(`📱 API Base URL: http://localhost:${port}`);
        console.log(`🏥 Health Check: http://localhost:${port}/health`);
        console.log(`📦 Products API: http://localhost:${port}/api/products`);
        console.log(`💰 Special Prices API: http://localhost:${port}/api/special-prices`);
        console.log(`👥 Users API: http://localhost:${port}/api/users`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    try {
      await DatabaseConnection.getInstance().disconnect();
      console.log('✅ Server shutdown complete');
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}

// Create app instance
const appInstance = new App();

// For Vercel serverless deployment
let cachedApp: express.Application;

const handler = async (req: express.Request, res: express.Response) => {
  if (!cachedApp) {
    cachedApp = await appInstance.initialize();
  }
  return cachedApp(req, res);
};

// Handle process termination (for local development)
process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await appInstance.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received');
  await appInstance.shutdown();
  process.exit(0);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  appInstance.start().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
  });
}

// Export for Vercel
export default handler;
module.exports = handler; 