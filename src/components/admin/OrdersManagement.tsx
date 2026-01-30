import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package } from 'lucide-react';
import { useState } from 'react';

interface Game {
  id: string;
  title: string;
  title_ge: string | null;
  title_ru: string | null;
}

interface Order {
  id: string;
  user_id: string | null;
  game_id: string | null;
  amount: number;
  status: string | null;
  created_at: string;
}

interface OrdersManagementProps {
  games: Game[];
  orders: Order[];
}

export function OrdersManagement({ games, orders }: OrdersManagementProps) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getGameTitle = (game: Game) => {
    if (language === 'ge' && game.title_ge) return game.title_ge;
    if (language === 'ru' && game.title_ru) return game.title_ru;
    return game.title;
  };

  const getGameTitleById = (gameId: string | null) => {
    if (!gameId) return 'უცნობი';
    const game = games.find(g => g.id === gameId);
    return game ? getGameTitle(game) : 'უცნობი';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">დასრულებული</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">მოლოდინში</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">ჩაიშალა</Badge>;
      default:
        return <Badge variant="outline">{status || 'უცნობი'}</Badge>;
    }
  };

  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {t.admin.orders}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            სულ შეკვეთები: <span className="font-semibold">{orders.length}</span> | 
            შემოსავალი: <span className="font-semibold text-emerald-500">${totalRevenue.toFixed(2)}</span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="შეკვეთის ძებნა..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="სტატუსი" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ყველა</SelectItem>
              <SelectItem value="completed">დასრულებული</SelectItem>
              <SelectItem value="pending">მოლოდინში</SelectItem>
              <SelectItem value="failed">ჩაიშალა</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>შეკვეთის ID</TableHead>
                <TableHead>თამაში</TableHead>
                <TableHead>თანხა</TableHead>
                <TableHead>სტატუსი</TableHead>
                <TableHead>თარიღი</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/20">
                  <TableCell>
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded">
                      {order.id.slice(0, 8)}...
                    </code>
                  </TableCell>
                  <TableCell className="font-medium">
                    {getGameTitleById(order.game_id)}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-primary">${order.amount.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(order.created_at).toLocaleDateString('ka-GE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    შეკვეთები ვერ მოიძებნა
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
