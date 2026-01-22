import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { CreditCard, Lock, ShoppingBag, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [isComplete, setIsComplete] = useState(false);
  const [purchasedKeys, setPurchasedKeys] = useState<Array<{ title: string; key: string }>>([]);

  const processOrder = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      
      const results: Array<{ title: string; key: string }> = [];
      
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          // Find an available key for this game
          const { data: availableKey, error: keyError } = await supabase
            .from('game_keys')
            .select('*')
            .eq('game_id', item.id)
            .eq('is_sold', false)
            .limit(1)
            .maybeSingle();
          
          if (keyError) throw keyError;
          if (!availableKey) throw new Error(`No keys available for ${item.title}`);
          
          // Create the order
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              game_id: item.id,
              game_key_id: availableKey.id,
              amount: item.price,
              status: 'completed',
            })
            .select()
            .single();
          
          if (orderError) throw orderError;
          
          // Mark the key as sold
          const { error: updateError } = await supabase
            .from('game_keys')
            .update({
              is_sold: true,
              sold_to: user.id,
              sold_at: new Date().toISOString(),
            })
            .eq('id', availableKey.id);
          
          if (updateError) throw updateError;
          
          results.push({ title: item.title, key: availableKey.key_value });
        }
      }
      
      return results;
    },
    onSuccess: (keys) => {
      setPurchasedKeys(keys);
      setIsComplete(true);
      clearCart();
      toast.success(t.checkout.orderComplete);
    },
    onError: (error) => {
      console.error('Order error:', error);
      toast.error(t.checkout.orderFailed);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      setFormData(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
      return;
    }
    
    // Format expiry as MM/YY
    if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length >= 2) {
        setFormData(prev => ({ ...prev, [name]: cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: cleaned }));
      }
      return;
    }
    
    // CVV - only numbers, max 4
    if (name === "cvv") {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 4) }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t.checkout.loginRequired);
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      toast.error(t.checkout.emptyCart);
      return;
    }
    
    // Basic validation
    if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
      toast.error(t.checkout.fillAllFields);
      return;
    }
    
    processOrder.mutate();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t.checkout.thankYou}
              </h1>
              <p className="text-muted-foreground mb-8">
                {t.checkout.orderSuccess}
              </p>
              
              {/* Display purchased keys */}
              <div className="text-left space-y-4 mb-8">
                <h2 className="text-xl font-semibold text-foreground">
                  {t.checkout.yourKeys}
                </h2>
                {purchasedKeys.map((item, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="font-mono text-primary text-lg mt-1">{item.key}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/my-keys')}>
                  {t.checkout.viewAllKeys}
                </Button>
                <Button variant="outline" onClick={() => navigate('/games')}>
                  {t.checkout.continueShopping}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t.cart.empty}
          </h1>
          <p className="text-muted-foreground mb-6">{t.cart.emptyHint}</p>
          <Button onClick={() => navigate('/games')}>
            {t.cart.browseGames}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {t.checkout.title}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t.checkout.paymentDetails}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">{t.checkout.cardholderName}</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">{t.checkout.cardNumber}</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">{t.checkout.expiry}</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">{t.checkout.cvv}</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>{t.checkout.securePayment}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={processOrder.isPending}
                  >
                    {processOrder.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.checkout.processing}
                      </>
                    ) : (
                      <>
                        {t.checkout.payNow} ${totalPrice.toFixed(2)}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t.checkout.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          🎮
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cart.subtotal}</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">{t.cart.total}</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
