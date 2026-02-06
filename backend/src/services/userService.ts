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
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
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

  countAdmins: async () => {
    return prisma.user.count({
      where: { role: 'ADMIN' }
    });
  }
};
