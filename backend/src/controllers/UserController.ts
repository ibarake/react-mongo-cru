import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto } from '../models/User';

/**
 * User Controller
 * Handles HTTP requests for user operations
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/users
   * Retrieves all active users
   */
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({
        success: true,
        data: users,
        message: 'Users retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  /**
   * GET /api/users/public
   * Retrieves all active users with public data only
   */
  getAllPublicUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllPublicUsers();
      res.json({
        success: true,
        data: users,
        message: 'Public users retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getAllPublicUsers:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  /**
   * GET /api/users/:id
   * Retrieves a user by ID
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  /**
   * GET /api/users/email/:email
   * Retrieves a user by email
   */
  getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;
      const user = await this.userService.getUserByEmail(decodeURIComponent(email));
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  /**
   * POST /api/users
   * Creates a new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  };

  /**
   * PUT /api/users/:id
   * Updates an existing user
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;
      
      const updatedUser = await this.userService.updateUser(id, userData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Error in updateUser:', error);
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  };

  /**
   * DELETE /api/users/:id
   * Soft deletes a user
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  /**
   * GET /api/users/role/:role
   * Retrieves users by role
   */
  getUsersByRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { role } = req.params;
      const users = await this.userService.getUsersByRole(role);
      
      res.json({
        success: true,
        data: users,
        message: `Users with role '${role}' retrieved successfully`
      });
    } catch (error) {
      console.error('Error in getUsersByRole:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };

  /**
   * GET /api/users/search/:query
   * Searches users by name or email
   */
  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.params;
      const users = await this.userService.searchUsers(decodeURIComponent(query));
      
      res.json({
        success: true,
        data: users,
        message: 'Users search completed successfully'
      });
    } catch (error) {
      console.error('Error in searchUsers:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  };
} 