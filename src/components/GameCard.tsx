import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  title_ge?: string | null;
  title_ru?: string | null;
  description?: string | null;
  description_ge?: string | null;
  description_ru?: string | null;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  category?: string | null;
  platform?: string[] | null;
  rating?: number | null;
}

interface GameCardProps {
  game: Game;
  language: Language;
}

export function GameCard({ game, language }: GameCardProps) {
  const { t } = useLanguage();

  const getLocalizedTitle = () => {
    if (language === 'ge' && game.title_ge) return game.title_ge;
    if (language === 'ru' && game.title_ru) return game.title_ru;
    return game.title;
  };

  const discount = game.original_price 
    ? Math.round((1 - game.price / game.original_price) * 100)
    : null;

  const platformIcons: Record<string, string> = {
    steam: '🎮',
    epic: '🎯',
    origin: '⚡',
    uplay: '🎲',
    gog: '🌟',
    xbox: '🎯',
    playstation: '🎮',
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden glass neon-border hover:scale-[1.02] transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {game.image_url ? (
          <img
            src={game.image_url}
            alt={getLocalizedTitle()}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary opacity-50 flex items-center justify-center">
            <span className="text-4xl">🎮</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discount && discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground font-bold">
            -{discount}%
          </Badge>
        )}

        {/* Rating */}
        {game.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{game.rating}</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Platforms */}
        <div className="flex items-center justify-between mb-2">
          {game.category && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {game.category}
            </span>
          )}
          {game.platform && game.platform.length > 0 && (
            <div className="flex gap-1">
              {game.platform.slice(0, 3).map((p) => (
                <span key={p} title={p} className="text-sm">
                  {platformIcons[p.toLowerCase()] || '🎮'}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg mb-3 line-clamp-1 group-hover:text-primary transition-colors">
          {getLocalizedTitle()}
        </h3>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-secondary">
              ${Number(game.price).toFixed(2)}
            </span>
            {game.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                ${Number(game.original_price).toFixed(2)}
              </span>
            )}
          </div>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90 glow-primary">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}