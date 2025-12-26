import prisma from '../config/database';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  // Get single category
  getCategoryById: async (id: string) => {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  },

  // Create category
  createCategory: async (name: string, description?: string) => {
    // Check if category already exists
    const existing = await prisma.category.findUnique({
      where: { name }
    });

    if (existing) {
      throw new Error('Category with this name already exists');
    }

    return await prisma.category.create({
      data: { name, description }
    });
  },

  // Update category
  updateCategory: async (id: string, name?: string, description?: string) => {
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Check if new name already exists
    if (name && name !== category.name) {
      const duplicate = await prisma.category.findUnique({
        where: { name }
      });

      if (duplicate) {
        throw new Error('Category with this name already exists');
      }
    }

    return await prisma.category.update({
      where: { id },
      data: { name, description }
    });
  },

  // Delete category
  deleteCategory: async (id: string) => {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category._count.products > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    await prisma.category.delete({
      where: { id }
    });

    return { message: 'Category deleted successfully' };
  }
};