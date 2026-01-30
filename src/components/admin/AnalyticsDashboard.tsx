import { useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, PieChartIcon } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  category: string | null;
}

interface Order {
  id: string;
  game_id: string | null;
  amount: number;
  status: string | null;
  created_at: string;
}

interface GameKey {
  id: string;
  game_id: string;
  is_sold: boolean | null;
}

interface AnalyticsDashboardProps {
  games: Game[];
  orders: Order[];
  gameKeys: GameKey[];
}

const COLORS = ['hsl(270, 100%, 60%)', 'hsl(142, 100%, 50%)', 'hsl(185, 100%, 50%)', 'hsl(45, 100%, 50%)', 'hsl(0, 85%, 60%)'];

export function AnalyticsDashboard({ games, orders, gameKeys }: AnalyticsDashboardProps) {
  const { language } = useLanguage();

  // Revenue by month
  const revenueData = useMemo(() => {
    const monthlyRevenue: Record<string, number> = {};
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    completedOrders.forEach(order => {
      const date = new Date(order.created_at);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.amount;
    });

    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue: parseFloat(revenue.toFixed(2)) }))
      .slice(-6);
  }, [orders]);

  // Orders by status
  const orderStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels: Record<string, string> = {
      completed: 'დასრულებული',
      pending: 'მოლოდინში',
      failed: 'ჩაიშალა',
      unknown: 'უცნობი'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: labels[status] || status,
      value: count
    }));
  }, [orders]);

  // Top selling games
  const topGamesData = useMemo(() => {
    const gameSales: Record<string, { count: number; revenue: number }> = {};
    const completedOrders = orders.filter(o => o.status === 'completed');

    completedOrders.forEach(order => {
      if (order.game_id) {
        if (!gameSales[order.game_id]) {
          gameSales[order.game_id] = { count: 0, revenue: 0 };
        }
        gameSales[order.game_id].count++;
        gameSales[order.game_id].revenue += order.amount;
      }
    });

    return Object.entries(gameSales)
      .map(([gameId, data]) => {
        const game = games.find(g => g.id === gameId);
        return {
          name: game?.title?.slice(0, 15) || 'უცნობი',
          sales: data.count,
          revenue: parseFloat(data.revenue.toFixed(2))
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders, games]);

  // Keys by game
  const keysData = useMemo(() => {
    const gameKeysCounts: Record<string, { available: number; sold: number }> = {};
    
    gameKeys.forEach(key => {
      if (!gameKeysCounts[key.game_id]) {
        gameKeysCounts[key.game_id] = { available: 0, sold: 0 };
      }
      if (key.is_sold) {
        gameKeysCounts[key.game_id].sold++;
      } else {
        gameKeysCounts[key.game_id].available++;
      }
    });

    return Object.entries(gameKeysCounts)
      .map(([gameId, data]) => {
        const game = games.find(g => g.id === gameId);
        return {
          name: game?.title?.slice(0, 12) || 'უცნობი',
          available: data.available,
          sold: data.sold
        };
      })
      .slice(0, 6);
  }, [gameKeys, games]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              შემოსავალი თვეების მიხედვით
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                  formatter={(value) => [`$${value}`, 'შემოსავალი']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(270, 100%, 60%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(270, 100%, 60%)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              შეკვეთების სტატუსი
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Games */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              ტოპ გაყიდვადი თამაშები
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topGamesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [name === 'revenue' ? `$${value}` : value, name === 'revenue' ? 'შემოსავალი' : 'გაყიდვები']}
                />
                <Bar dataKey="revenue" fill="hsl(142, 100%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Keys by Game */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              გასაღებები თამაშების მიხედვით
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={keysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="available" name="ხელმისაწვდომი" fill="hsl(142, 100%, 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sold" name="გაყიდული" fill="hsl(45, 100%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
