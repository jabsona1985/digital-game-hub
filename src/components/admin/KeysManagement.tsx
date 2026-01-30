import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Search, Loader2, Key, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Game {
  id: string;
  title: string;
  title_ge: string | null;
  title_ru: string | null;
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

interface KeysManagementProps {
  games: Game[];
  gameKeys: GameKey[];
  onRefresh: () => void;
}

export function KeysManagement({ games, gameKeys, onRefresh }: KeysManagementProps) {
  const { t, language } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [newKeys, setNewKeys] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGame, setFilterGame] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getGameTitle = (game: Game) => {
    if (language === 'ge' && game.title_ge) return game.title_ge;
    if (language === 'ru' && game.title_ru) return game.title_ru;
    return game.title;
  };

  const getGameTitleById = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game ? getGameTitle(game) : 'Unknown';
  };

  const filteredKeys = gameKeys.filter(key => {
    const matchesSearch = key.key_value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = filterGame === 'all' || key.game_id === filterGame;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'available' && !key.is_sold) ||
      (filterStatus === 'sold' && key.is_sold);
    return matchesSearch && matchesGame && matchesStatus;
  });

  const handleAddKeys = async () => {
    if (!selectedGameId || !newKeys.trim()) {
      toast.error('აირჩიე თამაში და შეიყვანე გასაღებები');
      return;
    }

    setSaving(true);
    try {
      const keysArray = newKeys.split('\n').map(k => k.trim()).filter(k => k);
      
      const { error } = await supabase.from('game_keys').insert(
        keysArray.map(key => ({
          game_id: selectedGameId,
          key_value: key,
          is_sold: false,
        }))
      );

      if (error) throw error;

      toast.success(`${keysArray.length} გასაღები წარმატებით დაემატა!`);
      setIsAddOpen(false);
      setNewKeys('');
      setSelectedGameId('');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (keyId: string) => {
    if (!confirm('დარწმუნებული ხარ რომ გსურს გასაღების წაშლა?')) return;

    try {
      const { error } = await supabase.from('game_keys').delete().eq('id', keyId);
      if (error) throw error;
      toast.success('გასაღები წაშლილია!');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('გასაღები დაკოპირებულია!');
  };

  const availableCount = gameKeys.filter(k => !k.is_sold).length;
  const soldCount = gameKeys.filter(k => k.is_sold).length;

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-display">{t.admin.keys}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            ხელმისაწვდომი: <span className="text-emerald-500 font-semibold">{availableCount}</span> | 
            გაყიდული: <span className="text-amber-500 font-semibold">{soldCount}</span>
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary gap-2">
              <Plus className="h-4 w-4" />
              {t.admin.addKey}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                გასაღებების დამატება
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>აირჩიე თამაში *</Label>
                <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიე თამაში..." />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map(game => (
                      <SelectItem key={game.id} value={game.id}>
                        {getGameTitle(game)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>გასაღებები (თითო ხაზზე ერთი) *</Label>
                <textarea
                  value={newKeys}
                  onChange={(e) => setNewKeys(e.target.value)}
                  placeholder="KEY-XXXX-XXXX-XXXX&#10;KEY-YYYY-YYYY-YYYY&#10;KEY-ZZZZ-ZZZZ-ZZZZ"
                  rows={6}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  {newKeys.split('\n').filter(k => k.trim()).length} გასაღები მზად არის დასამატებლად
                </p>
              </div>

              <Button 
                onClick={handleAddKeys} 
                className="bg-gradient-primary w-full"
                disabled={saving || !selectedGameId || !newKeys.trim()}
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                გასაღებების დამატება
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="გასაღების ძებნა..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterGame} onValueChange={setFilterGame}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="თამაში" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ყველა თამაში</SelectItem>
              {games.map(game => (
                <SelectItem key={game.id} value={game.id}>
                  {getGameTitle(game)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="სტატუსი" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ყველა</SelectItem>
              <SelectItem value="available">ხელმისაწვდომი</SelectItem>
              <SelectItem value="sold">გაყიდული</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>თამაში</TableHead>
                <TableHead>გასაღები</TableHead>
                <TableHead>სტატუსი</TableHead>
                <TableHead>თარიღი</TableHead>
                <TableHead className="text-right">მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.slice(0, 50).map((key) => (
                <TableRow key={key.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium">
                    {getGameTitleById(key.game_id)}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted/50 px-2 py-1 rounded text-sm font-mono">
                      {key.key_value}
                    </code>
                  </TableCell>
                  <TableCell>
                    {key.is_sold ? (
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-500">
                        გაყიდული
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500">
                        ხელმისაწვდომი
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(key.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyKey(key.key_value, key.id)}
                        className="hover:bg-primary/20 hover:text-primary"
                      >
                        {copiedId === key.id ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(key.id)}
                        className="hover:bg-destructive/20 hover:text-destructive"
                        disabled={key.is_sold ?? false}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredKeys.length > 50 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            ნაჩვენებია 50 გასაღები {filteredKeys.length}-დან
          </p>
        )}
      </CardContent>
    </Card>
  );
}
