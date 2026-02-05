import prisma from '../config/database';

interface StockMovementData {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  notes?: string;
  createdBy: string;
}

export const stockService = {
  // Add stock (IN movement)
  addStock: async (data: StockMovementData) => {
    const { productId, quantity, notes, createdBy } = data;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Create stock movement and update product stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create stock movement record
      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type: 'IN',
          quantity,
          notes,
          createdBy
        },
        include: {
          product: {
            include: {
              category: true,
              supplier: true
            }
          }
        }
      });

      // Update product current stock
      await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: {
            increment: quantity
          }
        }
      });

      return movement;
    });

    return result;
  },

  // Remove stock (OUT movement)
  removeStock: async (data: StockMovementData) => {
    const { productId, quantity, notes, createdBy } = data;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Check if enough stock available
    if (product.currentStock < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.currentStock}, Requested: ${quantity}`);
    }

    // Create stock movement and update product stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type: 'OUT',
          quantity,
          notes,
          createdBy
        },
        include: {
          product: {
            include: {
              category: true,
              supplier: true
            }
          }
        }
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: {
            decrement: quantity
          }
        }
      });

      return movement;
    });

    return result;
  },

  // Adjust stock (manual correction)
  adjustStock: async (data: StockMovementData) => {
    const { productId, quantity, notes, createdBy } = data;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate new stock level
    const newStock = product.currentStock + quantity;

    if (newStock < 0) {
      throw new Error('Adjustment would result in negative stock');
    }

    const result = await prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type: 'ADJUSTMENT',
          quantity,
          notes,
          createdBy
        },
        include: {
          product: {
            include: {
              category: true,
              supplier: true
            }
          }
        }
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: newStock
        }
      });

      return movement;
    });

    return result;
  },

  // Get stock movements for a product
  getProductStockHistory: async (productId: string, limit: number = 50) => {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const movements = await prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: {
          select: {
            name: true,
            sku: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return movements;
  },

  // Get all recent stock movements
  getAllStockMovements: async (page: number = 1, limit: number = 20) => {
    const skip = (page - 1) * limit;

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        include: {
          product: {
            include: {
              category: true,
              supplier: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.stockMovement.count()
    ]);

    return {
      movements,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Get stock summary/dashboard
  getStockSummary: async () => {
    // Total products
    const totalProducts = await prisma.product.count();

    // Low stock products
    const lowStockProducts = await prisma.product.count({
      where: {
        currentStock: {
          lt: prisma.product.fields.reorderLevel
        }
      }
    });

    // Out of stock products
    const outOfStockProducts = await prisma.product.count({
      where: {
        currentStock: 0
      }
    });

    // Total stock value
    const products = await prisma.product.findMany({
      select: {
        currentStock: true,
        unitPrice: true
      }
    });

    const totalStockValue = products.reduce((sum, product) => {
      return sum + (product.currentStock * Number(product.unitPrice));
    }, 0);

    // Recent movements (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMovementsCount = await prisma.stockMovement.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue: totalStockValue.toFixed(2),
      recentMovementsCount
    };
  },

  // Reorder all low-stock products up to their reorder level
  reorderAllLowStock: async (createdBy: string) => {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        currentStock: {
          lt: prisma.product.fields.reorderLevel
        }
      },
      select: {
        id: true,
        currentStock: true,
        reorderLevel: true
      }
    });

    if (lowStockProducts.length === 0) {
      return { reorderedCount: 0, totalQuantity: 0 };
    }

    const result = await prisma.$transaction(async (tx) => {
      let reorderedCount = 0;
      let totalQuantity = 0;

      await Promise.all(
        lowStockProducts.map(async (product) => {
          const quantity = product.reorderLevel - product.currentStock;
          if (quantity <= 0) return;

          reorderedCount += 1;
          totalQuantity += quantity;

          await tx.stockMovement.create({
            data: {
              productId: product.id,
              type: 'IN',
              quantity,
              notes: 'Auto reorder to minimum level',
              createdBy
            }
          });

          await tx.product.update({
            where: { id: product.id },
            data: {
              currentStock: {
                increment: quantity
              }
            }
          });
        })
      );

      return { reorderedCount, totalQuantity };
    });

    return result;
  }
};
