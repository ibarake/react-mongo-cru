import { ObjectId } from 'mongodb';

/**
 * User interface representing items in the users collection
 */
export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  rol: string;
  createdDate: string;
  deleted: boolean;
  __v?: number;
}

/**
 * DTO for creating a new user
 */
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  rol: string;
  createdDate: string;
  deleted?: boolean;
}

/**
 * DTO for updating an existing user
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  rol?: string;
  createdDate?: string;
  deleted?: boolean;
}

/**
 * Public user data (without sensitive information)
 */
export interface PublicUser {
  _id?: string;
  name: string;
  email: string;
  rol: string;
  createdDate: string;
  deleted: boolean;
} 