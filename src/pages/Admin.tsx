import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Key, 
  ShoppingCart, 
  Users, 
  Plus, 
  Trash2, 
  Edit,
  Loader2,
  DollarSign
} from 'lucide-react';
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

export default function Admin() {
  const { t, language } = useLanguage();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [games, setGames] = useState<Game[]>([]);
  const [gameKeys, setGameKeys] = useState<GameKey[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  
  // New game form state
  const [newGame, setNewGame] = useState({
    title: '',
    title_ge: '',
    title_ru: '',
    description: '',
    description_ge: '',
    description_ru: '',
    price: '',
    original_price: '',
    image_url: '',
    platform: '',
    category: '',
    is_featured: false,
  });

  const [newKey, setNewKey] = useState('');

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
      const [gamesRes, keysRes, ordersRes] = await Promise.all([
        supabase.from('games').select('*').order('created_at', { ascending: false }),
        supabase.from('game_keys').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);

      if (gamesRes.data) setGames(gamesRes.data);
      if (keysRes.data) setGameKeys(keysRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGame = async () => {
    try {
      const { error } = await supabase.from('games').insert({
        title: newGame.title,
        title_ge: newGame.title_ge || null,
        title_ru: newGame.title_ru || null,
        description: newGame.description || null,
        description_ge: newGame.description_ge || null,
        description_ru: newGame.description_ru || null,
        price: parseFloat(newGame.price),
        original_price: newGame.original_price ? parseFloat(newGame.original_price) : null,
        image_url: newGame.image_url || null,
        platform: newGame.platform ? newGame.platform.split(',').map(p => p.trim()) : [],
        category: newGame.category || null,
        is_featured: newGame.is_featured,
        is_active: true,
      });

      if (error) throw error;

      toast.success('Game added successfully!');
      setIsAddGameOpen(false);
      setNewGame({
        title: '',
        title_ge: '',
        title_ru: '',
        description: '',
        description_ge: '',
        description_ru: '',
        price: '',
        original_price: '',
        image_url: '',
        platform: '',
        category: '',
        is_featured: false,
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const handleAddKey = async () => {
    if (!selectedGameId || !newKey) {
      toast.error('Please select a game and enter a key');
      return;
    }

    try {
      const { error } = await supabase.from('game_keys').insert({
        game_id: selectedGameId,
        key_value: newKey,
        is_sold: false,
      });

      if (error) throw error;

      toast.success('Key added successfully!');
      setIsAddKeyOpen(false);
      setNewKey('');
      setSelectedGameId('');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const { error } = await supabase.from('games').delete().eq('id', gameId);
      if (error) throw error;
      toast.success('Game deleted successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this key?')) return;

    try {
      const { error } = await supabase.from('game_keys').delete().eq('id', keyId);
      if (error) throw error;
      toast.success('Key deleted successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const getGameTitle = (game: Game) => {
    if (language === 'ge' && game.title_ge) return game.title_ge;
    if (language === 'ru' && game.title_ru) return game.title_ru;
    return game.title;
  };

  const getGameTitleById = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game ? getGameTitle(game) : 'Unknown';
  };

  const availableKeys = gameKeys.filter(k => !k.is_sold).length;
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-display font-bold text-gradient-primary mb-8">
          {t.admin.title}
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-primary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-primary/20">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.admin.totalGames}</p>
                <p className="text-2xl font-bold">{games.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-secondary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-secondary/20">
                <Key className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.admin.totalKeys}</p>
                <p className="text-2xl font-bold">{availableKeys}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-accent/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-accent/20">
                <ShoppingCart className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.admin.totalOrders}</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-primary/20">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.admin.revenue}</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="games" className="space-y-4">
          <TabsList className="glass">
            <TabsTrigger value="games" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              {t.admin.games}
            </TabsTrigger>
            <TabsTrigger value="keys" className="gap-2">
              <Key className="h-4 w-4" />
              {t.admin.keys}
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              {t.admin.orders}
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games">
            <Card className="glass border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.admin.games}</CardTitle>
                  <CardDescription>Manage your game catalog</CardDescription>
                </div>
                <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary gap-2">
                      <Plus className="h-4 w-4" />
                      {t.admin.addGame}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t.admin.addGame}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Title (EN)</Label>
                          <Input
                            value={newGame.title}
                            onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                            placeholder="English title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title (GE)</Label>
                          <Input
                            value={newGame.title_ge}
                            onChange={(e) => setNewGame({ ...newGame, title_ge: e.target.value })}
                            placeholder="Georgian title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title (RU)</Label>
                          <Input
                            value={newGame.title_ru}
                            onChange={(e) => setNewGame({ ...newGame, title_ru: e.target.value })}
                            placeholder="Russian title"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description (EN)</Label>
                        <Textarea
                          value={newGame.description}
                          onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                          placeholder="English description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description (GE)</Label>
                        <Textarea
                          value={newGame.description_ge}
                          onChange={(e) => setNewGame({ ...newGame, description_ge: e.target.value })}
                          placeholder="Georgian description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description (RU)</Label>
                        <Textarea
                          value={newGame.description_ru}
                          onChange={(e) => setNewGame({ ...newGame, description_ru: e.target.value })}
                          placeholder="Russian description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Price ($)</Label>
                          <Input
                            type="number"
                            value={newGame.price}
                            onChange={(e) => setNewGame({ ...newGame, price: e.target.value })}
                            placeholder="29.99"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Original Price ($)</Label>
                          <Input
                            type="number"
                            value={newGame.original_price}
                            onChange={(e) => setNewGame({ ...newGame, original_price: e.target.value })}
                            placeholder="59.99"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={newGame.image_url}
                          onChange={(e) => setNewGame({ ...newGame, image_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Platforms (comma separated)</Label>
                          <Input
                            value={newGame.platform}
                            onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
                            placeholder="PC, PlayStation, Xbox"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            value={newGame.category}
                            onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                            placeholder="Action, RPG, etc."
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_featured"
                          checked={newGame.is_featured}
                          onChange={(e) => setNewGame({ ...newGame, is_featured: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="is_featured">Featured Game</Label>
                      </div>

                      <Button onClick={handleAddGame} className="bg-gradient-primary">
                        {t.admin.addGame}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {games.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{getGameTitle(game)}</TableCell>
                        <TableCell>
                          ${game.price}
                          {game.original_price && (
                            <span className="ml-2 text-sm text-muted-foreground line-through">
                              ${game.original_price}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{game.category || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={game.is_active ? 'default' : 'secondary'}>
                            {game.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {game.is_featured && (
                            <Badge variant="outline" className="ml-2 border-secondary text-secondary">
                              Featured
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteGame(game.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keys Tab */}
          <TabsContent value="keys">
            <Card className="glass border-secondary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.admin.keys}</CardTitle>
                  <CardDescription>Manage game activation keys</CardDescription>
                </div>
                <Dialog open={isAddKeyOpen} onOpenChange={setIsAddKeyOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-secondary gap-2">
                      <Plus className="h-4 w-4" />
                      {t.admin.addKey}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass">
                    <DialogHeader>
                      <DialogTitle>{t.admin.addKey}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Game</Label>
                        <select
                          value={selectedGameId}
                          onChange={(e) => setSelectedGameId(e.target.value)}
                          className="w-full p-2 rounded-md bg-background border border-primary/30"
                        >
                          <option value="">Select a game...</option>
                          {games.map((game) => (
                            <option key={game.id} value={game.id}>
                              {getGameTitle(game)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Game Key</Label>
                        <Input
                          value={newKey}
                          onChange={(e) => setNewKey(e.target.value)}
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                        />
                      </div>
                      <Button onClick={handleAddKey} className="bg-gradient-secondary">
                        {t.admin.addKey}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Game</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">
                          {getGameTitleById(key.game_id)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {key.is_sold ? '••••-••••-••••-••••' : key.key_value}
                        </TableCell>
                        <TableCell>
                          <Badge variant={key.is_sold ? 'secondary' : 'default'}>
                            {key.is_sold ? 'Sold' : 'Available'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(key.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {!key.is_sold && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteKey(key.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="glass border-accent/20">
              <CardHeader>
                <CardTitle>{t.admin.orders}</CardTitle>
                <CardDescription>View all customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Game</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {order.game_id ? getGameTitleById(order.game_id) : '-'}
                        </TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {order.status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
