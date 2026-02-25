import { useState, useEffect } from 'react';
import { Mail, Building2, Clock, TrendingUp, CheckCircle2, AlertCircle, Package, Euro, Target, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { formatDate, formatCurrency, cn } from '@/lib/utils';

interface Email {
  id: number;
  from: string;
  fromCompany: string;
  subject: string;
  body: string;
  receivedAt: string;
  status: string;
  aiSuggestedAction: string;
  aiConfidence: string;
  assignedOzId: number;
  customerId: number;
  aiAnalysis?: {
    recognizedCustomer: {
      name: string;
      company: string;
      totalOrders: number;
      lastOrderDate: string;
      creditTerms: number;
      discount: number;
    };
    extractedItems: Array<{
      product: string;
      quantity: number;
      matchedCode: string;
      currentStock: number;
      unitPrice: number;
    }>;
    estimatedValue: number;
    confidence: number;
    suggestedActions: Array<{
      id: string;
      label: string;
      icon: string;
      color: string;
      priority: number;
    }>;
    similarPastEmails: Array<{
      subject: string;
      date: string;
      resolution: string;
    }>;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  segment: string;
}

interface SalesRep {
  id: number;
  name: string;
  location: string;
}

const mockAIAnalysis = {
  1: {
    recognizedCustomer: {
      name: 'Ján Horák',
      company: 'HagardHal s.r.o.',
      totalOrders: 47,
      lastOrderDate: '2024-02-18',
      creditTerms: 30,
      discount: 8.5,
    },
    extractedItems: [
      { product: 'Žľab KZL100x60/3', quantity: 50, matchedCode: 'KNS-001', currentStock: 245, unitPrice: 32.50 },
      { product: 'Závesná tyč ZM8x1000', quantity: 150, matchedCode: 'KNS-012', currentStock: 890, unitPrice: 2.80 },
      { product: 'Stropná kotva KSO-M8', quantity: 150, matchedCode: 'KNS-023', currentStock: 1250, unitPrice: 1.50 },
      { product: 'Spojka KZL100x60', quantity: 20, matchedCode: 'KNS-005', currentStock: 320, unitPrice: 4.20 },
    ],
    estimatedValue: 3847.50,
    confidence: 87,
    suggestedActions: [
      { id: 'create-quote', label: 'Vytvoriť cenovú ponuku', icon: '🟢', color: 'green', priority: 1 },
      { id: 'respond-prices', label: 'Odpovedať s cenami', icon: '🔵', color: 'blue', priority: 2 },
      { id: 'assign-rep', label: 'Priradiť OZ', icon: '🟠', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Dopyt na káblové systémy 150m', date: '2024-01-15', resolution: 'CP vytvorená, objednávka prijatá o 3 dni' },
      { subject: 'Potrebujem cenový návrh na žľaby', date: '2024-01-08', resolution: 'CP odoslaná, zákazník si vyžiadal úpravu' },
    ],
    sentiment: 'positive' as const,
  },
  2: {
    recognizedCustomer: {
      name: 'Peter Szabó',
      company: 'TechnoEnergia a.s.',
      totalOrders: 23,
      lastOrderDate: '2024-02-10',
      creditTerms: 14,
      discount: 5.0,
    },
    extractedItems: [
      { product: 'Prípojnicový systém PS-630A', quantity: 8, matchedCode: 'PBS-101', currentStock: 45, unitPrice: 485.00 },
      { product: 'Napájacie body NB-630', quantity: 16, matchedCode: 'PBS-105', currentStock: 120, unitPrice: 42.50 },
    ],
    estimatedValue: 4560.00,
    confidence: 92,
    suggestedActions: [
      { id: 'create-quote', label: 'Vytvoriť cenovú ponuku', icon: '🟢', color: 'green', priority: 1 },
      { id: 'respond-prices', label: 'Odpovedať s cenami', icon: '🔵', color: 'blue', priority: 2 },
    ],
    similarPastEmails: [
      { subject: 'Prípojnicové systémy - cenová ponuka', date: '2024-01-25', resolution: 'CP odoslaná, objednávka potvrdená' },
    ],
    sentiment: 'neutral' as const,
  },
  3: {
    recognizedCustomer: {
      name: 'Mária Vargová',
      company: 'ProfiStav s.r.o.',
      totalOrders: 8,
      lastOrderDate: '2023-12-22',
      creditTerms: 30,
      discount: 3.0,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 45,
    suggestedActions: [
      { id: 'request-info', label: 'Vyžiadať doplnenie', icon: '🟡', color: 'yellow', priority: 1 },
      { id: 'respond-prices', label: 'Odpovedať s cenami', icon: '🔵', color: 'blue', priority: 2 },
    ],
    similarPastEmails: [],
    sentiment: 'neutral' as const,
  },
};

export function CustomerAgent() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [emailsData, customersData, repsData] = await Promise.all([
        api.getEmails(),
        api.getCustomers(),
        api.getSalesReps(),
      ]);
      
      // Inject AI analysis
      const enrichedEmails = emailsData.map((email: Email) => ({
        ...email,
        aiAnalysis: mockAIAnalysis[email.id as keyof typeof mockAIAnalysis] || mockAIAnalysis[1],
      }));
      
      setEmails(enrichedEmails);
      setCustomers(customersData);
      setSalesReps(repsData);
      if (enrichedEmails.length > 0) {
        setSelectedEmail(enrichedEmails[0]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomer = (customerId: number) => {
    return customers.find((c) => c.id === customerId);
  };

  const getSalesRep = (repId: number) => {
    return salesReps.find((r) => r.id === repId);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { variant: 'default', label: 'Nový' },
      processed: { variant: 'secondary', label: 'Spracovaný' },
      'action-taken': { variant: 'success', label: 'Akcia vykonaná' },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '🟢 Pozitívny';
      case 'negative':
        return '🔴 Negatívny';
      default:
        return '🟡 Neutrálny';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence > 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const handleAction = async (actionId: string) => {
    if (!selectedEmail) return;
    
    try {
      await api.updateEmail(selectedEmail.id, { status: 'action-taken' });
      await loadData();
      alert(`Akcia "${actionId}" bola vykonaná!`);
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen glass-dark">
      {/* Email List */}
      <div className="w-96 border-r border-white/10 glass-dark backdrop-blur-xl">
        <div className="border-b border-white/10 p-4 glass">
          <h2 className="text-lg font-semibold text-white">Prijaté správy</h2>
          <p className="text-sm text-gray-400">{emails.length} emailov</p>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="space-y-2 p-2">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={cn(
                  'w-full rounded-xl border border-white/10 p-4 text-left transition-all-smooth glass-card soft-shadow-hover',
                  selectedEmail?.id === email.id && 'gradient-bg glow-border scale-[1.02]'
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{email.fromCompany}</span>
                  {getStatusBadge(email.status)}
                </div>
                <p className="mb-1 text-sm font-medium text-gray-200">{email.subject}</p>
                <p className="mb-2 line-clamp-2 text-xs text-gray-400">{email.body}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDate(email.receivedAt)}
                </div>
                {email.aiAnalysis && (
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      AI: {email.aiAnalysis.confidence}%
                    </Badge>
                    <span className="text-xs">{getSentimentLabel(email.aiAnalysis.sentiment)}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Email Detail & AI Analysis */}
      <div className="flex flex-1 flex-col">
        {selectedEmail ? (
          <>
            {/* Email Detail */}
            <div className="flex-1 overflow-y-auto border-b border-white/10 glass p-6">
              <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-bold text-white">{selectedEmail.subject}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedEmail.from}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {selectedEmail.fromCompany}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDate(selectedEmail.receivedAt)}
                    </div>
                  </div>
                </div>

                <div className="whitespace-pre-wrap rounded-xl glass-card p-6 text-gray-200">
                  {selectedEmail.body}
                </div>
              </div>
            </div>

            {/* AI Analysis Panel */}
            <div className="h-[500px] overflow-y-auto glass-dark p-6">
              <div className="mx-auto max-w-4xl space-y-4">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  AI Analýza a odporúčanie
                </h2>

                {selectedEmail.aiAnalysis && (
                  <>
                    {/* Top Row: Customer, Value, Confidence */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="glass-card border-white/10">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-300">Rozpoznaný zákazník</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="font-semibold text-white">{selectedEmail.aiAnalysis.recognizedCustomer.company}</p>
                          <p className="text-sm text-gray-400">{selectedEmail.aiAnalysis.recognizedCustomer.name}</p>
                          <div className="mt-3 space-y-1 text-xs text-gray-400">
                            <p>Objednávky: <span className="font-semibold text-white">{selectedEmail.aiAnalysis.recognizedCustomer.totalOrders}</span></p>
                            <p>Posledná obj.: <span className="font-semibold text-white">{formatDate(selectedEmail.aiAnalysis.recognizedCustomer.lastOrderDate)}</span></p>
                            <p>Splatnosť: <span className="font-semibold text-white">{selectedEmail.aiAnalysis.recognizedCustomer.creditTerms} dní</span></p>
                            <p>Zľava: <span className="font-semibold text-green-400">{selectedEmail.aiAnalysis.recognizedCustomer.discount}%</span></p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-white/10">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-300">Odhadovaná hodnota dopytu</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-blue-400 flex items-center gap-1">
                            <Euro className="h-6 w-6" />
                            {selectedEmail.aiAnalysis.estimatedValue.toLocaleString('sk-SK', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {selectedEmail.aiAnalysis.extractedItems.length} položiek identifikovaných
                          </p>
                          <div className="mt-3">
                            <div className="flex items-center gap-2 text-xs">
                              {getSentimentIcon(selectedEmail.aiAnalysis.sentiment)}
                              <span className="text-gray-400">Sentiment: {getSentimentLabel(selectedEmail.aiAnalysis.sentiment)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={cn("glass-card border", getConfidenceColor(selectedEmail.aiAnalysis.confidence))}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold flex items-center gap-1">
                            <Target className="h-6 w-6" />
                            {selectedEmail.aiAnalysis.confidence}%
                          </p>
                          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all",
                                selectedEmail.aiAnalysis.confidence > 80 ? 'bg-green-500' :
                                selectedEmail.aiAnalysis.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'
                              )}
                              style={{ width: `${selectedEmail.aiAnalysis.confidence}%` }}
                            />
                          </div>
                          <p className="text-xs mt-2">
                            {selectedEmail.aiAnalysis.confidence > 80 ? 'Vysoká spoľahlivosť' :
                             selectedEmail.aiAnalysis.confidence > 50 ? 'Stredná spoľahlivosť' : 'Nízka spoľahlivosť'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Extracted Items */}
                    {selectedEmail.aiAnalysis.extractedItems.length > 0 && (
                      <Card className="glass-card border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-400" />
                            Extrahované položky z emailu
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            AI rozpoznalo tieto produkty a párovalo ich s katalógom
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedEmail.aiAnalysis.extractedItems.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between rounded-lg glass p-3 border border-white/10">
                                <div className="flex-1">
                                  <p className="font-semibold text-white">{item.product}</p>
                                  <p className="text-xs text-gray-400">Kód: {item.matchedCode} | Sklad: {item.currentStock} ks</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-white">{item.quantity}x</p>
                                  <p className="text-xs text-gray-400">{formatCurrency(item.unitPrice)}/ks</p>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="font-bold text-blue-400">{formatCurrency(item.quantity * item.unitPrice)}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                              <p className="font-semibold text-white">CELKOM:</p>
                              <p className="text-2xl font-bold text-blue-400">{formatCurrency(selectedEmail.aiAnalysis.estimatedValue)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggested Actions */}
                    <Card className="glass-card border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Navrhované akcie</CardTitle>
                        <CardDescription className="text-gray-400">
                          Kliknite na akciu ktorú chcete vykonať
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {selectedEmail.aiAnalysis.suggestedActions.map((action) => (
                            <Button
                              key={action.id}
                              onClick={() => handleAction(action.id)}
                              disabled={selectedEmail.status === 'action-taken'}
                              className={cn(
                                "h-auto py-4 px-4 glass-card border-white/10 justify-start hover:scale-105 transition-all-smooth",
                                action.color === 'green' && 'hover:border-green-400',
                                action.color === 'blue' && 'hover:border-blue-400',
                                action.color === 'yellow' && 'hover:border-yellow-400',
                                action.color === 'orange' && 'hover:border-orange-400',
                                action.color === 'red' && 'hover:border-red-400',
                              )}
                              variant="outline"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{action.icon}</span>
                                <span className="font-medium text-white">{action.label}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Similar Past Emails */}
                    {selectedEmail.aiAnalysis.similarPastEmails.length > 0 && (
                      <Card className="glass-card border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white">Podobné historické dopyty</CardTitle>
                          <CardDescription className="text-gray-400">
                            Ako boli vyriešené podobné požiadavky v minulosti
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedEmail.aiAnalysis.similarPastEmails.map((pastEmail, idx) => (
                              <div key={idx} className="rounded-lg glass p-3 border border-white/10">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="font-semibold text-white">{pastEmail.subject}</p>
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(pastEmail.date)}</p>
                                    <p className="text-sm text-gray-300 mt-2">
                                      <span className="text-green-400">Vyriešené:</span> {pastEmail.resolution}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center glass">
            <p className="text-gray-400">Vyberte email zo zoznamu</p>
          </div>
        )}
      </div>
    </div>
  );
}
