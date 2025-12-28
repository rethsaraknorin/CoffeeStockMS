'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import EditProductDialog from './EditProductDialog';
import DeleteProductDialog from './DeleteProductDialog';

interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    unitPrice: number;
    currentStock: number;
    reorderLevel: number;
    unit: string;
    category: {
        id: string;
        name: string;
    };
    supplier?: {
        id: string;
        name: string;
    };
}

interface ProductsTableProps {
    products: Product[];
    onRefresh: () => void;
}

export default function ProductsTable({ products, onRefresh }: ProductsTableProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    const getStockStatus = (stock: number, reorderLevel: number) => {
        if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
        if (stock <= reorderLevel) return { label: 'Low Stock', variant: 'secondary' as const };
        return { label: 'In Stock', variant: 'default' as const };
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Get started by adding your first product
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => {
                            const status = getStockStatus(product.currentStock, product.reorderLevel);

                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                SKU: {product.sku}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category.name}</Badge>
                                    </TableCell>
                                    <TableCell>${Number(product.unitPrice).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className="font-mono">{Number(product.currentStock)}</span> {product.unit}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={status.variant}>{status.label}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeletingProduct(product)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            {editingProduct && (
                <EditProductDialog
                    product={editingProduct}
                    open={!!editingProduct}
                    onOpenChange={(open) => !open && setEditingProduct(null)}
                    onSuccess={onRefresh}
                />
            )}

            {/* Delete Dialog */}
            {deletingProduct && (
                <DeleteProductDialog
                    product={deletingProduct}
                    open={!!deletingProduct}
                    onOpenChange={(open) => !open && setDeletingProduct(null)}
                    onSuccess={onRefresh}
                />
            )}
        </>
    );
}