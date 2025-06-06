import { ObjectId } from 'mongodb';

/**
 * Product interface representing items in the productos collection
 */
export interface Product {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  brand?: string;
  sku?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
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