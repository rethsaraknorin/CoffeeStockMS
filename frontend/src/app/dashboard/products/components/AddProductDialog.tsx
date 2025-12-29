'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(2, 'SKU must be at least 2 characters'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  unitPrice: z.number().min(0, 'Price must be positive'),
  currentStock: z.number().min(0, 'Stock must be positive'),
  reorderLevel: z.number().min(0, 'Reorder level must be positive'),
  unit: z.string().min(1, 'Unit is required'),
});

type ProductForm = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
}

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

// Add Category Dialog Component
function AddCategoryDialog({
  open,
  onOpenChange,
  onCategoryAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: (category: Category) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/categories', {
        name: categoryName,
        description: categoryDescription || undefined,
      });
      
      toast.success('Category added successfully!');
      onCategoryAdded(response.data.data);
      setCategoryName('');
      setCategoryDescription('');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new product category
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name *</Label>
            <Input
              id="categoryName"
              placeholder="e.g., Coffee Beans"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryDescription">Description</Label>
            <Textarea
              id="categoryDescription"
              placeholder="Optional description..."
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AddProductDialog({
  open,
  onOpenChange,
  categories: initialCategories,
  onSuccess,
}: AddProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categories, setCategories] = useState(initialCategories);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      unit: 'pcs',
      currentStock: 0,
      reorderLevel: 10,
    },
  });

  const selectedCategoryId = watch('categoryId');

  const handleCategoryAdded = (newCategory: Category) => {
    setCategories([...categories, newCategory]);
    setValue('categoryId', newCategory.id);
    toast.success(`Category "${newCategory.name}" selected`);
  };

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    try {
      await api.post('/products', data);
      toast.success('Product added successfully!');
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Espresso"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  placeholder="ESP-001"
                  {...register('sku')}
                />
                {errors.sku && (
                  <p className="text-sm text-destructive">{errors.sku.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Product description..."
                {...register('description')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category with Add Button */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <div className="flex gap-2">
                  <Select 
                    onValueChange={(value) => setValue('categoryId', value)}
                    value={selectedCategoryId}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAddCategory(true)}
                    className="flex-shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Unit Price */}
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price ($) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  placeholder="3.50"
                  {...register('unitPrice', { valueAsNumber: true })}
                />
                {errors.unitPrice && (
                  <p className="text-sm text-destructive">{errors.unitPrice.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Current Stock */}
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  placeholder="100"
                  {...register('currentStock', { valueAsNumber: true })}
                />
                {errors.currentStock && (
                  <p className="text-sm text-destructive">{errors.currentStock.message}</p>
                )}
              </div>

              {/* Reorder Level */}
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level *</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  placeholder="20"
                  {...register('reorderLevel', { valueAsNumber: true })}
                />
                {errors.reorderLevel && (
                  <p className="text-sm text-destructive">{errors.reorderLevel.message}</p>
                )}
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select onValueChange={(value) => setValue('unit', value)} defaultValue="pcs">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="ltr">Liters</SelectItem>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
        onCategoryAdded={handleCategoryAdded}
      />
    </>
  );
}