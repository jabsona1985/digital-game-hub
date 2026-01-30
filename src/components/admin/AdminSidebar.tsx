import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Gamepad2,
  Key,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

const menuItems = [
  { 
    title: 'dashboard', 
    url: '/admin', 
    icon: LayoutDashboard,
    labelKey: 'dashboard' 
  },
  { 
    title: 'games', 
    url: '/admin/games', 
    icon: Gamepad2,
    labelKey: 'games' 
  },
  { 
    title: 'keys', 
    url: '/admin/keys', 
    icon: Key,
    labelKey: 'keys' 
  },
  { 
    title: 'orders', 
    url: '/admin/orders', 
    icon: ShoppingCart,
    labelKey: 'orders' 
  },
  { 
    title: 'users', 
    url: '/admin/users', 
    icon: Users,
    labelKey: 'users' 
  },
  { 
    title: 'analytics', 
    url: '/admin/analytics', 
    icon: BarChart3,
    labelKey: 'analytics' 
  },
];

const adminLabels: Record<string, { en: string; ge: string; ru: string }> = {
  dashboard: { en: 'Dashboard', ge: 'მთავარი', ru: 'Панель' },
  games: { en: 'Games', ge: 'თამაშები', ru: 'Игры' },
  keys: { en: 'Keys', ge: 'გასაღებები', ru: 'Ключи' },
  orders: { en: 'Orders', ge: 'შეკვეთები', ru: 'Заказы' },
  users: { en: 'Users', ge: 'მომხმარებლები', ru: 'Пользователи' },
  analytics: { en: 'Analytics', ge: 'ანალიტიკა', ru: 'Аналитика' },
  settings: { en: 'Settings', ge: 'პარამეტრები', ru: 'Настройки' },
  menu: { en: 'Menu', ge: 'მენიუ', ru: 'Меню' },
  adminPanel: { en: 'Admin Panel', ge: 'ადმინ პანელი', ru: 'Панель администратора' },
};

export function AdminSidebar() {
  const { state } = useSidebar();
  const { language } = useLanguage();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const getLabel = (key: string) => {
    return adminLabels[key]?.[language] || adminLabels[key]?.en || key;
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar
      className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r border-border/50 bg-card/50 backdrop-blur-xl`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary glow-primary">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg text-gradient-primary">
              {getLabel('adminPanel')}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
              {getLabel('menu')}
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={`
                      transition-all duration-200 rounded-lg mb-1
                      ${isActive(item.url) 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <item.icon className={`h-5 w-5 ${isActive(item.url) ? 'text-primary' : ''}`} />
                      {!collapsed && (
                        <span className="font-medium">{getLabel(item.labelKey)}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
