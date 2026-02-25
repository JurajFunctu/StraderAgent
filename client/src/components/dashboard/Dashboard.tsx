import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Package,
  FileText,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, summaryData] = await Promise.all([
        api.getDashboardStats(),
        api.getDashboardSummary(),
      ]);
      setStats(statsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process stats data
  const revenueData = stats
    .filter((s) => s.metric === 'daily_revenue')
    .slice(-30)
    .map((s) => ({
      date: new Date(s.date).toLocaleDateString('sk-SK', { month: 'short', day: 'numeric' }),
      revenue: parseFloat(s.value),
    }));

  const conversionData = stats
    .filter((s) => s.metric === 'daily_conversion')
    .slice(-7)
    .map((s) => ({
      date: new Date(s.date).toLocaleDateString('sk-SK', { weekday: 'short' }),
      conversion: parseFloat(s.value),
    }));

  const topSalesReps = [
    { name: 'Ján Novák', revenue: 98500, deals: 47 },
    { name: 'Peter Horváth', revenue: 85300, deals: 38 },
    { name: 'Mária Kováčová', revenue: 76200, deals: 34 },
    { name: 'Anna Szabó', revenue: 62800, deals: 29 },
    { name: 'Tomáš Varga', revenue: 54200, deals: 25 },
  ];

  const topCustomers = [
    { name: 'HagardHal s.r.o.', revenue: 124500 },
    { name: 'TechnoEnergia a.s.', revenue: 98200 },
    { name: 'ProfiStav s.r.o.', revenue: 87600 },
    { name: 'Elektro Centrum', revenue: 65400 },
    { name: 'StavMat Plus', revenue: 52300 },
  ];

  const pipelineData = [
    { stage: 'Dopyt', count: 52, value: 245000 },
    { stage: 'CP', count: 28, value: 156000 },
    { stage: 'Objednávka', count: 18, value: 98000 },
    { stage: 'DL', count: 12, value: 72000 },
    { stage: 'FA', count: 8, value: 52000 },
  ];

  const stockStatus = [
    { name: 'Pod minimom', value: 12, color: '#ef4444' },
    { name: 'Nízky stav', value: 28, color: '#f59e0b' },
    { name: 'Optimálny', value: 156, color: '#10b981' },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Prehľady</h1>
        <p className="text-gray-600">Dashboard a štatistiky</p>
      </div>

      {/* Key Metrics */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dopyty dnes</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">+12% oproti včera</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vytvorené CP</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Konverzia 54%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priemerný čas reakcie</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 min</div>
            <p className="text-xs text-muted-foreground">-3 min oproti minulému týždňu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Aktivita</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">akcií spracovaných dnes</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Obrat tento mesiac</CardTitle>
            <CardDescription>Denný obrat za posledných 30 dní</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-3xl font-bold text-blue-600">€347,520</p>
              <p className="text-sm text-gray-600">+18% oproti minulému mesiacu</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konverzia dopytov</CardTitle>
            <CardDescription>Percentuálna konverzia za posledných 7 dní</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-3xl font-bold text-green-600">54%</p>
              <p className="text-sm text-gray-600">Priemerná konverzia</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: any) => `${value}%`}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="conversion" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Reps & Customers */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top obchodníci</CardTitle>
            <CardDescription>Rebríček podľa obratu tento mesiac</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSalesReps.map((rep, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{rep.name}</p>
                      <p className="text-xs text-gray-600">{rep.deals} obchodov</p>
                    </div>
                  </div>
                  <p className="font-bold text-blue-600">{formatCurrency(rep.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top zákazníci</CardTitle>
            <CardDescription>Rebríček podľa obratu tento mesiac</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
                      {idx + 1}
                    </div>
                    <p className="font-semibold">{customer.name}</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(customer.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline & Stock */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
            <CardDescription>Prehľad obchodného procesu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" style={{ fontSize: '12px' }} />
                <YAxis dataKey="stage" type="category" width={100} style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: any, name: string) =>
                    name === 'value' ? formatCurrency(value) : value
                  }
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" name="Počet" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stav skladu</CardTitle>
            <CardDescription>Rozloženie skladových zásob</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {stockStatus.map((status, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span>{status.name}</span>
                  </div>
                  <span className="font-semibold">{status.value} produktov</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Neuhradené faktúry</CardTitle>
          <CardDescription>Prehľad podľa splatnosti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Celkom neuhradené</p>
              <p className="text-2xl font-bold text-gray-900">€124,580</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>V lehote</span>
              </div>
              <p className="text-2xl font-bold text-green-600">€98,420</p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <Clock className="h-4 w-4" />
                <span>1-7 dní po splatnosti</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">€18,900</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Viac ako 7 dní</span>
              </div>
              <p className="text-2xl font-bold text-red-600">€7,260</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
