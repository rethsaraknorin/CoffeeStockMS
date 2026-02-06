import { Request, Response } from 'express';
import { stockService } from '../services/stockService';

export const stockController = {
  // Add stock (IN)
  addStock: async (req: Request, res: Response) => {
    try {
      const { productId, quantity, notes } = req.body;
      const createdBy = req.user?.username || 'Unknown';

      const movement = await stockService.addStock({
        productId,
        type: 'IN',
        quantity,
        notes,
        createdBy
      });

      res.status(201).json({
        success: true,
        message: 'Stock added successfully',
        data: movement
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to add stock'
      });
    }
  },

  // Remove stock (OUT)
  removeStock: async (req: Request, res: Response) => {
    try {
      const { productId, quantity, notes } = req.body;
      const createdBy = req.user?.username || 'Unknown';

      const movement = await stockService.removeStock({
        productId,
        type: 'OUT',
        quantity,
        notes,
        createdBy
      });

      res.status(201).json({
        success: true,
        message: 'Stock removed successfully',
        data: movement
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to remove stock'
      });
    }
  },

  // Adjust stock (manual correction)
  adjustStock: async (req: Request, res: Response) => {
    try {
      const { productId, quantity, notes } = req.body;
      const createdBy = req.user?.username || 'Unknown';

      const movement = await stockService.adjustStock({
        productId,
        type: 'ADJUSTMENT',
        quantity,
        notes,
        createdBy
      });

      res.status(201).json({
        success: true,
        message: 'Stock adjusted successfully',
        data: movement
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to adjust stock'
      });
    }
  },

  // Get product stock history
  getProductStockHistory: async (req: Request, res: Response) => {
    try {
      const productIdParam = Array.isArray(req.params.productId)
        ? req.params.productId[0]
        : req.params.productId;
      if (!productIdParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing productId'
        });
      }
      const limit = parseInt(req.query.limit as string) || 50;

      const movements = await stockService.getProductStockHistory(productIdParam, limit);

      res.status(200).json({
        success: true,
        message: 'Stock history retrieved successfully',
        data: movements
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to retrieve stock history'
      });
    }
  },

  // Get all stock movements
  getAllStockMovements: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;

      const result = await stockService.getAllStockMovements(page, limit, startDate, endDate);

      res.status(200).json({
        success: true,
        message: 'Stock movements retrieved successfully',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve stock movements'
      });
    }
  },

  // Get stock summary
  getStockSummary: async (req: Request, res: Response) => {
    try {
      const summary = await stockService.getStockSummary();

      res.status(200).json({
        success: true,
        message: 'Stock summary retrieved successfully',
        data: summary
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve stock summary'
      });
    }
  },

  // Reorder all low-stock products
  reorderAll: async (req: Request, res: Response) => {
    try {
      const createdBy = req.user?.username || 'Unknown';
      const result = await stockService.reorderAllLowStock(createdBy);

      res.status(200).json({
        success: true,
        message: 'Reorder processed successfully',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to reorder stock'
      });
    }
  }
};
