import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Key, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  gamesCount: number;
  keysCount: number;
  ordersCount: number;
  revenue: number;
  usersCount?: number;
}

export function StatsCards({ gamesCount, keysCount, ordersCount, revenue, usersCount }: StatsCardsProps) {
  const { t } = useLanguage();

  const stats = [
    {
      title: t.admin.totalGames,
      value: gamesCount,
      icon: Gamepad2,
      color: 'primary',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: t.admin.totalKeys,
      value: keysCount,
      icon: Key,
      color: 'secondary',
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      title: t.admin.totalOrders,
      value: ordersCount,
      icon: ShoppingCart,
      color: 'accent',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      title: t.admin.revenue,
      value: `$${revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'primary',
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  if (typeof usersCount === 'number') {
    stats.push({
      title: t.admin.users,
      value: usersCount,
      icon: Users,
      color: 'secondary',
      gradient: 'from-pink-500 to-rose-600',
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="glass border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <p className="text-3xl font-bold font-display">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+12%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
