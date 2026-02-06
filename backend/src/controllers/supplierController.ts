import { Request, Response } from 'express';
import { supplierService } from '../services/supplierService';

export const supplierController = {
  getAllSuppliers: async (req: Request, res: Response) => {
    try {
      const suppliers = await supplierService.getAllSuppliers();

      res.status(200).json({
        success: true,
        message: 'Suppliers retrieved successfully',
        data: suppliers
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve suppliers'
      });
    }
  },

  getSupplierById: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const supplier = await supplierService.getSupplierById(idParam);

      res.status(200).json({
        success: true,
        message: 'Supplier retrieved successfully',
        data: supplier
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Supplier not found'
      });
    }
  },

  createSupplier: async (req: Request, res: Response) => {
    try {
      const supplierData = req.body;
      const supplier = await supplierService.createSupplier(supplierData);

      res.status(201).json({
        success: true,
        message: 'Supplier created successfully',
        data: supplier
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create supplier'
      });
    }
  },

  updateSupplier: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const supplierData = req.body;
      const supplier = await supplierService.updateSupplier(idParam, supplierData);

      res.status(200).json({
        success: true,
        message: 'Supplier updated successfully',
        data: supplier
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update supplier'
      });
    }
  },

  deleteSupplier: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const result = await supplierService.deleteSupplier(idParam);

      res.status(200).json({
        success: true,
        message: result.message,
        data: null
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete supplier'
      });
    }
  }
};
