import { useState } from 'react';
import { Users, Building2, Mail, Phone, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, CreditCard, DollarSign, Package, FileText, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Customer {
  id: number;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  segment: 'VIP' | 'Štandardný' | 'Nový' | 'Rizikový';
  aiScore: number;
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: string;
  lastContactedDate: string;
  creditTerms: number;
  discount: number;
  paymentBehavior: 'excellent' | 'good' | 'delayed';
  orderFrequency: 'high' | 'medium' | 'low';
  finstatHealth: 'green' | 'yellow' | 'red';
  finstatScore: number;
  recentOrders: Array<{
    number: string;
    date: string;
    amount: number;
    status: string;
  }>;
  aiInsights: string[];
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    company: 'HagardHal s.r.o.',
    contactPerson: 'Ján Horák',
    email: 'j.horak@hagardhal.sk',
    phone: '+421 905 123 456',
    segment: 'VIP',
    aiScore: 95,
    totalOrders: 47,
    totalRevenue: 287500,
    lastOrderDate: '2024-02-18',
    lastContactedDate: '2024-02-20',
    creditTerms: 30,
    discount: 8.5,
    paymentBehavior: 'excellent',
    orderFrequency: 'high',
    finstatHealth: 'green',
    finstatScore: 92,
    recentOrders: [
      { number: 'OBJ-2024-0156', date: '2024-02-18', amount: 3847.50, status: 'delivered' },
      { number: 'OBJ-2024-0142', date: '2024-02-05', amount: 5620.00, status: 'delivered' },
      { number: 'OBJ-2024-0128', date: '2024-01-22', amount: 4280.00, status: 'delivered' },
    ],
    aiInsights: [
      'Vynikajúci zákazník s pravidelným rastúcim obratom',
      'Vždy platí včas, žiadne platobné problémy',
      'Odporúčame ponúknuť prémiové služby alebo VIP benefity',
      'Posledný kontakt bol pred 5 dňami - dobré načasovanie'
    ]
  },
  {
    id: 2,
    company: 'TechnoEnergia a.s.',
    contactPerson: 'Peter Szabó',
    email: 'p.szabo@technoenergia.sk',
    phone: '+421 911 234 567',
    segment: 'Štandardný',
    aiScore: 82,
    totalOrders: 23,
    totalRevenue: 156800,
    lastOrderDate: '2024-02-10',
    lastContactedDate: '2024-02-11',
    creditTerms: 14,
    discount: 5.0,
    paymentBehavior: 'good',
    orderFrequency: 'medium',
    finstatHealth: 'green',
    finstatScore: 88,
    recentOrders: [
      { number: 'OBJ-2024-0145', date: '2024-02-10', amount: 4560.00, status: 'delivered' },
      { number: 'OBJ-2024-0118', date: '2024-01-15', amount: 8920.00, status: 'delivered' },
    ],
    aiInsights: [
      'Stabilný zákazník s dobrou platobnou morálkou',
      'Preferuje prípojnicové systémy',
      'Potenciál na zvýšenie obratu - ponúknuť komplexné riešenia',
      'Posledný kontakt bol pred 14 dňami - vhodné načasovanie pre follow-up'
    ]
  },
  {
    id: 3,
    company: 'StavMat Plus',
    contactPerson: 'Mária Vargová',
    email: 'm.vargova@stavmatplus.sk',
    phone: '+421 903 345 678',
    segment: 'Rizikový',
    aiScore: 45,
    totalOrders: 12,
    totalRevenue: 78400,
    lastOrderDate: '2024-01-10',
    lastContactedDate: '2023-12-28',
    creditTerms: 30,
    discount: 3.0,
    paymentBehavior: 'delayed',
    orderFrequency: 'low',
    finstatHealth: 'yellow',
    finstatScore: 62,
    recentOrders: [
      { number: 'OBJ-2024-0008', date: '2024-01-10', amount: 2840.00, status: 'delivered' },
      { number: 'OBJ-2023-0289', date: '2023-12-15', amount: 5120.00, status: 'delivered' },
    ],
    aiInsights: [
      '⚠️ Rizikový zákazník - klesajúci obrat (-35%)',
      '⚠️ Posledná objednávka pred 45 dňami',
      '⚠️ Oneskorené platby (priemer 12 dní po splatnosti)',
      '❗ Urgentne kontaktovať s personalizovanou ponukou',
      'FinStat ukazuje zhoršujúcu sa finančnú situáciu'
    ]
  },
  {
    id: 4,
    company: 'ProfiStav s.r.o.',
    contactPerson: 'Anna Kováčová',
    email: 'a.kovacova@profistav.sk',
    phone: '+421 907 456 789',
    segment: 'Štandardný',
    aiScore: 68,
    totalOrders: 18,
    totalRevenue: 94200,
    lastOrderDate: '2024-02-20',
    lastContactedDate: '2024-02-21',
    creditTerms: 30,
    discount: 4.0,
    paymentBehavior: 'good',
    orderFrequency: 'medium',
    finstatHealth: 'green',
    finstatScore: 85,
    recentOrders: [
      { number: 'OBJ-2024-0153', date: '2024-02-20', amount: 3280.00, status: 'processing' },
      { number: 'OBJ-2024-0132', date: '2024-01-28', amount: 6540.00, status: 'delivered' },
    ],
    aiInsights: [
      'Stabilný zákazník s miernym poklesom obratu (-8%)',
      'Dve reklamácie za posledné 2 mesiace - potreba zvýšenej pozornosti',
      'Odporúčame follow-up po doručení aktuálnej objednávky',
      'Potenciál na zlepšenie spokojnosti'
    ]
  },
  {
    id: 5,
    company: 'Elektro Centrum',
    contactPerson: 'Tomáš Novotný',
    email: 't.novotny@elektrocentrum.sk',
    phone: '+421 915 567 890',
    segment: 'Nový',
    aiScore: 72,
    totalOrders: 5,
    totalRevenue: 28900,
    lastOrderDate: '2024-02-15',
    lastContactedDate: '2024-02-16',
    creditTerms: 14,
    discount: 2.0,
    paymentBehavior: 'good',
    orderFrequency: 'medium',
    finstatHealth: 'green',
    finstatScore: 78,
    recentOrders: [
      { number: 'OBJ-2024-0148', date: '2024-02-15', amount: 7840.00, status: 'delivered' },
      { number: 'OBJ-2024-0125', date: '2024-01-20', amount: 4560.00, status: 'delivered' },
    ],
    aiInsights: [
      'Nový zákazník s dobrým potenciálom',
      'Rastúca frekvencia objednávok',
      'Odporúčame ponúknuť rozšírené platobné podmienky',
      'Dobré načasovanie na building relationship'
    ]
  },
];

export function CRMAgent() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState<string>('all');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = filterSegment === 'all' || c.segment === filterSegment;
    return matchesSearch && matchesSegment;
  });

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return 'bg-purple-500/20 text-purple-400 border-purple-400';
      case 'Štandardný':
        return 'bg-blue-500/20 text-blue-400 border-blue-400';
      case 'Nový':
        return 'bg-green-500/20 text-green-400 border-green-400';
      case 'Rizikový':
        return 'bg-red-500/20 text-red-400 border-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFinstatBadge = (health: string, score: number) => {
    switch (health) {
      case 'green':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Zdravé ({score})
          </Badge>
        );
      case 'yellow':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Stredné ({score})
          </Badge>
        );
      case 'red':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Riziko ({score})
          </Badge>
        );
    }
  };

  const getPaymentBadge = (behavior: string) => {
    switch (behavior) {
      case 'excellent':
        return <Badge className="bg-green-500/20 text-green-400">Vynikajúce</Badge>;
      case 'good':
        return <Badge className="bg-blue-500/20 text-blue-400">Dobré</Badge>;
      case 'delayed':
        return <Badge className="bg-red-500/20 text-red-400">Oneskorené</Badge>;
    }
  };

  const daysWithoutContact = (lastContactedDate: string) => {
    const days = Math.floor((Date.now() - new Date(lastContactedDate).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const segmentCounts = {
    all: customers.length,
    VIP: customers.filter(c => c.segment === 'VIP').length,
    Štandardný: customers.filter(c => c.segment === 'Štandardný').length,
    Nový: customers.filter(c => c.segment === 'Nový').length,
    Rizikový: customers.filter(c => c.segment === 'Rizikový').length,
  };

  return (
    <div className="flex h-screen glass-dark">
      {/* Customer List */}
      <div className="w-96 border-r border-white/10 glass-dark backdrop-blur-xl flex flex-col">
        <div className="border-b border-white/10 p-4 glass">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Zákazníci
          </h2>
          <p className="text-sm text-gray-400">{filteredCustomers.length} zákazníkov</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <Input
            placeholder="Hľadať zákazníka..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-card border-white/10 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Segment Filters */}
        <div className="p-4 border-b border-white/10 space-y-2">
          <button
            onClick={() => setFilterSegment('all')}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-all-smooth',
              filterSegment === 'all' ? 'gradient-bg text-white' : 'glass-card border-white/10 text-gray-300 hover:text-white'
            )}
          >
            Všetci ({segmentCounts.all})
          </button>
          {['VIP', 'Štandardný', 'Nový', 'Rizikový'].map(seg => (
            <button
              key={seg}
              onClick={() => setFilterSegment(seg)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-all-smooth',
                filterSegment === seg ? 'gradient-bg text-white' : 'glass-card border-white/10 text-gray-300 hover:text-white'
              )}
            >
              {seg} ({segmentCounts[seg as keyof typeof segmentCounts]})
            </button>
          ))}
        </div>

        {/* Customer Cards */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredCustomers.map((customer) => {
            const daysSinceContact = daysWithoutContact(customer.lastContactedDate);
            return (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={cn(
                  'w-full rounded-xl border p-4 text-left transition-all-smooth glass-card',
                  selectedCustomer?.id === customer.id && 'gradient-bg glow-border scale-[1.02]'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{customer.company}</span>
                  <Badge className={getSegmentColor(customer.segment)}>{customer.segment}</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">{customer.contactPerson}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">AI Score</p>
                    <p className={cn("text-lg font-bold", getScoreColor(customer.aiScore))}>{customer.aiScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Obrat</p>
                    <p className="text-sm font-bold text-blue-400">{formatCurrency(customer.totalRevenue)}</p>
                  </div>
                </div>
                {daysSinceContact > 30 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
                    <AlertTriangle className="h-3 w-3" />
                    Naposledy kontaktovaný pred {daysSinceContact} dňami
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Detail */}
      <div className="flex-1 overflow-y-auto glass p-6">
        {selectedCustomer ? (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{selectedCustomer.company}</h1>
                <div className="flex items-center gap-3">
                  <Badge className={getSegmentColor(selectedCustomer.segment)}>
                    {selectedCustomer.segment}
                  </Badge>
                  {getFinstatBadge(selectedCustomer.finstatHealth, selectedCustomer.finstatScore)}
                  {getPaymentBadge(selectedCustomer.paymentBehavior)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">AI Customer Score</p>
                <div className="flex items-center gap-2">
                  <p className={cn("text-4xl font-bold", getScoreColor(selectedCustomer.aiScore))}>
                    {selectedCustomer.aiScore}
                  </p>
                  <Target className={cn("h-8 w-8", getScoreColor(selectedCustomer.aiScore))} />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Kontaktná osoba</p>
                      <p className="font-semibold text-white">{selectedCustomer.contactPerson}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="font-semibold text-white text-sm">{selectedCustomer.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Phone className="h-8 w-8 text-purple-400" />
                    <div>
                      <p className="text-xs text-gray-400">Telefón</p>
                      <p className="font-semibold text-white">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Naposledy kontaktovaný</p>
                      <p className="font-semibold text-white text-sm">
                        {daysWithoutContact(selectedCustomer.lastContactedDate)} dní
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Celkom objednávok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{selectedCustomer.totalOrders}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Frekvencia: <span className="text-white">{selectedCustomer.orderFrequency === 'high' ? 'Vysoká' : selectedCustomer.orderFrequency === 'medium' ? 'Stredná' : 'Nízka'}</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Celkový obrat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-400">{formatCurrency(selectedCustomer.totalRevenue)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Zľava: <span className="text-green-400">{selectedCustomer.discount}%</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Platobné podmienky
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{selectedCustomer.creditTerms} dní</p>
                  <div className="mt-1">
                    {getPaymentBadge(selectedCustomer.paymentBehavior)}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Posledná objednávka
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-white">{formatDate(selectedCustomer.lastOrderDate)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.floor((Date.now() - new Date(selectedCustomer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))} dní
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="glass-card border-blue-400/30 bg-blue-50/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  AI Insights & Odporúčania
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI analyzuje správanie a históriu zákazníka
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedCustomer.aiInsights.map((insight, idx) => (
                    <div key={idx} className={cn(
                      "flex items-start gap-3 p-3 rounded-lg glass border",
                      insight.includes('⚠️') || insight.includes('❗') 
                        ? 'border-red-400/30 bg-red-50/5' 
                        : 'border-white/10'
                    )}>
                      {insight.includes('⚠️') || insight.includes('❗') ? (
                        <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm text-gray-300">{insight.replace(/⚠️|❗/g, '').trim()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Posledné objednávky</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="glass-card border-white/10">
                    <TabsTrigger value="orders">Objednávky</TabsTrigger>
                    <TabsTrigger value="history">História</TabsTrigger>
                  </TabsList>
                  <TabsContent value="orders" className="space-y-2 mt-4">
                    {selectedCustomer.recentOrders.map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between glass border border-white/10 rounded-lg p-3">
                        <div>
                          <p className="font-semibold text-white">{order.number}</p>
                          <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-400">{formatCurrency(order.amount)}</p>
                          <Badge className={cn(
                            order.status === 'delivered' && 'bg-green-500/20 text-green-400',
                            order.status === 'processing' && 'bg-yellow-500/20 text-yellow-400'
                          )}>
                            {order.status === 'delivered' ? 'Doručená' : 'V spracovaní'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="history" className="mt-4">
                    <p className="text-sm text-gray-400 text-center py-8">História komunikácie a aktivít</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 gradient-bg hover:scale-105 transition-all">
                <Mail className="h-4 w-4 mr-2" />
                Kontaktovať zákazníka
              </Button>
              <Button variant="outline" className="glass-card border-white/10">
                <FileText className="h-4 w-4 mr-2" />
                Vytvoriť CP
              </Button>
              <Button variant="outline" className="glass-card border-white/10">
                <Calendar className="h-4 w-4 mr-2" />
                Naplánovať follow-up
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Vyberte zákazníka zo zoznamu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
