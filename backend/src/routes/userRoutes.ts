import { Router } from 'express';
import { UserController } from '../controllers/UserController';

/**
 * User Routes Factory
 * Creates and configures user-related routes
 */
export function createUserRoutes(): Router {
  const router = Router();
  const userController = new UserController();

  // GET /api/users - Get all users
  router.get('/', userController.getAllUsers);

  // GET /api/users/public - Get all users (public data only)
  router.get('/public', userController.getAllPublicUsers);

  // GET /api/users/role/:role - Get users by role
  router.get('/role/:role', userController.getUsersByRole);

  // GET /api/users/search/:query - Search users
  router.get('/search/:query', userController.searchUsers);

  // GET /api/users/email/:email - Get user by email
  router.get('/email/:email', userController.getUserByEmail);

  // GET /api/users/:id - Get user by ID
  router.get('/:id', userController.getUserById);

  // POST /api/users - Create new user
  router.post('/', userController.createUser);

  // PUT /api/users/:id - Update user
  router.put('/:id', userController.updateUser);

  // DELETE /api/users/:id - Delete user (soft delete)
  router.delete('/:id', userController.deleteUser);

  return router;
} 