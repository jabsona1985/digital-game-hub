import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Zap, Shield, Headphones, BadgeDollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t.features.instant.title,
      description: t.features.instant.description,
      color: 'primary',
    },
    {
      icon: Shield,
      title: t.features.secure.title,
      description: t.features.secure.description,
      color: 'secondary',
    },
    {
      icon: Headphones,
      title: t.features.support.title,
      description: t.features.support.description,
      color: 'accent',
    },
    {
      icon: BadgeDollarSign,
      title: t.features.prices.title,
      description: t.features.prices.description,
      color: 'primary',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary glow-primary';
      case 'secondary':
        return 'bg-secondary/10 text-secondary glow-secondary';
      case 'accent':
        return 'bg-accent/10 text-accent glow-accent';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(270,100%,60%,0.1)_0%,_transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t.features.title}
          </h2>
          <p className="text-xl text-muted-foreground">{t.features.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl glass neon-border hover:scale-105 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${getColorClasses(feature.color)}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}