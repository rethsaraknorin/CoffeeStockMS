'use client';

import { useEffect, useMemo, useState } from 'react';
import { Shield, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface StaffUser {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  createdAt: string;
}

interface StaffActivity {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  product: string;
  sku: string;
  quantity: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  action: string;
}

export default function StaffPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<StaffActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'STAFF'>('ALL');
  const [sortKey, setSortKey] = useState<'username' | 'role' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      setActivityLoading(true);
      const response = await api.get('/reports/activity-log?days=14');
      setActivity(response.data.data.activities || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load activity history');
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchActivity();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'ADMIN').length;
    const staff = users.filter((u) => u.role === 'STAFF').length;
    return { total, admins, staff };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = users.filter((u) => {
      const matchesTerm =
        term.length === 0 ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesTerm && matchesRole;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'createdAt') {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sortDir === 'asc' ? aTime - bTime : bTime - aTime;
      }
      if (sortKey === 'role') {
        const aVal = a.role;
        const bVal = b.role;
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      const aVal = a.username.toLowerCase();
      const bVal = b.username.toLowerCase();
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return sorted;
  }, [users, searchTerm, roleFilter, sortKey, sortDir]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  }, [filteredUsers.length]);

  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleSort = (key: 'username' | 'role' | 'createdAt') => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('ALL');
    setCurrentPage(1);
  };

  const handleRoleChange = async (userId: string, role: 'ADMIN' | 'STAFF') => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (targetUser: StaffUser) => {
    try {
      await api.delete(`/users/${targetUser.id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto p-6">
          <Card className="border-border/60 bg-background/70 backdrop-blur">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Admin access is required to view staff controls.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-1/2" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Staff Management</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Control access and roles for your team
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Total Users: {stats.total}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Admins: {stats.admins}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Staff: {stats.staff}
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Search users"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value as 'ALL' | 'ADMIN' | 'STAFF')}
            >
              <SelectTrigger className="h-9 w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchUsers} variant="outline" className="w-full sm:w-auto">
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/60 bg-background/70 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All roles</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-background/70 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">Full access</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-background/70 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.staff}</div>
              <p className="text-xs text-muted-foreground">Limited access</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/70 dark:bg-slate-900/50 sm:inline-flex sm:w-auto">
            <TabsTrigger value="users" className="text-xs sm:text-sm">All Users</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">Staff Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage roles and access</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed px-6 py-12 text-center">
                    <div className="text-base font-medium">No users found</div>
                    <div className="text-sm text-muted-foreground">
                      Once staff are added, they will show up here for role management.
                    </div>
                    <Button onClick={fetchUsers} variant="outline">
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <button
                              type="button"
                              onClick={() => toggleSort('username')}
                              className="inline-flex items-center gap-2 text-left font-medium text-foreground/80 hover:text-foreground"
                            >
                              User
                              <span className="text-xs text-muted-foreground">
                                {sortKey === 'username' ? (sortDir === 'asc' ? '^' : 'v') : ''}
                              </span>
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              type="button"
                              onClick={() => toggleSort('role')}
                              className="inline-flex items-center gap-2 text-left font-medium text-foreground/80 hover:text-foreground"
                            >
                              Role
                              <span className="text-xs text-muted-foreground">
                                {sortKey === 'role' ? (sortDir === 'asc' ? '^' : 'v') : ''}
                              </span>
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              type="button"
                              onClick={() => toggleSort('createdAt')}
                              className="inline-flex items-center gap-2 text-left font-medium text-foreground/80 hover:text-foreground"
                            >
                              Created
                              <span className="text-xs text-muted-foreground">
                                {sortKey === 'createdAt' ? (sortDir === 'asc' ? '^' : 'v') : ''}
                              </span>
                            </button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedUsers.map((u) => (
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
                                onValueChange={(value) => handleRoleChange(u.id, value as 'ADMIN' | 'STAFF')}
                                disabled={u.id === user?.id}
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
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                    disabled={u.id === user?.id}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete user?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The user will lose access immediately.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(u)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                              <div className="space-y-2">
                                <div>No users match your search.</div>
                                <Button size="sm" variant="outline" onClick={resetFilters}>
                                  Clear search and filters
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {filteredUsers.length > 0 && (
                      <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row">
                        <div>
                          Showing{' '}
                          <span className="font-medium text-foreground">
                            {(currentPage - 1) * pageSize + 1}
                          </span>{' '}
                          to{' '}
                          <span className="font-medium text-foreground">
                            {Math.min(currentPage * pageSize, filteredUsers.length)}
                          </span>{' '}
                          of{' '}
                          <span className="font-medium text-foreground">{filteredUsers.length}</span> users
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            Prev
                          </Button>
                          <span className="min-w-[90px] text-center">
                            Page{' '}
                            <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                            <span className="font-medium text-foreground">{totalPages}</span>
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Staff Activity History</CardTitle>
                  <CardDescription>Latest stock actions from your team</CardDescription>
                </div>
                <Button onClick={fetchActivity} variant="outline" size="sm">
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : activity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-sm text-muted-foreground">No recent staff activity</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[360px] pr-2">
                    <div className="space-y-3">
                      {activity.map((item) => (
                        <div key={item.id} className="rounded-md border border-border/60 bg-background/70 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium">{item.product}</div>
                            <Badge variant="outline" className="text-xs">
                              {item.action}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            SKU: {item.sku} - Qty: {item.quantity}
                          </div>
                          {item.notes && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Notes: {item.notes}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground">
                            by {item.createdBy} - {new Date(item.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
