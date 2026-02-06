'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import type { StaffUser } from '../page';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface StaffTableProps {
  users: StaffUser[];
  currentUserId?: string;
  onRoleChange: (userId: string, role: 'ADMIN' | 'STAFF') => void;
  onDelete: (user: StaffUser) => void;
}

export default function StaffTable({
  users,
  currentUserId,
  onRoleChange,
  onDelete,
}: StaffTableProps) {
  const [pendingRole, setPendingRole] = useState<{
    user: StaffUser;
    role: 'ADMIN' | 'STAFF';
  } | null>(null);

  return (
    <>
      <Card className="border-border/60 bg-background/70 backdrop-blur">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage roles and access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{u.username}</div>
                        <div className="text-sm text-muted-foreground">{u.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        onValueChange={(value) => {
                          if (value === u.role) return;
                          setPendingRole({ user: u, role: value as 'ADMIN' | 'STAFF' });
                        }}
                        disabled={u.id === currentUserId}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="STAFF">STAFF</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => onDelete(u)}
                        disabled={u.id === currentUserId}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!pendingRole} onOpenChange={(open) => !open && setPendingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change user role?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRole
                ? `Change ${pendingRole.user.username} from ${pendingRole.user.role} to ${pendingRole.role}? This will affect their access.`
                : 'This will affect their access.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingRole) return;
                onRoleChange(pendingRole.user.id, pendingRole.role);
                setPendingRole(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
