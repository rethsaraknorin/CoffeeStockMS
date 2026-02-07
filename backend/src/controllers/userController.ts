import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { Role } from '@prisma/client';

const isValidRole = (role?: string): role is Role => role === 'ADMIN' || role === 'STAFF';

export const userController = {
  listPendingUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.listUsersByStatus('PENDING', 'STAFF');

      res.status(200).json({
        success: true,
        message: 'Pending users retrieved successfully',
        data: users
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve pending users'
      });
    }
  },
  listUsers: async (req: Request, res: Response) => {
    try {
      const role = req.query.role as string | undefined;
      if (role && !isValidRole(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role filter'
        });
      }

      const users = await userService.listUsers(role as Role | undefined);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve users'
      });
    }
  },

  updateRole: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }
      const { role } = req.body as { role?: string };

      if (!isValidRole(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
      }

      if (req.user?.id === idParam) {
        return res.status(400).json({
          success: false,
          message: 'You cannot change your own role'
        });
      }

      if (role === 'STAFF') {
        const adminCount = await userService.countAdmins();
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'At least one admin must remain'
          });
        }
      }

      const updated = await userService.updateUserRole(idParam, role as Role);

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: updated
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update user role'
      });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!idParam) {
        return res.status(400).json({
          success: false,
          message: 'Missing id'
        });
      }

      if (req.user?.id === idParam) {
        return res.status(400).json({
          success: false,
          message: 'You cannot delete your own account'
        });
      }

      const adminCount = await userService.countAdmins();
      const users = await userService.listUsers('ADMIN');
      const isAdminTarget = users.some((u) => u.id === idParam);
      if (isAdminTarget && adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'At least one admin must remain'
        });
      }

      await userService.deleteUser(idParam);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }
  ,
  approveUser: async (req: Request, res: Response) => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      const approvedBy = req.user?.id;
      const updated = await userService.updateUserStatus(id, 'ACTIVE', approvedBy);

      res.status(200).json({
        success: true,
        message: 'User approved successfully',
        data: updated
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to approve user'
      });
    }
  },

  rejectUser: async (req: Request, res: Response) => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      const updated = await userService.updateUserStatus(id, 'REJECTED');

      res.status(200).json({
        success: true,
        message: 'User rejected successfully',
        data: updated
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reject user'
      });
    }
  }
};
