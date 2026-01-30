import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserCog, Shield, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
}

export function UsersManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false });

      // Fetch user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      setUsers(profiles || []);
      setUserRoles((roles as UserRole[]) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = (userId: string): 'admin' | 'moderator' | 'user' => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || 'user';
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
    setUpdating(userId);
    try {
      const existingRole = userRoles.find(r => r.user_id === userId);

      if (newRole === 'user') {
        // Remove role entry if setting to 'user'
        if (existingRole) {
          await supabase.from('user_roles').delete().eq('user_id', userId);
        }
      } else {
        if (existingRole) {
          // Update existing role
          await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
        } else {
          // Insert new role
          await supabase.from('user_roles').insert({ user_id: userId, role: newRole });
        }
      }

      toast.success('როლი განახლებულია!');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'შეცდომა როლის განახლებისას');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-violet-500/20 text-violet-500 border-violet-500/30">ადმინი</Badge>;
      case 'moderator':
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">მოდერატორი</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">მომხმარებელი</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            {t.admin.users}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            სულ: <span className="font-semibold">{users.length}</span> მომხმარებელი
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ძებნა ელ-ფოსტით..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>მომხმარებელი</TableHead>
                <TableHead>როლი</TableHead>
                <TableHead>რეგისტრაცია</TableHead>
                <TableHead className="text-right">მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const role = getUserRole(user.id);
                return (
                  <TableRow key={user.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          {role === 'admin' ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.email || 'უცნობი'}</p>
                          <p className="text-xs text-muted-foreground">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(role)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(user.created_at).toLocaleDateString('ka-GE')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={role}
                        onValueChange={(value) => handleRoleChange(user.id, value as 'admin' | 'moderator' | 'user')}
                        disabled={updating === user.id}
                      >
                        <SelectTrigger className="w-40">
                          {updating === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">მომხმარებელი</SelectItem>
                          <SelectItem value="moderator">მოდერატორი</SelectItem>
                          <SelectItem value="admin">ადმინი</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    მომხმარებლები ვერ მოიძებნა
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
