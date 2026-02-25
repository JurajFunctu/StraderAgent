import { useState, useEffect } from 'react';
import { FileText, Eye, CheckCircle, AlertTriangle, Clock, Download, TrendingUp, ArrowRight, Mail, XCircle, Ban } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { formatCurrency, formatDateShort } from '@/lib/utils';

interface Invoice {
  id: number;
  number: string;
  customerId: number;
  type: string;
  amount: string;
  vatAmount: string;
  dueDate: string;
  status: string;
  revolutPaymentId: string | null;
  deliveryNoteId: number | null;
  items: any;
  createdAt: string;
  paidAt: string | null;
}

interface DeliveryNote {
  id: number;
  number: string;
  customerId: number;
  date: string;
  status: string;
  items: any;
  totalAmount: string;
}

const mockInvoiceDiscrepancies = [
  {
    invoiceNumber: 'FA-IN-2024-045',
    supplier: 'BAKS s.r.o.',
    totalDiff: 847.50,
    items: [
      { name: 'Žľab KZL100x60/3', orderedPrice: 32.50, invoicedPrice: 35.80, diff: 3.30, qty: 100 },
      { name: 'Závesná tyč ZM8x1000', orderedPrice: 2.80, invoicedPrice: 2.95, diff: 0.15, qty: 500 },
      { name: 'Stropná kotva KSO-M8', orderedPrice: 1.50, invoicedPrice: 1.85, diff: 0.35, qty: 400 },
    ],
  },
  {
    invoiceNumber: 'FA-IN-2024-048',
    supplier: 'ElektroTech s.r.o.',
    totalDiff: 325.00,
    items: [
      { name: 'Prípojnicový systém PS-630A', orderedPrice: 485.00, invoicedPrice: 520.00, diff: 35.00, qty: 10 },
    ],
  },
];

const mockReminders = [
  {
    invoiceNumber: 'FA-2024-1201',
    customer: 'HagardHal s.r.o.',
    amount: 3250.00,
    daysOverdue: 2,
    level: 1,
    nextAction: '2024-02-27',
    emailPreview: 'Dobrý deň,\n\nobracíame sa na Vás vo veci faktúry FA-2024-1201 v hodnote 3 250,00 € so splatnosťou 23.02.2024.\n\nVáš dlh je po splatnosti 2 dni. Prosíme o urýchlené vyrovnanie.',
    status: 'pending',
  },
  {
    invoiceNumber: 'FA-2024-1156',
    customer: 'ProfiStav s.r.o.',
    amount: 5680.00,
    daysOverdue: 9,
    level: 2,
    nextAction: '2024-02-28',
    emailPreview: 'Dobrý deň,\n\ntoto je druhá upomienka vo veci faktúry FA-2024-1156 v hodnote 5 680,00 €.\n\nVáš dlh je po splatnosti 9 dní. V prípade, že neuhradíte do 5 dní, budeme nútení pristúpiť k tretej upomienke.',
    status: 'sent',
  },
  {
    invoiceNumber: 'FA-2024-1098',
    customer: 'StavMat Plus',
    amount: 12400.00,
    daysOverdue: 18,
    level: 3,
    nextAction: 'Eskalovať',
    emailPreview: 'Dobrý deň,\n\ntoto je posledná upomienka vo veci faktúry FA-2024-1098 v hodnote 12 400,00 €.\n\nVáš dlh je po splatnosti 18 dní. Pokiaľ neuhradíte do 3 dní, budeme nútení zablokovať Vašu firmu pre ďalšie objednávky a postúpiť vec právnemu oddeleniu.',
    status: 'escalated',
  },
];

const mockDLtoPipeline = [
  {
    dlNumber: 'DL-2024-0845',
    customer: 'TechnoEnergia a.s.',
    date: '2024-02-24',
    amount: 4560.00,
    status: 'ai-generating',
    progress: 75,
    aiFields: {
      customer: '✓ Načítané',
      items: '✓ 8 položiek',
      prices: '✓ Vypočítané',
      vat: '✓ 20%',
      dueDate: '✓ 10.03.2024',
      qrCode: '✓ Vygenerované',
    },
  },
  {
    dlNumber: 'DL-2024-0842',
    customer: 'HagardHal s.r.o.',
    date: '2024-02-23',
    amount: 3847.50,
    status: 'approval',
    progress: 100,
    aiFields: {
      customer: '✓ Načítané',
      items: '✓ 4 položky',
      prices: '✓ Vypočítané',
      vat: '✓ 20%',
      dueDate: '✓ 25.03.2024',
      qrCode: '✓ Vygenerované',
    },
  },
  {
    dlNumber: 'DL-2024-0839',
    customer: 'Elektro Centrum',
    date: '2024-02-22',
    amount: 8920.00,
    status: 'sent',
    progress: 100,
    aiFields: {
      customer: '✓ Načítané',
      items: '✓ 12 položiek',
      prices: '✓ Vypočítané',
      vat: '✓ 20%',
      dueDate: '✓ 24.03.2024',
      qrCode: '✓ Vygenerované',
    },
  },
];

export function InvoiceAgent() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesData, deliveryNotesData, customersData] = await Promise.all([
        api.getInvoices(),
        api.getDeliveryNotes(),
        api.getCustomers(),
      ]);
      setInvoices(invoicesData);
      setDeliveryNotes(deliveryNotesData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.company || 'Neznámy';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: { variant: 'outline', label: 'Koncept', icon: FileText },
      sent: { variant: 'default', label: 'Odoslaná', icon: FileText },
      viewed: { variant: 'secondary', label: 'Zobrazená', icon: Eye },
      paid: { variant: 'success', label: 'Uhradená', icon: CheckCircle },
      overdue: { variant: 'destructive', label: 'Po splatnosti', icon: AlertTriangle },
      pending: { variant: 'warning', label: 'Čaká', icon: Clock },
      'ai-generating': { variant: 'default', label: 'AI generuje', icon: TrendingUp },
      approval: { variant: 'warning', label: 'Čaká na schválenie', icon: Clock },
    };
    const config = variants[status] || { variant: 'outline', label: status, icon: FileText };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getReminderLevelBadge = (level: number) => {
    const colors = {
      1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      2: 'bg-orange-100 text-orange-800 border-orange-300',
      3: 'bg-red-100 text-red-800 border-red-300',
    };
    return (
      <Badge className={colors[level as keyof typeof colors]}>
        {level}. upomienka
      </Badge>
    );
  };

  const getReminderStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { label: 'Čaká', icon: Clock, color: 'bg-gray-100 text-gray-800' },
      sent: { label: 'Odoslaná', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
      escalated: { label: 'Eskalovaná', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const handleGenerateInvoice = async (deliveryNote: DeliveryNote) => {
    alert(`Generujem faktúru z DL ${deliveryNote.number}...`);
  };

  const handleSendReminder = async (reminder: any) => {
    alert(`Odosielam ${reminder.level}. upomienku pre faktúru ${reminder.invoiceNumber}...`);
  };

  const issuedInvoices = invoices.filter((inv) => inv.type === 'issued');
  const receivedInvoices = invoices.filter((inv) => inv.type === 'received');
  const pendingDeliveryNotes = deliveryNotes.filter((dn) => dn.status === 'pending');
  const overdueInvoices = issuedInvoices.filter((inv) => inv.status === 'overdue');

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
        <h1 className="text-3xl font-bold text-white gradient-text">Fakturačný Agent</h1>
        <p className="text-gray-400">Správa faktúr a dodacích listov s AI automatizáciou</p>
      </div>

      <Tabs defaultValue="dl-pipeline" className="space-y-4">
        <TabsList className="glass-card border-white/10">
          <TabsTrigger value="dl-pipeline">
            DL → FA Pipeline ({mockDLtoPipeline.length})
          </TabsTrigger>
          <TabsTrigger value="ai-check">
            AI Kontrola vstupných FA ({mockInvoiceDiscrepancies.length})
          </TabsTrigger>
          <TabsTrigger value="reminders">
            Automatické upomienky ({mockReminders.length})
          </TabsTrigger>
          <TabsTrigger value="delivery-notes">
            Dodacie listy ({pendingDeliveryNotes.length})
          </TabsTrigger>
          <TabsTrigger value="sent-invoices">
            Odoslané FA ({issuedInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="received-invoices">
            Vstupné FA ({receivedInvoices.length})
          </TabsTrigger>
        </TabsList>

        {/* DL → FA Pipeline Tab */}
        <TabsContent value="dl-pipeline" className="space-y-4">
          {/* Concrete Example Highlight */}
          <Card className="glass-card border-green-400/30 bg-green-50/5">
            <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Príklad: DL → FA automatizácia
              </CardTitle>
              <CardDescription className="text-gray-300">
                AI automaticky vygeneroval faktúru z dodacieho listu
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {/* Source & Result */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card border-blue-400/30 bg-blue-400/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-blue-400">Dodací list</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-white"><span className="text-gray-400">Číslo:</span> DL-2024/0892</p>
                    <p className="text-white"><span className="text-gray-400">Zákazník:</span> ProfiStav s.r.o.</p>
                    <p className="text-white"><span className="text-gray-400">Položky:</span> 4 ks</p>
                    <p className="text-white"><span className="text-gray-400">Hodnota:</span> 3 847,50 €</p>
                  </div>
                </div>
                <div className="glass-card border-green-400/30 bg-green-400/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">AI vygeneroval FA</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-white"><span className="text-gray-400">Číslo:</span> FA-2024/1847</p>
                    <p className="text-white"><span className="text-gray-400">Zákazník:</span> ✅ Načítané</p>
                    <p className="text-white"><span className="text-gray-400">DPH 20%:</span> ✅ Vypočítané</p>
                    <p className="text-white"><span className="text-gray-400">QR kód:</span> ✅ Vygenerované</p>
                  </div>
                </div>
              </div>

              {/* AI Fields Breakdown */}
              <div className="glass-card rounded-lg p-3 border border-white/10">
                <p className="text-xs font-semibold text-gray-300 mb-2">AI automaticky vyplnilo:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    Zákazník + IČO
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    4 položky s cenami
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    DPH 20% (769,50 €)
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    Splatnosť (30 dní)
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    QR platobný kód
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    IBAN a VS
                  </div>
                </div>
              </div>

              {/* Time Saved */}
              <div className="rounded-lg glass-card border-blue-400/30 bg-blue-400/5 p-3">
                <p className="text-sm font-semibold text-blue-400 mb-1">
                  ⚡ Vygenerované za 3 sekundy (manuálne: 15-20 minút)
                </p>
                <p className="text-xs text-gray-300">
                  AI ušetril účtovníčke priemerne 18 minút práce na každú faktúru
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                DL → FA Pipeline - AI automatické generovanie faktúr
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI automaticky vytvára faktúry z dodacích listov: načítava zákazníka, položky, ceny, DPH, splatnosť a generuje QR kód na platbu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDLtoPipeline.map((item, idx) => (
                  <div key={idx} className="glass-card border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="font-semibold text-white">{item.dlNumber}</p>
                            <p className="text-sm text-gray-400">{item.customer}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-blue-400">{formatCurrency(item.amount)}</p>
                          <p className="text-xs text-gray-400">{formatDateShort(item.date)}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    {/* Pipeline Visualization */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/10">
                        <FileText className="h-4 w-4 text-green-400" />
                        <span className="text-white">Dodací list</span>
                      </div>
                      <ArrowRight className={item.progress > 25 ? "h-4 w-4 text-blue-400" : "h-4 w-4 text-gray-600"} />
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg glass border ${item.progress > 25 ? 'border-blue-400' : 'border-white/10'}`}>
                        <TrendingUp className={item.progress > 25 ? "h-4 w-4 text-blue-400" : "h-4 w-4 text-gray-600"} />
                        <span className={item.progress > 25 ? "text-white" : "text-gray-500"}>AI generuje FA</span>
                      </div>
                      <ArrowRight className={item.progress === 100 ? "h-4 w-4 text-blue-400" : "h-4 w-4 text-gray-600"} />
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg glass border ${item.status === 'approval' ? 'border-yellow-400' : item.progress === 100 ? 'border-green-400' : 'border-white/10'}`}>
                        <CheckCircle className={item.progress === 100 ? "h-4 w-4 text-green-400" : "h-4 w-4 text-gray-600"} />
                        <span className={item.progress === 100 ? "text-white" : "text-gray-500"}>Schválenie</span>
                      </div>
                      <ArrowRight className={item.status === 'sent' ? "h-4 w-4 text-blue-400" : "h-4 w-4 text-gray-600"} />
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg glass border ${item.status === 'sent' ? 'border-green-400' : 'border-white/10'}`}>
                        <Mail className={item.status === 'sent' ? "h-4 w-4 text-green-400" : "h-4 w-4 text-gray-600"} />
                        <span className={item.status === 'sent' ? "text-white" : "text-gray-500"}>Odoslanie</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Fields */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {Object.entries(item.aiFields).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1.5 text-gray-300">
                          <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                          <span>{key}: {value}</span>
                        </div>
                      ))}
                    </div>

                    {item.status === 'approval' && (
                      <div className="flex gap-2 pt-2 border-t border-white/10">
                        <Button size="sm" className="flex-1 gradient-bg hover:scale-105 transition-all">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Schváliť a odoslať
                        </Button>
                        <Button size="sm" variant="outline" className="glass-card border-white/10 hover:border-red-400">
                          <XCircle className="h-4 w-4 mr-2" />
                          Zamietnuť
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Check Incoming Invoices Tab */}
        <TabsContent value="ai-check" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                AI Kontrola vstupných faktúr
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI porovnáva fakturované ceny od dodávateľov s objednanými cenami a upozorňuje na rozdiely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInvoiceDiscrepancies.map((disc, idx) => (
                <div key={idx} className="glass-card border-red-300 rounded-xl p-4 space-y-3 bg-red-50/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <p className="font-semibold text-white">{disc.invoiceNumber}</p>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Dodávateľ: {disc.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">AI zistil cenové rozdiely</p>
                      <p className="text-xl font-bold text-red-400">
                        +{formatCurrency(disc.totalDiff)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-300 grid grid-cols-6 gap-2 px-2">
                      <span className="col-span-2">Položka</span>
                      <span className="text-right">Obj. cena</span>
                      <span className="text-right">Fakt. cena</span>
                      <span className="text-right">Rozdiel</span>
                      <span className="text-right">Suma</span>
                    </div>
                    {disc.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="glass border border-red-300/30 rounded-lg p-2 text-xs grid grid-cols-6 gap-2 items-center">
                        <span className="col-span-2 text-white">{item.name}</span>
                        <span className="text-right text-gray-400">{formatCurrency(item.orderedPrice)}</span>
                        <span className="text-right text-red-400 font-semibold">{formatCurrency(item.invoicedPrice)}</span>
                        <span className="text-right text-red-400 font-semibold">+{formatCurrency(item.diff)}</span>
                        <span className="text-right text-red-400 font-bold">+{formatCurrency(item.diff * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-red-300/30">
                    <Button size="sm" variant="outline" className="glass-card border-white/10 hover:border-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Akceptovať rozdiel
                    </Button>
                    <Button size="sm" variant="outline" className="glass-card border-white/10 hover:border-blue-400">
                      <Mail className="h-4 w-4 mr-2" />
                      Kontaktovať dodávateľa
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Odmietnuť faktúru
                    </Button>
                  </div>
                </div>
              ))}

              <div className="glass-card border-green-300/50 rounded-xl p-4 bg-green-50/5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <div>
                    <p className="font-semibold text-white">AI zistil celkom {mockInvoiceDiscrepancies.length} faktúry s cenovými rozdielmi</p>
                    <p className="text-sm text-gray-400">
                      Celková hodnota rozdielov: <span className="font-bold text-red-400">
                        {formatCurrency(mockInvoiceDiscrepancies.reduce((sum, d) => sum + d.totalDiff, 0))}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automatic Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-400" />
                Automatické upomienky - 3-stupňový systém
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI automaticky odosiela upomienky: 1. upomienka (1 deň po splatnosti) → 2. upomienka (7 dní) → 3. upomienka (14 dní) → Blokovanie klienta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timeline visualization */}
              <div className="glass-card border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                    <span className="text-white font-semibold">FA splatná</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-yellow-400" />
                    </div>
                    <span className="text-white font-semibold">1. upomienka</span>
                    <span className="text-xs text-gray-400">1 deň</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-orange-400" />
                    </div>
                    <span className="text-white font-semibold">2. upomienka</span>
                    <span className="text-xs text-gray-400">7 dní</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <span className="text-white font-semibold">3. upomienka</span>
                    <span className="text-xs text-gray-400">14 dní</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-600" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-red-600/20 border-2 border-red-600 flex items-center justify-center">
                      <Ban className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="text-white font-semibold">Blokovanie</span>
                    <span className="text-xs text-gray-400">+3 dni</span>
                  </div>
                </div>
              </div>

              {/* Reminders list */}
              {mockReminders.map((reminder, idx) => {
                const levelColor = reminder.level === 1 ? 'yellow' : reminder.level === 2 ? 'orange' : 'red';
                return (
                  <div key={idx} className={`glass-card border-${levelColor}-300 rounded-xl p-4 space-y-3 bg-${levelColor}-50/5`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{reminder.invoiceNumber}</p>
                          {getReminderLevelBadge(reminder.level)}
                          {getReminderStatusBadge(reminder.status)}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{reminder.customer}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Po splatnosti: <span className={`font-semibold text-${levelColor}-400`}>{reminder.daysOverdue} dní</span> | 
                          Ďalšia akcia: <span className="font-semibold text-white">{reminder.nextAction}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold text-${levelColor}-400`}>
                          {formatCurrency(reminder.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="glass border border-white/10 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-300 mb-2">AI vygenerovaný email:</p>
                      <p className="text-xs text-gray-400 whitespace-pre-line">{reminder.emailPreview}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {reminder.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSendReminder(reminder)}
                          className="gradient-bg hover:scale-105 transition-all"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Odoslať {reminder.level}. upomienku
                        </Button>
                      )}
                      {reminder.status === 'escalated' && (
                        <Button size="sm" variant="destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          Zablokovať klienta
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="glass-card border-white/10">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Označiť ako uhradené
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Original Delivery Notes Tab */}
        <TabsContent value="delivery-notes" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Dodacie listy čakajúce na vyfakturovanie</CardTitle>
              <CardDescription className="text-gray-400">
                AI automaticky generuje faktúry z potvrdených dodacích listov
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingDeliveryNotes.length === 0 ? (
                  <p className="text-center text-gray-500">Žiadne dodacie listy</p>
                ) : (
                  pendingDeliveryNotes.map((dn) => (
                    <div
                      key={dn.id}
                      className="flex items-center justify-between rounded-lg glass-card border-white/10 p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-semibold text-white">{dn.number}</p>
                            <p className="text-sm text-gray-400">{getCustomerName(dn.customerId)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-white">{formatCurrency(dn.totalAmount)}</p>
                          <p className="text-sm text-gray-400">{formatDateShort(dn.date)}</p>
                        </div>
                        {getStatusBadge(dn.status)}
                        <Button onClick={() => handleGenerateInvoice(dn)} size="sm" className="gradient-bg">
                          Generovať faktúru
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sent Invoices Tab */}
        <TabsContent value="sent-invoices" className="space-y-4">
          <div className="grid gap-4">
            {issuedInvoices.map((invoice) => (
              <Card key={invoice.id} className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">{invoice.number}</p>
                          <p className="text-sm text-gray-400">
                            {getCustomerName(invoice.customerId)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Suma</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(invoice.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Splatnosť</p>
                        <p className="font-semibold text-white">{formatDateShort(invoice.dueDate)}</p>
                      </div>
                      {getStatusBadge(invoice.status)}
                      {invoice.revolutPaymentId && (
                        <Badge variant="success" className="glass-card">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Revolut
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" className="glass-card border-white/10">
                        <Download className="mr-2 h-4 w-4" />
                        Stiahnuť
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Received Invoices Tab */}
        <TabsContent value="received-invoices" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Vstupné faktúry od dodávateľov</CardTitle>
              <CardDescription className="text-gray-400">
                AI kontroluje, či ceny korešpondujú s objednávkou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receivedInvoices.map((invoice) => {
                  const items = typeof invoice.items === 'string' ? JSON.parse(invoice.items || '[]') : (invoice.items || []);
                  const hasDiscrepancy = items.some((item: any) => item.note);

                  return (
                    <div
                      key={invoice.id}
                      className={`rounded-lg glass-card border p-4 ${
                        hasDiscrepancy ? 'border-red-300 bg-red-50/5' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-white">{invoice.number}</p>
                              <p className="text-sm text-gray-400">
                                Dodávateľ: {getCustomerName(invoice.customerId)}
                              </p>
                              {hasDiscrepancy && (
                                <div className="mt-1 flex items-center gap-1 text-sm text-red-400">
                                  <AlertTriangle className="h-4 w-4" />
                                  <span>Rozdiel v cenách voči CP!</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-white">{formatCurrency(invoice.amount)}</p>
                            <p className="text-sm text-gray-400">{formatDateShort(invoice.dueDate)}</p>
                          </div>
                          {getStatusBadge(invoice.status)}
                          <Button variant="outline" size="sm" className="glass-card border-white/10">
                            Skontrolovať
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
