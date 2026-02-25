import { Link, useLocation } from 'react-router-dom';
import { Mail, FileText, Package, BarChart3, AlertTriangle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Zákaznícky Agent',
    icon: Mail,
    path: '/',
  },
  {
    title: 'Fakturačný Agent',
    icon: FileText,
    path: '/invoices',
  },
  {
    title: 'Produktový Agent',
    icon: Package,
    path: '/products',
  },
  {
    title: 'Reklamácie',
    icon: AlertTriangle,
    path: '/complaints',
  },
  {
    title: 'Zákazníci',
    icon: Users,
    path: '/customers',
  },
  {
    title: 'Prehľady',
    icon: BarChart3,
    path: '/dashboard',
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col glass-dark border-r border-white/10 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-center border-b border-white/10 p-6 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight gradient-text">Agent</h1>
        <p className="text-sm text-gray-400 font-medium">STRADER</p>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all-smooth relative',
                isActive
                  ? 'glass gradient-bg text-white glow-border shadow-lg'
                  : 'text-gray-300 hover:glass hover:text-white hover:scale-[1.02]'
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-all",
                isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              )} />
              <span>{item.title}</span>
              {isActive && (
                <div className="absolute inset-0 gradient-bg opacity-20 rounded-xl blur-xl -z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 glass">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">© 2024 Strader Agent</p>
          <p className="text-gray-600">v2.0.0 - AI Enhanced</p>
        </div>
      </div>
    </div>
  );
}
