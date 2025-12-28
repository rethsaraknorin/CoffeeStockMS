import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';

export const notificationController = {
  sendLowStockAlert: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email address is required'
        });
      }

      const result = await notificationService.sendLowStockAlert(email);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send low stock alert'
      });
    }
  },

  sendDailySummary: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email address is required'
        });
      }

      const result = await notificationService.sendDailySummary(email);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send daily summary'
      });
    }
  }
};
