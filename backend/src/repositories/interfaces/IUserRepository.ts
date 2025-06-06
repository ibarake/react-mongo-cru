import { User, CreateUserDto, UpdateUserDto, PublicUser } from '../../models/User';

/**
 * User Repository Interface
 * Defines the contract for user data access operations
 */
export interface IUserRepository {
  /**
   * Retrieves all active users (not deleted)
   */
  findAll(): Promise<User[]>;

  /**
   * Retrieves all active users with public data only (without password)
   */
  findAllPublic(): Promise<PublicUser[]>;

  /**
   * Finds a user by their ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Creates a new user
   */
  create(userData: CreateUserDto): Promise<User>;

  /**
   * Updates an existing user
   */
  update(id: string, userData: UpdateUserDto): Promise<User | null>;

  /**
   * Soft deletes a user (marks as deleted)
   */
  delete(id: string): Promise<boolean>;

  /**
   * Finds users by role
   */
  findByRole(role: string): Promise<User[]>;

  /**
   * Searches users by name or email
   */
  search(query: string): Promise<User[]>;
} 