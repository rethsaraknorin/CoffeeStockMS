import prisma from '../config/database';

interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  supplierId?: string;
  unitPrice: number;
  currentStock?: number;
  reorderLevel?: number;
  unit?: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  sku?: string;
  categoryId?: string;
  supplierId?: string;
  unitPrice?: number;
  currentStock?: number;
  reorderLevel?: number;
  unit?: string;
}

export const productService = {
  // Get all products with pagination and search
  getAllProducts: async (page: number = 1, limit: number = 10, search?: string) => {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { sku: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          supplier: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Get single product by ID
  getProductById: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  },

  // Create new product
  createProduct: async (data: CreateProductData) => {
    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku }
    });

    if (existingProduct) {
      throw new Error('Product with this SKU already exists');
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Check if supplier exists (if provided)
    if (data.supplierId) {
      const supplier = await prisma.supplier.findUnique({
        where: { id: data.supplierId }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        categoryId: data.categoryId,
        supplierId: data.supplierId,
        unitPrice: data.unitPrice,
        currentStock: data.currentStock || 0,
        reorderLevel: data.reorderLevel || 10,
        unit: data.unit || 'pcs'
      },
      include: {
        category: true,
        supplier: true
      }
    });

    return product;
  },

  // Update product
  updateProduct: async (id: string, data: UpdateProductData) => {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Check if SKU is being changed and if new SKU already exists
    if (data.sku && data.sku !== existingProduct.sku) {
      const duplicateSKU = await prisma.product.findUnique({
        where: { sku: data.sku }
      });

      if (duplicateSKU) {
        throw new Error('Product with this SKU already exists');
      }
    }

    // Check if category exists (if being updated)
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });

      if (!category) {
        throw new Error('Category not found');
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        supplier: true
      }
    });

    return product;
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: { id }
    });

    return { message: 'Product deleted successfully' };
  },

  // Get low stock products
  getLowStockProducts: async () => {
    const products = await prisma.product.findMany({
      where: {
        currentStock: {
          lte: prisma.product.fields.reorderLevel
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: { currentStock: 'asc' }
    });

    return products;
  }
};