import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Target,
  Users,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import { api } from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [_summary, setSummary] = useState<any>(null);
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

  const topSalesReps = [
    { 
      name: 'Ján Novák', 
      revenue: 98500, 
      deals: 47, 
      trend: 'up', 
      trendValue: '+12%',
      aiScore: 92,
      aiInsight: 'Vynikajúca výkonnosť, rastúci trend'
    },
    { 
      name: 'Peter Horváth', 
      revenue: 85300, 
      deals: 38, 
      trend: 'up', 
      trendValue: '+8%',
      aiScore: 88,
      aiInsight: 'Stabilný rast, dobrá konverzia'
    },
    { 
      name: 'Mária Kováčová', 
      revenue: 76200, 
      deals: 34, 
      trend: 'down', 
      trendValue: '-5%',
      aiScore: 72,
      aiInsight: 'Klesajúci trend, potrebuje podporu'
    },
    { 
      name: 'Anna Szabó', 
      revenue: 62800, 
      deals: 29, 
      trend: 'up', 
      trendValue: '+15%',
      aiScore: 85,
      aiInsight: 'Rastúci výkon, nový talent'
    },
    { 
      name: 'Tomáš Varga', 
      revenue: 54200, 
      deals: 25, 
      trend: 'stable', 
      trendValue: '+2%',
      aiScore: 78,
      aiInsight: 'Stabilný výkon'
    },
  ];

  const customerRisks = [
    { 
      name: 'StavMat Plus', 
      risk: 'high', 
      reason: 'Klesajúce objednávky (-35%), posledná objednávka pred 45 dňami',
      lastOrder: '12.01.2024',
      value: 45200,
      trend: -35
    },
    { 
      name: 'Elektro Centrum', 
      risk: 'medium', 
      reason: 'Oneskorené platby (priemer 8 dní po splatnosti)',
      lastOrder: '18.02.2024',
      value: 28900,
      trend: -12
    },
    { 
      name: 'ProfiStav s.r.o.', 
      risk: 'medium', 
      reason: '2 reklamácie za posledné 2 mesiace',
      lastOrder: '20.02.2024',
      value: 18400,
      trend: -8
    },
  ];

  const conversionFunnel = [
    { stage: 'Dopyt', count: 70, value: 350000, fill: '#3b82f6' },
    { stage: 'CP', count: 35, value: 245000, fill: '#10b981' },
    { stage: 'Objednávka', count: 20, value: 156000, fill: '#f59e0b' },
    { stage: 'DL', count: 18, value: 142000, fill: '#8b5cf6' },
    { stage: 'FA', count: 18, value: 138000, fill: '#ec4899' },
  ];

  const sentimentData = [
    { name: 'Pozitívny', value: 62, color: '#10b981' },
    { name: 'Neutrálny', value: 31, color: '#f59e0b' },
    { name: 'Negatívny', value: 7, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto glass-dark p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white gradient-text">Prehľady</h1>
        <p className="text-gray-400">Dashboard s AI predikcami a analýzami</p>
      </div>

      {/* Key Metrics */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Dopyty dnes</CardTitle>
            <Mail className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">52</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% oproti včera
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Vytvorené CP</CardTitle>
            <FileText className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">28</div>
            <p className="text-xs text-gray-400">Konverzia 54%</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Priemerný reakčný čas</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12 min</div>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -3 min oproti minulému týždňu
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">AI Aktivita</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">142</div>
            <p className="text-xs text-gray-400">akcií spracovaných dnes</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Prediction Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* AI Revenue Prediction */}
        <Card className="glass-card border-blue-400/30 bg-blue-50/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              AI Predikcia obratu
            </CardTitle>
            <CardDescription className="text-gray-400">Nasledujúci mesiac</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Predikcia</p>
                <p className="text-3xl font-bold text-blue-400">€385,200</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '92%' }} />
                </div>
                <span className="text-xs text-gray-400">92% istota</span>
              </div>
              <div className="text-xs text-gray-400">
                Interval: <span className="text-white">€365K - €405K</span>
              </div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +11% oproti tomuto mesiacu
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Response Time */}
        <Card className="glass-card border-green-400/30 bg-green-50/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              Priemerný reakčný čas
            </CardTitle>
            <CardDescription className="text-gray-400">Posledných 7 dní</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-green-400">12 min</p>
                <p className="text-sm text-gray-400">Dopyt → Odpoveď</p>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">&lt; 10 min</span>
                  <span className="text-green-400 font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">10-30 min</span>
                  <span className="text-yellow-400 font-semibold">38%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">&gt; 30 min</span>
                  <span className="text-red-400 font-semibold">17%</span>
                </div>
              </div>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Výborný výkon!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Sentiment Analysis */}
        <Card className="glass-card border-purple-400/30 bg-purple-50/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              AI Sentiment analýza
            </CardTitle>
            <CardDescription className="text-gray-400">Zákaznícke emaily</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '12px', background: 'rgba(0,0,0,0.8)', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 text-xs mt-2">
              {sentimentData.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-gray-300">{s.name}</span>
                  </div>
                  <span className="font-semibold text-white">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Sales Reps Performance & Customer Risks */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {/* AI Sales Reps */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              AI Výkonnosť OZ
            </CardTitle>
            <CardDescription className="text-gray-400">
              AI deteguje trendy a výkonnosť obchodníkov
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSalesReps.map((rep, idx) => (
                <div key={idx} className="rounded-xl glass-card border-white/10 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full font-bold",
                        idx === 0 && "bg-yellow-500/20 text-yellow-400",
                        idx === 1 && "bg-gray-400/20 text-gray-400",
                        idx === 2 && "bg-orange-500/20 text-orange-400",
                        idx > 2 && "bg-blue-500/20 text-blue-400"
                      )}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{rep.name}</p>
                        <p className="text-xs text-gray-400">{rep.deals} obchodov</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-400">{formatCurrency(rep.revenue)}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {rep.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                        {rep.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-400" />}
                        <span className={cn(
                          rep.trend === 'up' && 'text-green-400',
                          rep.trend === 'down' && 'text-red-400',
                          rep.trend === 'stable' && 'text-gray-400'
                        )}>{rep.trendValue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          rep.aiScore > 85 ? 'bg-green-500' :
                          rep.aiScore > 75 ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                        style={{ width: `${rep.aiScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{rep.aiScore}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-blue-400" />
                    {rep.aiInsight}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Customer Risks */}
        <Card className="glass-card border-red-400/30 bg-red-50/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              AI Zákaznícke riziká
            </CardTitle>
            <CardDescription className="text-gray-400">
              AI identifikuje zákazníkov s rizikom odchodu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerRisks.map((risk, idx) => (
                <div key={idx} className={cn(
                  "rounded-xl glass-card border p-3 space-y-2",
                  risk.risk === 'high' && 'border-red-400/50 bg-red-50/10',
                  risk.risk === 'medium' && 'border-orange-400/50 bg-orange-50/10'
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{risk.name}</p>
                        <Badge className={cn(
                          risk.risk === 'high' && 'bg-red-500/20 text-red-400 border-red-400',
                          risk.risk === 'medium' && 'bg-orange-500/20 text-orange-400 border-orange-400'
                        )}>
                          {risk.risk === 'high' ? 'Vysoké riziko' : 'Stredné riziko'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{risk.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posledná obj.: {risk.lastOrder} | Obrat: {formatCurrency(risk.value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-semibold",
                        risk.trend < 0 ? 'text-red-400' : 'text-green-400'
                      )}>
                        {risk.trend < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                        {risk.trend}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10 text-xs text-gray-400">
                <p className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                  AI odporúča: Kontaktovať zákazníkov s personalizovanou ponukou
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <div className="mb-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Konverzný lievik
            </CardTitle>
            <CardDescription className="text-gray-400">
              Prehľad obchodného procesu od dopytu po faktúru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                  <Tooltip 
                    contentStyle={{ fontSize: '12px', background: 'rgba(0,0,0,0.8)', border: 'none' }}
                    formatter={(value: any, name: string) => [name === 'value' ? formatCurrency(value) : value, name === 'value' ? 'Hodnota' : 'Počet']}
                  />
                  <Funnel dataKey="count" data={conversionFunnel} isAnimationActive>
                    <LabelList position="center" fill="#fff" stroke="none" dataKey="stage" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {conversionFunnel.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: stage.fill }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{stage.stage}</p>
                        <p className="text-sm text-gray-400">{stage.count}</p>
                      </div>
                      <p className="text-xs text-gray-400">{formatCurrency(stage.value)}</p>
                    </div>
                    {idx < conversionFunnel.length - 1 && (
                      <div className="text-xs text-gray-400">
                        {Math.round((conversionFunnel[idx + 1].count / stage.count) * 100)}%
                        <ArrowRight className="h-3 w-3 inline ml-1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Obrat tento mesiac</CardTitle>
            <CardDescription className="text-gray-400">Denný obrat za posledných 30 dní</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-3xl font-bold text-blue-400">€347,520</p>
              <p className="text-sm text-green-400 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +18% oproti minulému mesiacu
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" style={{ fontSize: '12px', fill: '#9ca3af' }} />
                <YAxis style={{ fontSize: '12px', fill: '#9ca3af' }} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{ fontSize: '12px', background: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Neuhradené faktúry</CardTitle>
          <CardDescription className="text-gray-400">Prehľad podľa splatnosti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl glass p-4 border border-white/10">
              <p className="text-sm text-gray-400">Celkom neuhradené</p>
              <p className="text-2xl font-bold text-white">€124,580</p>
            </div>
            <div className="rounded-xl glass p-4 border border-green-400/30 bg-green-50/5">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>V lehote</span>
              </div>
              <p className="text-2xl font-bold text-green-400">€98,420</p>
            </div>
            <div className="rounded-xl glass p-4 border border-yellow-400/30 bg-yellow-50/5">
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <Clock className="h-4 w-4" />
                <span>1-7 dní po splatnosti</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">€18,900</p>
            </div>
            <div className="rounded-xl glass p-4 border border-red-400/30 bg-red-50/5">
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Viac ako 7 dní</span>
              </div>
              <p className="text-2xl font-bold text-red-400">€7,260</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
