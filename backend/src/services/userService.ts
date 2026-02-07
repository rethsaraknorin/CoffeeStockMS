import prisma from '../config/database';
import { Prisma, Role } from '@prisma/client';

export const userService = {
  listUsers: async (role?: Role) => {
    const where: Prisma.UserWhereInput | undefined = role ? { role } : undefined;
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  },

  updateUserRole: async (userId: string, role: 'ADMIN' | 'STAFF') => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        ...(role === 'ADMIN' ? { status: 'ACTIVE' } : {})
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updated;
  },

  deleteUser: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return true;
  },

  listUsersByStatus: async (status: 'PENDING' | 'ACTIVE' | 'REJECTED', role?: Role) => {
    return prisma.user.findMany({
      where: {
        status,
        ...(role ? { role } : {})
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  updateUserStatus: async (
    userId: string,
    status: 'PENDING' | 'ACTIVE' | 'REJECTED',
    approvedBy?: string
  ) => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        approvedBy: status === 'ACTIVE' ? approvedBy || null : user.approvedBy,
        approvedAt: status === 'ACTIVE' ? new Date() : user.approvedAt,
        approvalToken: status === 'ACTIVE' ? null : user.approvalToken,
        approvalTokenExpires: status === 'ACTIVE' ? null : user.approvalTokenExpires
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updated;
  },

  countAdmins: async () => {
    return prisma.user.count({
      where: { role: 'ADMIN' }
    });
  }
};
