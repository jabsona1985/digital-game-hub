import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/GameCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

const PLATFORMS = ['Steam', 'Epic', 'Origin', 'Uplay', 'GOG', 'Xbox', 'PlayStation'];
const CATEGORIES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Simulation', 'Indie', 'Horror'];

export default function Games() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: games, isLoading } = useQuery({
    queryKey: ['all-games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  const filteredGames = useMemo(() => {
    if (!games) return [];

    let result = [...games];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((game) => {
        const title = language === 'ge' && game.title_ge 
          ? game.title_ge 
          : language === 'ru' && game.title_ru 
            ? game.title_ru 
            : game.title;
        return title.toLowerCase().includes(query);
      });
    }

    // Platform filter
    if (selectedPlatforms.length > 0) {
      result = result.filter((game) =>
        game.platform?.some((p: string) =>
          selectedPlatforms.map(sp => sp.toLowerCase()).includes(p.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((game) =>
        selectedCategories.map(c => c.toLowerCase()).includes(game.category?.toLowerCase() || '')
      );
    }

    // Price filter
    result = result.filter(
      (game) => game.price >= priceRange[0] && game.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [games, searchQuery, selectedPlatforms, selectedCategories, priceRange, sortBy, language]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPlatforms([]);
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSortBy('newest');
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedPlatforms.length > 0 || 
    selectedCategories.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 100;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Platforms */}
      <div>
        <h3 className="font-display font-semibold mb-3 text-foreground">
          {t.gamesPage?.platforms || 'Platforms'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <Badge
              key={platform}
              variant={selectedPlatforms.includes(platform) ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                selectedPlatforms.includes(platform)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-primary/20'
              }`}
              onClick={() => togglePlatform(platform)}
            >
              {platform}
            </Badge>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold mb-3 text-foreground">
          {t.gamesPage?.categories || 'Categories'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                selectedCategories.includes(category)
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-secondary/20'
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold mb-3 text-foreground">
          {t.gamesPage?.priceRange || 'Price Range'}
        </h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            min={0}
            max={100}
            step={5}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <X className="h-4 w-4 mr-2" />
          {t.gamesPage?.clearFilters || 'Clear Filters'}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t.gamesPage?.title || 'All Games'}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.gamesPage?.subtitle || 'Discover your next favorite game from our collection'}
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.common?.search || 'Search games...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border/50 focus:border-primary"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-card border-border/50">
                <SelectValue placeholder={t.gamesPage?.sortBy || 'Sort by'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.gamesPage?.sortNewest || 'Newest'}</SelectItem>
                <SelectItem value="price-low">{t.gamesPage?.sortPriceLow || 'Price: Low to High'}</SelectItem>
                <SelectItem value="price-high">{t.gamesPage?.sortPriceHigh || 'Price: High to Low'}</SelectItem>
                <SelectItem value="name">{t.gamesPage?.sortName || 'Name'}</SelectItem>
                <SelectItem value="rating">{t.gamesPage?.sortRating || 'Rating'}</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden border-border/50">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  {t.gamesPage?.filters || 'Filters'}
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">
                      {selectedPlatforms.length + selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card">
                <SheetHeader>
                  <SheetTitle className="font-display">{t.gamesPage?.filters || 'Filters'}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block w-64 shrink-0"
            >
              <div className="glass rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="font-display font-semibold text-lg">{t.gamesPage?.filters || 'Filters'}</h2>
                </div>
                <FilterContent />
              </div>
            </motion.aside>

            {/* Games Grid */}
            <div className="flex-1">
              {/* Results count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {isLoading 
                    ? t.common?.loading 
                    : `${filteredGames.length} ${t.gamesPage?.gamesFound || 'games found'}`}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t.gamesPage?.clearFilters || 'Clear'}
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden">
                      <Skeleton className="aspect-[16/10] w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-9 w-9 rounded-md" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredGames.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * Math.min(index, 5) }}
                    >
                      <GameCard game={game} language={language} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {t.common?.noResults || 'No games found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t.gamesPage?.noResultsHint || 'Try adjusting your filters or search query'}
                  </p>
                  <Button onClick={clearFilters} className="bg-gradient-primary">
                    {t.gamesPage?.clearFilters || 'Clear Filters'}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
