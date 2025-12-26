import { Request, Response } from 'express';
import { reportService } from '../services/reportService';

export const reportController = {
  // Dashboard Overview
  getDashboardOverview: async (req: Request, res: Response) => {
    try {
      const report = await reportService.getDashboardOverview();

      res.status(200).json({
        success: true,
        message: 'Dashboard overview retrieved successfully',
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve dashboard overview'
      });
    }
  },

  // Stock Movement Report
  getStockMovementReport: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide startDate and endDate (YYYY-MM-DD)'
        });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);

      const report = await reportService.getStockMovementReport(start, end);

      res.status(200).json({
        success: true,
        message: 'Stock movement report retrieved successfully',
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve stock movement report'
      });
    }
  },

  // Inventory Value Report
  getInventoryValueReport: async (req: Request, res: Response) => {
    try {
      const report = await reportService.getInventoryValueReport();

      res.status(200).json({
        success: true,
        message: 'Inventory value report retrieved successfully',
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve inventory value report'
      });
    }
  },

  // Low Stock Report
  getLowStockReport: async (req: Request, res: Response) => {
    try {
      const report = await reportService.getLowStockReport();

      res.status(200).json({
        success: true,
        message: 'Low stock report retrieved successfully',
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve low stock report'
      });
    }
  },

  // Category Performance Report
  getCategoryReport: async (req: Request, res: Response) => {
    try {
      const report = await reportService.getCategoryReport();

      res.status(200).json({
        success: true,
        message: 'Category report retrieved successfully',
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve category report'
      });
    }
  },

  // Activity Log
  getActivityLog: async (req: Request, res: Response) => {
    try {
      const days = parseInt(req.query.days as string) || 7;

      const report = await reportService.getActivityLog(days);

      res.status(200).json({
        success: true,
        message: 'Activity log retrieved successfully',
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve activity log'
      });
    }
  }
};