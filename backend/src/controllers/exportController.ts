import { Request, Response } from 'express';
import { exportService } from '../services/exportService';

export const exportController = {
  exportInventoryExcel: async (req: Request, res: Response) => {
    try {
      await exportService.exportInventoryToExcel(res);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export inventory'
      });
    }
  },

  exportLowStockExcel: async (req: Request, res: Response) => {
    try {
      await exportService.exportLowStockToExcel(res);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export low stock report'
      });
    }
  },

  exportStockMovementsExcel: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide startDate and endDate'
        });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);

      await exportService.exportStockMovementsToExcel(res, start, end);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export stock movements'
      });
    }
  },

  exportInventoryPDF: async (req: Request, res: Response) => {
    try {
      await exportService.exportInventoryToPDF(res);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to export PDF'
      });
    }
  }
};