import { MongoClient, Db } from 'mongodb';

/**
 * Database connection configuration
 * Manages MongoDB connection using the provided cluster URL
 */
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: MongoClient;
  private db: Db | null = null;
  
  // MongoDB connection configuration from environment variables
  private readonly connectionString = process.env.MONGODB_URI || 'mongodb+srv://drenviochallenge:m1jWly3uw42cBwp6@drenviochallenge.2efc0.mongodb.net/';
  private readonly databaseName = process.env.MONGODB_DATABASE || 'tienda';

  private constructor() {
    this.client = new MongoClient(this.connectionString);
  }

  /**
   * Singleton pattern implementation for database connection
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Establishes connection to MongoDB
   */
  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
      console.log(`✅ Successfully connected to MongoDB database: ${this.databaseName}`);
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Returns the database instance
   */
  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Closes the database connection
   */
  public async disconnect(): Promise<void> {
    try {
      await this.client.close();
      console.log('✅ Database connection closed');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      throw error;
    }
  }
}

export default DatabaseConnection; 