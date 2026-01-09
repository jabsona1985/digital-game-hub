import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function GamesSection() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const { data: games, isLoading } = useQuery({
    queryKey: ['featured-games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(142,100%,50%,0.08)_0%,_transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">
              {t.games.title}
            </h2>
            <p className="text-xl text-muted-foreground">{t.games.subtitle}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/games')}
            className="border-primary/50 hover:bg-primary/10 group"
          >
            {t.games.viewAll}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : games && games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GameCard game={game} language={language} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No featured games yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}