import prisma from '../config/database';

export const reportService = {
  // Dashboard Overview Report
  getDashboardOverview: async () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total products
    const totalProducts = await prisma.product.count();

    // Total categories
    const totalCategories = await prisma.category.count();

    // Total suppliers
    const totalSuppliers = await prisma.supplier.count();

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        currentStock: {
          lt: prisma.product.fields.reorderLevel
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: {
        currentStock: 'asc'
      },
      take: 10
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

    // Stock movements today
    const todayMovements = await prisma.stockMovement.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Stock movements this month
    const thisMonthMovements = await prisma.stockMovement.count({
      where: {
        createdAt: {
          gte: thisMonth
        }
      }
    });

    // Movement breakdown by type (this month)
    const movementBreakdown = await prisma.stockMovement.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: thisMonth
        }
      },
      _count: {
        type: true
      },
      _sum: {
        quantity: true
      }
    });

    // Top 5 products by stock value
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        currentStock: true,
        unitPrice: true,
        category: {
          select: {
            name: true
          }
        }
      }
    });

    const topProductsByValue = allProducts
      .map(p => ({
        ...p,
        stockValue: p.currentStock * Number(p.unitPrice)
      }))
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 5);

    return {
      overview: {
        totalProducts,
        totalCategories,
        totalSuppliers,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts,
        totalStockValue: totalStockValue.toFixed(2)
      },
      movements: {
        today: todayMovements,
        thisMonth: thisMonthMovements,
        breakdown: movementBreakdown
      },
      lowStockProducts,
      topProductsByValue
    };
  },

  // Stock Movement Report (by date range)
  getStockMovementReport: async (startDate: Date, endDate: Date) => {
    const movements = await prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        product: {
          include: {
            category: true,
            supplier: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Summary by type
    const summaryByType = movements.reduce((acc, movement) => {
      if (!acc[movement.type]) {
        acc[movement.type] = {
          count: 0,
          totalQuantity: 0
        };
      }
      acc[movement.type].count++;
      acc[movement.type].totalQuantity += movement.quantity;
      return acc;
    }, {} as Record<string, { count: number; totalQuantity: number }>);

    // Summary by product
    const summaryByProduct = movements.reduce((acc, movement) => {
      const productId = movement.productId;
      if (!acc[productId]) {
        acc[productId] = {
          productName: movement.product.name,
          sku: movement.product.sku,
          in: 0,
          out: 0,
          adjustment: 0,
          net: 0
        };
      }

      if (movement.type === 'IN') {
        acc[productId].in += movement.quantity;
        acc[productId].net += movement.quantity;
      } else if (movement.type === 'OUT') {
        acc[productId].out += movement.quantity;
        acc[productId].net -= movement.quantity;
      } else if (movement.type === 'ADJUSTMENT') {
        acc[productId].adjustment += movement.quantity;
        acc[productId].net += movement.quantity;
      }

      return acc;
    }, {} as Record<string, any>);

    return {
      dateRange: {
        startDate,
        endDate
      },
      totalMovements: movements.length,
      summaryByType,
      summaryByProduct: Object.values(summaryByProduct),
      movements
    };
  },

  // Inventory Value Report
  getInventoryValueReport: async () => {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true
      }
    });

    const reportData = products.map(product => {
      const stockValue = product.currentStock * Number(product.unitPrice);
      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category.name,
        supplier: product.supplier?.name || 'N/A',
        currentStock: product.currentStock,
        unitPrice: Number(product.unitPrice),
        stockValue: stockValue,
        reorderLevel: product.reorderLevel,
        needsReorder: product.currentStock < product.reorderLevel
      };
    });

    // Sort by stock value (highest first)
    reportData.sort((a, b) => b.stockValue - a.stockValue);

    const totalValue = reportData.reduce((sum, item) => sum + item.stockValue, 0);
    const totalItems = reportData.reduce((sum, item) => sum + item.currentStock, 0);

    // Group by category
    const byCategory = reportData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          category: item.category,
          products: 0,
          totalQuantity: 0,
          totalValue: 0
        };
      }
      acc[item.category].products++;
      acc[item.category].totalQuantity += item.currentStock;
      acc[item.category].totalValue += item.stockValue;
      return acc;
    }, {} as Record<string, any>);

    return {
      summary: {
        totalProducts: products.length,
        totalStockValue: totalValue.toFixed(2),
        totalItems
      },
      products: reportData,
      byCategory: Object.values(byCategory)
    };
  },

  // Low Stock Report
  getLowStockReport: async () => {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        currentStock: {
          lt: prisma.product.fields.reorderLevel
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: {
        currentStock: 'asc'
      }
    });

    const reportData = lowStockProducts.map(product => {
      const deficit = product.reorderLevel - product.currentStock;
      const estimatedCost = deficit * Number(product.unitPrice);

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category.name,
        supplier: product.supplier?.name || 'N/A',
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        deficit,
        unitPrice: Number(product.unitPrice),
        estimatedReorderCost: estimatedCost,
        status: product.currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'
      };
    });

    const totalReorderCost = reportData.reduce((sum, item) => sum + item.estimatedReorderCost, 0);

    return {
      summary: {
        totalLowStockProducts: lowStockProducts.length,
        outOfStock: lowStockProducts.filter(p => p.currentStock === 0).length,
        totalEstimatedReorderCost: totalReorderCost.toFixed(2)
      },
      products: reportData
    };
  },

  // Category Performance Report
  getCategoryReport: async () => {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            stockMovements: {
              where: {
                createdAt: {
                  gte: new Date(new Date().setDate(new Date().getDate() - 30))
                }
              }
            }
          }
        }
      }
    });

    const reportData = categories.map(category => {
      const products = category.products;
      const totalProducts = products.length;
      const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
      const totalValue = products.reduce((sum, p) => sum + (p.currentStock * Number(p.unitPrice)), 0);
      
      const movements = products.flatMap(p => p.stockMovements);
      const outMovements = movements.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0);
      const inMovements = movements.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0);

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        totalProducts,
        totalStock,
        totalValue: totalValue.toFixed(2),
        movementsLast30Days: {
          in: inMovements,
          out: outMovements,
          net: inMovements - outMovements
        }
      };
    });

    return {
      categories: reportData,
      totalCategories: categories.length
    };
  },

  // Activity Log Report
  getActivityLog: async (days: number = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const movements = await prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        product: {
          select: {
            name: true,
            sku: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const activities = movements.map(movement => ({
      id: movement.id,
      type: movement.type,
      product: movement.product.name,
      sku: movement.product.sku,
      quantity: movement.quantity,
      notes: movement.notes,
      createdBy: movement.createdBy,
      createdAt: movement.createdAt,
      action: movement.type === 'IN' ? 'Added Stock' : 
              movement.type === 'OUT' ? 'Removed Stock' : 
              'Adjusted Stock'
    }));

    return {
      period: `Last ${days} days`,
      totalActivities: activities.length,
      activities
    };
  }
};
