import prisma from '../config/database';

interface SupplierData {
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const supplierService = {
  getAllSuppliers: async () => {
    return await prisma.supplier.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  getSupplierById: async (id: string) => {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
        _count: {
          select: { products: true }
        }
      }
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    return supplier;
  },

  createSupplier: async (data: SupplierData) => {
    return await prisma.supplier.create({
      data
    });
  },

  updateSupplier: async (id: string, data: SupplierData) => {
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    return await prisma.supplier.update({
      where: { id },
      data
    });
  },

  deleteSupplier: async (id: string) => {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    if (supplier._count.products > 0) {
      throw new Error('Cannot delete supplier with existing products');
    }

    await prisma.supplier.delete({
      where: { id }
    });

    return { message: 'Supplier deleted successfully' };
  }
};