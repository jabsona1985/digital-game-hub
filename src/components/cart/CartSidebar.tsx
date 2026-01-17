import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartSidebar() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getLocalizedTitle = (item: typeof items[0]) => {
    if (language === 'ge' && item.title_ge) return item.title_ge;
    if (language === 'ru' && item.title_ru) return item.title_ru;
    return item.title;
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md glass border-l border-border/50 flex flex-col">
        <SheetHeader className="border-b border-border/50 pb-4">
          <SheetTitle className="font-display flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {t.cart?.title || 'Shopping Cart'}
            {totalItems > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {totalItems} {t.cart?.items || 'items'}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              {t.cart?.empty || 'Your cart is empty'}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {t.cart?.emptyHint || 'Add some games to get started'}
            </p>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate('/games');
              }}
              className="bg-gradient-primary"
            >
              {t.cart?.browseGames || 'Browse Games'}
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 py-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 py-4 border-b border-border/30 last:border-0"
                  >
                    {/* Image */}
                    <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={getLocalizedTitle(item)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-primary opacity-50 flex items-center justify-center">
                          <span className="text-xl">🎮</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1 mb-1">
                        {getLocalizedTitle(item)}
                      </h4>
                      <p className="text-secondary font-semibold">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <SheetFooter className="border-t border-border/50 pt-4 flex-col gap-4">
              {/* Totals */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t.cart?.subtotal || 'Subtotal'}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg">
                  <span>{t.cart?.total || 'Total'}</span>
                  <span className="text-secondary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t.cart?.clear || 'Clear'}
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-gradient-primary glow-primary"
                >
                  {t.cart?.checkout || 'Checkout'}
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
