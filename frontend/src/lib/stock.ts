export type StockStatus = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive';
  className: string;
};

export const getStockStatus = (stock: number, reorderLevel: number): StockStatus => {
  if (stock === 0) {
    return {
      variant: 'destructive',
      label: 'Out of Stock',
      className: 'bg-red-600/10 text-red-600 border-red-600/30'
    };
  }

  if (stock <= reorderLevel) {
    return {
      variant: 'secondary',
      label: 'Low Stock',
      className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
    };
  }

  return {
    variant: 'default',
    label: 'In Stock',
    className: 'bg-green-600/10 text-green-600 border-green-600/30'
  };
};
