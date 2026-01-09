import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Gamepad2, Github, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-primary glow-primary">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gradient-primary">
                GameVault
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Your trusted source for digital game keys. Instant delivery, secure payments, and unbeatable prices.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.games}
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.deals}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.nav.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          © {currentYear} GameVault. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}