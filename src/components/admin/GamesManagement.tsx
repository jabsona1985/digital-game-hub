import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit, Search, Loader2 } from 'lucide-react';
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

interface GamesManagementProps {
  games: Game[];
  onRefresh: () => void;
}

const emptyGame = {
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
};

export function GamesManagement({ games, onRefresh }: GamesManagementProps) {
  const { t, language } = useLanguage();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState(emptyGame);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const getGameTitle = (game: Game) => {
    if (language === 'ge' && game.title_ge) return game.title_ge;
    if (language === 'ru' && game.title_ru) return game.title_ru;
    return game.title;
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('games').insert({
        title: formData.title,
        title_ge: formData.title_ge || null,
        title_ru: formData.title_ru || null,
        description: formData.description || null,
        description_ge: formData.description_ge || null,
        description_ru: formData.description_ru || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        image_url: formData.image_url || null,
        platform: formData.platform ? formData.platform.split(',').map(p => p.trim()) : [],
        category: formData.category || null,
        is_featured: formData.is_featured,
        is_active: true,
      });

      if (error) throw error;

      toast.success('თამაში წარმატებით დაემატა!');
      setIsAddOpen(false);
      setFormData(emptyGame);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingGame) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('games').update({
        title: formData.title,
        title_ge: formData.title_ge || null,
        title_ru: formData.title_ru || null,
        description: formData.description || null,
        description_ge: formData.description_ge || null,
        description_ru: formData.description_ru || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        image_url: formData.image_url || null,
        platform: formData.platform ? formData.platform.split(',').map(p => p.trim()) : [],
        category: formData.category || null,
        is_featured: formData.is_featured,
      }).eq('id', editingGame.id);

      if (error) throw error;

      toast.success('თამაში წარმატებით განახლდა!');
      setIsEditOpen(false);
      setEditingGame(null);
      setFormData(emptyGame);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm('დარწმუნებული ხარ რომ გსურს თამაშის წაშლა?')) return;

    try {
      const { error } = await supabase.from('games').delete().eq('id', gameId);
      if (error) throw error;
      toast.success('თამაში წაშლილია!');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const openEditDialog = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      title_ge: game.title_ge || '',
      title_ru: game.title_ru || '',
      description: game.description || '',
      description_ge: game.description_ge || '',
      description_ru: game.description_ru || '',
      price: game.price.toString(),
      original_price: game.original_price?.toString() || '',
      image_url: game.image_url || '',
      platform: game.platform?.join(', ') || '',
      category: game.category || '',
      is_featured: game.is_featured || false,
    });
    setIsEditOpen(true);
  };

  const toggleActive = async (game: Game) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ is_active: !game.is_active })
        .eq('id', game.id);

      if (error) throw error;
      toast.success(game.is_active ? 'თამაში დეაქტივირებულია' : 'თამაში აქტივირებულია');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const GameForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>სათაური (EN) *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="English title"
          />
        </div>
        <div className="space-y-2">
          <Label>სათაური (GE)</Label>
          <Input
            value={formData.title_ge}
            onChange={(e) => setFormData({ ...formData, title_ge: e.target.value })}
            placeholder="ქართული სათაური"
          />
        </div>
        <div className="space-y-2">
          <Label>სათაური (RU)</Label>
          <Input
            value={formData.title_ru}
            onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
            placeholder="Русское название"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>აღწერა (EN)</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="English description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>აღწერა (GE)</Label>
        <Textarea
          value={formData.description_ge}
          onChange={(e) => setFormData({ ...formData, description_ge: e.target.value })}
          placeholder="ქართული აღწერა"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>აღწერა (RU)</Label>
        <Textarea
          value={formData.description_ru}
          onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
          placeholder="Русское описание"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ფასი ($) *</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="29.99"
          />
        </div>
        <div className="space-y-2">
          <Label>ძველი ფასი ($)</Label>
          <Input
            type="number"
            value={formData.original_price}
            onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
            placeholder="59.99"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>სურათის URL</Label>
        <Input
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>პლატფორმები (მძიმით გამოყოფილი)</Label>
          <Input
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            placeholder="PC, PlayStation, Xbox"
          />
        </div>
        <div className="space-y-2">
          <Label>კატეგორია</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Action, RPG, etc."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={formData.is_featured}
          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
        />
        <Label>რჩეული თამაში</Label>
      </div>

      <Button 
        onClick={onSubmit} 
        className="bg-gradient-primary w-full mt-4"
        disabled={saving || !formData.title || !formData.price}
      >
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-display">{t.admin.games}</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ძებნა..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary gap-2">
                <Plus className="h-4 w-4" />
                {t.admin.addGame}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t.admin.addGame}</DialogTitle>
              </DialogHeader>
              <GameForm onSubmit={handleAdd} submitLabel={t.admin.addGame} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>სათაური</TableHead>
                <TableHead>ფასი</TableHead>
                <TableHead>კატეგორია</TableHead>
                <TableHead>პლატფორმა</TableHead>
                <TableHead>სტატუსი</TableHead>
                <TableHead className="text-right">მოქმედებები</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames.map((game) => (
                <TableRow key={game.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {game.image_url && (
                        <img 
                          src={game.image_url} 
                          alt={game.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{getGameTitle(game)}</p>
                        {game.is_featured && (
                          <Badge variant="secondary" className="text-xs mt-1">რჩეული</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">${game.price}</span>
                      {game.original_price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${game.original_price}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{game.category || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {game.platform?.slice(0, 2).map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                      {(game.platform?.length || 0) > 2 && (
                        <Badge variant="secondary" className="text-xs">+{(game.platform?.length || 0) - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={game.is_active ?? true}
                      onCheckedChange={() => toggleActive(game)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(game)}
                        className="hover:bg-primary/20 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(game.id)}
                        className="hover:bg-destructive/20 hover:text-destructive"
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

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="glass max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.admin.editGame}</DialogTitle>
            </DialogHeader>
            <GameForm onSubmit={handleEdit} submitLabel={t.common.save} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
