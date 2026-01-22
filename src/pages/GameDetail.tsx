import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, ArrowLeft, Star, Zap, Shield, Clock } from "lucide-react";
import { toast } from "sonner";

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const { data: game, isLoading, error } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: availableKeys } = useQuery({
    queryKey: ['game-keys-count', id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('game_keys')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', id)
        .eq('is_sold', false);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!id,
  });

  const getLocalizedTitle = () => {
    if (!game) return '';
    if (language === 'ge' && game.title_ge) return game.title_ge;
    if (language === 'ru' && game.title_ru) return game.title_ru;
    return game.title;
  };

  const getLocalizedDescription = () => {
    if (!game) return '';
    if (language === 'ge' && game.description_ge) return game.description_ge;
    if (language === 'ru' && game.description_ru) return game.description_ru;
    return game.description || '';
  };

  const handleAddToCart = () => {
    if (game && availableKeys && availableKeys > 0) {
      addToCart({
        id: game.id,
        title: getLocalizedTitle(),
        price: game.price,
        image_url: game.image_url,
      });
      toast.success(t.cart.addedToCart);
    }
  };

  const handleBuyNow = () => {
    if (game && availableKeys && availableKeys > 0) {
      addToCart({
        id: game.id,
        title: getLocalizedTitle(),
        price: game.price,
        image_url: game.image_url,
      });
      // Open cart sidebar
      document.dispatchEvent(new CustomEvent('open-cart'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-video rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t.common.error}
          </h1>
          <Button onClick={() => navigate('/games')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.gameDetail.backToGames}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = !availableKeys || availableKeys === 0;
  const hasDiscount = game.original_price && game.original_price > game.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - game.price / game.original_price!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/games')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.gameDetail.backToGames}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Game Image */}
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img
                src={game.image_url || '/placeholder.svg'}
                alt={getLocalizedTitle()}
                className="w-full h-full object-cover"
              />
            </div>
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-lg px-3 py-1">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {getLocalizedTitle()}
              </h1>
              {game.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-medium text-foreground">
                    {game.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Category & Platforms */}
            <div className="flex flex-wrap gap-2">
              {game.category && (
                <Badge variant="secondary">{game.category}</Badge>
              )}
              {game.platform?.map((platform) => (
                <Badge key={platform} variant="outline">
                  {platform}
                </Badge>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ${game.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  ${game.original_price!.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <Badge variant="destructive">{t.games.outOfStock}</Badge>
              ) : (
                <Badge variant="default" className="bg-green-600">
                  {t.gameDetail.inStock} ({availableKeys} {t.gameDetail.keysAvailable})
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <Zap className="w-5 h-5 mr-2" />
                {t.games.buyNow}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t.games.addToCart}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.features.instant.title}</p>
                  <p className="text-sm text-muted-foreground">{t.gameDetail.instantDeliveryDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.features.secure.title}</p>
                  <p className="text-sm text-muted-foreground">{t.gameDetail.securePaymentDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.features.support.title}</p>
                  <p className="text-sm text-muted-foreground">{t.gameDetail.supportDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {getLocalizedDescription() && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {t.gameDetail.description}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {getLocalizedDescription()}
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GameDetail;
