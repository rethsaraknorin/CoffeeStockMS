import { Request, Response } from 'express';
import { productService } from '../services/productService';

export const productController = {
  // Get all products
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId as string | undefined;

      const result = await productService.getAllProducts(page, limit, search, categoryId);

      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve products'
      });
    }
  },

  // Get single product
  getProductById: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const product = await productService.getProductById(idParam);

      res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Product not found'
      });
    }
  },

  // Create product
  createProduct: async (req: Request, res: Response) => {
    try {
      const productData = req.body;
      const product = await productService.createProduct(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create product'
      });
    }
  },

  // Update product
  updateProduct: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const productData = req.body;

      const product = await productService.updateProduct(idParam, productData);

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update product'
      });
    }
  },

  // Delete product
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const result = await productService.deleteProduct(idParam);

      res.status(200).json({
        success: true,
        message: result.message,
        data: null
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to delete product'
      });
    }
  },

  // Get low stock products
  getLowStockProducts: async (req: Request, res: Response) => {
    try {
      const products = await productService.getLowStockProducts();

      res.status(200).json({
        success: true,
        message: 'Low stock products retrieved successfully',
        data: products
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve low stock products'
      });
    }
  }
};
