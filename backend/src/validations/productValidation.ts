import { Request, Response, NextFunction } from 'express';

export const validateCreateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, sku, categoryId, unitPrice } = req.body;

  // Check required fields
  if (!name || !sku || !categoryId || unitPrice === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, SKU, categoryId, and unitPrice'
    });
  }

  // Validate unitPrice
  if (typeof unitPrice !== 'number' || unitPrice < 0) {
    return res.status(400).json({
      success: false,
      message: 'Unit price must be a positive number'
    });
  }

  // Validate name length
  if (name.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Product name must be at least 2 characters long'
    });
  }

  // Validate SKU length
  if (sku.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'SKU must be at least 2 characters long'
    });
  }

  next();
};

export const validateUpdateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { unitPrice, currentStock, reorderLevel } = req.body;

  // Validate unitPrice if provided
  if (unitPrice !== undefined && (typeof unitPrice !== 'number' || unitPrice < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Unit price must be a positive number'
    });
  }

  // Validate currentStock if provided
  if (currentStock !== undefined && (typeof currentStock !== 'number' || currentStock < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Current stock must be a positive number'
    });
  }

  // Validate reorderLevel if provided
  if (reorderLevel !== undefined && (typeof reorderLevel !== 'number' || reorderLevel < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Reorder level must be a positive number'
    });
  }

  next();
};