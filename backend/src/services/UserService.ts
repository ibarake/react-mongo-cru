import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { MongoUserRepository } from '../repositories/MongoUserRepository';
import { User, CreateUserDto, UpdateUserDto, PublicUser } from '../models/User';

/**
 * User Service
 * Handles business logic and validation for user operations
 */
export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new MongoUserRepository();
  }

  /**
   * Retrieves all active users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw new Error('Failed to retrieve users');
    }
  }

  /**
   * Retrieves all active users with public data only
   */
  async getAllPublicUsers(): Promise<PublicUser[]> {
    try {
      return await this.userRepository.findAllPublic();
    } catch (error) {
      console.error('Error in getAllPublicUsers:', error);
      throw new Error('Failed to retrieve public users');
    }
  }

  /**
   * Retrieves a user by their ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid user ID is required');
      }

      return await this.userRepository.findById(id);
    } catch (error) {
      console.error(`Error in getUserById for ID ${id}:`, error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Retrieves a user by their email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error('Valid email is required');
      }

      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error(`Error in getUserByEmail for email ${email}:`, error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Creates a new user
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      // Validate user data
      this.validateUserData(userData);

      // Check for duplicate email
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('A user with this email already exists');
      }

      return await this.userRepository.create(userData);
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error instanceof Error ? error : new Error('Failed to create user');
    }
  }

  /**
   * Updates an existing user
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid user ID is required');
      }

      // Validate update data
      this.validateUpdateData(userData);

      // Check for duplicate email if email is being updated
      if (userData.email) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser && existingUser._id?.toHexString() !== id) {
          throw new Error('A user with this email already exists');
        }
      }

      return await this.userRepository.update(id, userData);
    } catch (error) {
      console.error(`Error in updateUser for ID ${id}:`, error);
      throw error instanceof Error ? error : new Error('Failed to update user');
    }
  }

  /**
   * Soft deletes a user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid user ID is required');
      }

      return await this.userRepository.delete(id);
    } catch (error) {
      console.error(`Error in deleteUser for ID ${id}:`, error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Retrieves users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      if (!role || typeof role !== 'string') {
        throw new Error('Valid role is required');
      }

      return await this.userRepository.findByRole(role);
    } catch (error) {
      console.error(`Error in getUsersByRole for role ${role}:`, error);
      throw new Error('Failed to find users by role');
    }
  }

  /**
   * Searches users by name or email
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Valid search query is required');
      }

      return await this.userRepository.search(query);
    } catch (error) {
      console.error(`Error in searchUsers for query ${query}:`, error);
      throw new Error('Failed to search users');
    }
  }

  /**
   * Validates user data for creation
   */
  private validateUserData(userData: CreateUserDto): void {
    const errors: string[] = [];

    if (!userData.name || userData.name.trim() === '') {
      errors.push('User name is required');
    }

    if (!userData.email || userData.email.trim() === '') {
      errors.push('User email is required');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }

    if (!userData.password || userData.password.trim() === '') {
      errors.push('User password is required');
    }

    if (!userData.rol || userData.rol.trim() === '') {
      errors.push('User role is required');
    }

    if (!userData.createdDate || userData.createdDate.trim() === '') {
      errors.push('Created date is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }

  /**
   * Validates user data for updates
   */
  private validateUpdateData(userData: UpdateUserDto): void {
    const errors: string[] = [];

    if (userData.name !== undefined && (!userData.name || userData.name.trim() === '')) {
      errors.push('User name cannot be empty');
    }

    if (userData.email !== undefined && (!userData.email || userData.email.trim() === '')) {
      errors.push('User email cannot be empty');
    } else if (userData.email && !this.isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }

    if (userData.password !== undefined && (!userData.password || userData.password.trim() === '')) {
      errors.push('User password cannot be empty');
    }

    if (userData.rol !== undefined && (!userData.rol || userData.rol.trim() === '')) {
      errors.push('User role cannot be empty');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }

  /**
   * Validates email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 