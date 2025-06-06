import { Collection, ObjectId } from 'mongodb';
import { IUserRepository } from './interfaces/IUserRepository';
import { User, CreateUserDto, UpdateUserDto, PublicUser } from '../models/User';
import DatabaseConnection from '../config/database';

/**
 * MongoDB implementation of the User Repository
 * Handles all user-related database operations
 */
export class MongoUserRepository implements IUserRepository {
  private collection: Collection<User>;
  private readonly collectionName = 'users';

  constructor() {
    const db = DatabaseConnection.getInstance().getDb();
    this.collection = db.collection<User>(this.collectionName);
  }

  /**
   * Retrieves all active users from the collection
   */
  async findAll(): Promise<User[]> {
    try {
      const users = await this.collection.find({ deleted: { $ne: true } }).toArray();
      return users;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error('Failed to retrieve users');
    }
  }

  /**
   * Retrieves all active users with public data only (without password)
   */
  async findAllPublic(): Promise<PublicUser[]> {
    try {
      const users = await this.collection
        .find({ deleted: { $ne: true } }, { projection: { password: 0 } })
        .toArray();
      
      return users.map(user => ({
        _id: user._id?.toHexString(),
        name: user.name,
        email: user.email,
        rol: user.rol,
        createdDate: user.createdDate,
        deleted: user.deleted
      }));
    } catch (error) {
      console.error('Error finding all public users:', error);
      throw new Error('Failed to retrieve users');
    }
  }

  /**
   * Finds a user by their ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }
      
      const user = await this.collection.findOne({ 
        _id: new ObjectId(id),
        deleted: { $ne: true }
      });
      return user;
    } catch (error) {
      console.error(`Error finding user by ID ${id}:`, error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Finds a user by their email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.collection.findOne({ 
        email: email,
        deleted: { $ne: true }
      });
      return user;
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Creates a new user
   */
  async create(userData: CreateUserDto): Promise<User> {
    try {
      const newUser: User = {
        ...userData,
        deleted: false
      };

      const result = await this.collection.insertOne(newUser);
      const createdUser = await this.findById(result.insertedId.toHexString());
      
      if (!createdUser) {
        throw new Error('Failed to retrieve created user');
      }
      
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Updates an existing user
   */
  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id), deleted: { $ne: true } },
        { $set: userData },
        { returnDocument: 'after' }
      );

      return result || null;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Soft deletes a user by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      if (!ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { deleted: true } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Finds users by role
   */
  async findByRole(role: string): Promise<User[]> {
    try {
      const users = await this.collection.find({ 
        rol: role,
        deleted: { $ne: true }
      }).toArray();
      return users;
    } catch (error) {
      console.error(`Error finding users by role ${role}:`, error);
      throw new Error('Failed to find users by role');
    }
  }

  /**
   * Searches users by name or email
   */
  async search(query: string): Promise<User[]> {
    try {
      const searchRegex = new RegExp(query, 'i');
      const users = await this.collection.find({
        $and: [
          { deleted: { $ne: true } },
          {
            $or: [
              { name: searchRegex },
              { email: searchRegex }
            ]
          }
        ]
      }).toArray();
      
      return users;
    } catch (error) {
      console.error(`Error searching users with query ${query}:`, error);
      throw new Error('Failed to search users');
    }
  }
} 