import { Link, useLocation } from 'react-router-dom';
import { Mail, FileText, Package, BarChart3 } from 'lucide-react';
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
    title: 'Prehľady',
    icon: BarChart3,
    path: '/dashboard',
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1a1a2e] text-white">
      <div className="flex flex-col items-center justify-center border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold tracking-tight">STRADER</h1>
        <p className="text-sm text-gray-400">Agent</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <div className="text-xs text-gray-500">
          <p>© 2024 Strader Agent</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
