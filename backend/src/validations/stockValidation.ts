import { Request, Response, NextFunction } from 'express';

export const validateStockMovement = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required'
    });
  }

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({
      success: false,
      message: 'Quantity is required'
    });
  }

  if (typeof quantity !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a number'
    });
  }

  if (quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be greater than 0'
    });
  }

  next();
};

export const validateStockAdjustment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required'
    });
  }

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({
      success: false,
      message: 'Quantity is required'
    });
  }

  if (typeof quantity !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a number'
    });
  }

  // Adjustment can be positive or negative
  if (quantity === 0) {
    return res.status(400).json({
      success: false,
      message: 'Adjustment quantity cannot be 0'
    });
  }

  next();
};