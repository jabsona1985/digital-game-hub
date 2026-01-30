import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCards } from '@/components/admin/StatsCards';
import { GamesManagement } from '@/components/admin/GamesManagement';
import { KeysManagement } from '@/components/admin/KeysManagement';
import { OrdersManagement } from '@/components/admin/OrdersManagement';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LayoutDashboard, Gamepad2, Key, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface Game {
  id: string;
  title: string;
  title_ge: string | null;
  title_ru: string | null;
  description: string | null;
  description_ge: string | null;
  description_ru: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  platform: string[] | null;
  category: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  created_at: string;
}

interface GameKey {
  id: string;
  game_id: string;
  key_value: string;
  is_sold: boolean | null;
  sold_to: string | null;
  sold_at: string | null;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string | null;
  game_id: string | null;
  amount: number;
  status: string | null;
  created_at: string;
}

const tabLabels: Record<string, { en: string; ge: string; ru: string }> = {
  dashboard: { en: 'Dashboard', ge: 'მთავარი', ru: 'Панель' },
  games: { en: 'Games', ge: 'თამაშები', ru: 'Игры' },
  keys: { en: 'Keys', ge: 'გასაღებები', ru: 'Ключи' },
  orders: { en: 'Orders', ge: 'შეკვეთები', ru: 'Заказы' },
  users: { en: 'Users', ge: 'მომხმარებლები', ru: 'Пользователи' },
  analytics: { en: 'Analytics', ge: 'ანალიტიკა', ru: 'Аналитика' },
};

export default function Admin() {
  const { t, language } = useLanguage();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [games, setGames] = useState<Game[]>([]);
  const [gameKeys, setGameKeys] = useState<GameKey[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
      return;
    }
    
    if (isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gamesRes, keysRes, ordersRes, usersRes] = await Promise.all([
        supabase.from('games').select('*').order('created_at', { ascending: false }),
        supabase.from('game_keys').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      if (gamesRes.data) setGames(gamesRes.data);
      if (keysRes.data) setGameKeys(keysRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (usersRes.count !== null) setUsersCount(usersRes.count);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = (key: string) => {
    return tabLabels[key]?.[language] || tabLabels[key]?.en || key;
  };

  const availableKeys = gameKeys.filter(k => !k.is_sold).length;
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient-primary">
            {t.admin.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            მართე შენი მაღაზიის ყველა ასპექტი
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass border border-border/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">{getLabel('dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">{getLabel('games')}</span>
            </TabsTrigger>
            <TabsTrigger value="keys" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">{getLabel('keys')}</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{getLabel('orders')}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{getLabel('users')}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{getLabel('analytics')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsCards
              gamesCount={games.length}
              keysCount={availableKeys}
              ordersCount={orders.length}
              revenue={totalRevenue}
              usersCount={usersCount}
            />
            <AnalyticsDashboard games={games} orders={orders} gameKeys={gameKeys} />
          </TabsContent>

          <TabsContent value="games">
            <GamesManagement games={games} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="keys">
            <KeysManagement games={games} gameKeys={gameKeys} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManagement games={games} orders={orders} />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard games={games} orders={orders} gameKeys={gameKeys} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
