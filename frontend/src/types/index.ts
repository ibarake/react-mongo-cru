/**
 * Product interface representing items from the productos collection
 */
export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  brand?: string;
  sku?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Product with special pricing information
 */
export interface ProductWithSpecialPrice extends Product {
  specialPrice?: number;
  hasSpecialPrice: boolean;
}

/**
 * DTO for creating a new product
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  brand?: string;
  sku?: string;
  tags?: string[];
}

/**
 * DTO for updating an existing product
 */
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  brand?: string;
  sku?: string;
  tags?: string[];
}

/**
 * Special Price interface
 */
export interface SpecialPrice {
  _id?: string;
  userId: string;
  userName: string;
  email: string;
  productId: string;
  productName: string;
  specialPrice: number;
  discount: number;
  isActive: boolean;
  notes?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

/**
 * DTO for creating a new special price entry
 */
export interface CreateSpecialPriceDto {
  userId: string;
  userName: string;
  email: string;
  productId: string;
  productName: string;
  specialPrice: number;
  discount: number;
  notes?: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

/**
 * User interface representing users from the users collection
 */
export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string; // Optional for public data
  rol: string;
  createdDate: string;
  deleted: boolean;
  __v?: number;
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

/**
 * Loading state enum
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
}

/**
 * Form field error interface
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Pagination interface
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} 