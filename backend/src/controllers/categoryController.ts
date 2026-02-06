import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService';

export const categoryController = {
  getAllCategories: async (req: Request, res: Response) => {
    try {
      const categories = await categoryService.getAllCategories();

      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve categories'
      });
    }
  },

  getCategoryById: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const category = await categoryService.getCategoryById(idParam);

      res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Category not found'
      });
    }
  },

  createCategory: async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const category = await categoryService.createCategory(name, description);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create category'
      });
    }
  },

  updateCategory: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const { name, description } = req.body;
      const category = await categoryService.updateCategory(idParam, name, description);

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update category'
      });
    }
  },

  deleteCategory: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const result = await categoryService.deleteCategory(idParam);

      res.status(200).json({
        success: true,
        message: result.message,
        data: null
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete category'
      });
    }
  }
};
