import { useState } from 'react';
import { AlertTriangle, Package, Truck, Clock, CheckCircle, X, FileText, Mail, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface Complaint {
  id: number;
  number: string;
  customer: string;
  date: string;
  type: 'missing' | 'damaged' | 'surplus' | 'delay';
  status: 'received' | 'in-progress' | 'resolved';
  description: string;
  items: Array<{
    product: string;
    quantity: number;
    issue: string;
  }>;
  aiSuggestedResolution: string;
  aiConfidence: number;
  timeline: Array<{
    stage: string;
    date: string;
    completed: boolean;
  }>;
  responseTemplate: string;
}

const mockComplaints: Complaint[] = [
  {
    id: 1,
    number: 'REK-2024-001',
    customer: 'HagardHal s.r.o.',
    date: '2024-02-24T10:30:00',
    type: 'missing',
    status: 'received',
    description: 'V dodávke chýbali stropné kotvy, ktoré boli uvedené na dodacom liste.',
    items: [
      { product: 'Stropná kotva KSO-M8', quantity: 50, issue: 'Chýba v dodávke' }
    ],
    aiSuggestedResolution: 'Urýchlene dodať chýbajúce položky - materiál je skladom, doručenie do 24h',
    aiConfidence: 95,
    timeline: [
      { stage: 'Prijatá', date: '2024-02-24 10:30', completed: true },
      { stage: 'V riešení', date: '', completed: false },
      { stage: 'Vyriešená', date: '', completed: false },
    ],
    responseTemplate: `Dobrý deň,\n\nďakujeme za Vašu reklamáciu č. REK-2024-001.\n\nPotvrdili sme, že v dodávke skutočne chýbalo 50ks Stropná kotva KSO-M8. Ospravedlňujeme sa za túto chybu.\n\nChýbajúci tovar Vám dodáme do 24 hodín bez dodatočných nákladov.\n\nS pozdravom,\nTím Strader`
  },
  {
    id: 2,
    number: 'REK-2024-002',
    customer: 'TechnoEnergia a.s.',
    date: '2024-02-23T14:15:00',
    type: 'damaged',
    status: 'in-progress',
    description: 'Pri preprave boli poškodené žľaby, sú prehnuté a nefunkčné.',
    items: [
      { product: 'Žľab KZL100x60/3', quantity: 8, issue: 'Poškodené pri preprave' }
    ],
    aiSuggestedResolution: 'Vymeniť poškodený tovar, dohodnúť termín výmeny so zákazníkom',
    aiConfidence: 88,
    timeline: [
      { stage: 'Prijatá', date: '2024-02-23 14:15', completed: true },
      { stage: 'V riešení', date: '2024-02-23 15:00', completed: true },
      { stage: 'Vyriešená', date: '', completed: false },
    ],
    responseTemplate: `Dobrý deň,\n\nďakujeme za nahlásenie problému s reklamáciou č. REK-2024-002.\n\nPotvrdili sme poškodenie 8ks Žľab KZL100x60/3 pri preprave. Ospravedlňujeme sa.\n\nPoškodený tovar Vám vymeníme, prosím kontaktujte nás pre dohodnutie termínu výmeny.\n\nS pozdravom,\nTím Strader`
  },
  {
    id: 3,
    number: 'REK-2024-003',
    customer: 'ProfiStav s.r.o.',
    date: '2024-02-22T09:45:00',
    type: 'surplus',
    status: 'in-progress',
    description: 'Dodali ste nám 30ks spojok navyše, ktoré sme neobjednali.',
    items: [
      { product: 'Spojka KZL100x60', quantity: 30, issue: 'Dodané navyše' }
    ],
    aiSuggestedResolution: 'Pripísať dobropis alebo prevziať späť tovar',
    aiConfidence: 92,
    timeline: [
      { stage: 'Prijatá', date: '2024-02-22 09:45', completed: true },
      { stage: 'V riešení', date: '2024-02-22 11:00', completed: true },
      { stage: 'Vyriešená', date: '', completed: false },
    ],
    responseTemplate: `Dobrý deň,\n\nďakujeme za upozornenie na reklamáciu č. REK-2024-003.\n\nPotvrdzujeme, že 30ks Spojka KZL100x60 bolo dodaných omylom.\n\nMôžete si tovar ponechať s 15% zľavou, alebo Vám tovar vyzdvihneme bez poplatku.\n\nS pozdravom,\nTím Strader`
  },
  {
    id: 4,
    number: 'REK-2024-004',
    customer: 'Elektro Centrum',
    date: '2024-02-20T16:20:00',
    type: 'delay',
    status: 'resolved',
    description: 'Dodávka prišla o 5 dní neskôr ako sme sa dohodli, čo nám spôsobilo problémy na stavbe.',
    items: [
      { product: 'Prípojnicový systém PS-630A', quantity: 10, issue: 'Oneskorená dodávka' }
    ],
    aiSuggestedResolution: 'Poskytnúť kompenzáciu vo forme zľavy na ďalšiu objednávku',
    aiConfidence: 85,
    timeline: [
      { stage: 'Prijatá', date: '2024-02-20 16:20', completed: true },
      { stage: 'V riešení', date: '2024-02-20 17:00', completed: true },
      { stage: 'Vyriešená', date: '2024-02-21 10:00', completed: true },
    ],
    responseTemplate: `Dobrý deň,\n\nďakujeme za Vašu reklamáciu č. REK-2024-004.\n\nOspravedlňujeme sa za oneskorenú dodávku. Priznávame 10% zľavu na Vašu nasledujúcu objednávku ako kompenzáciu.\n\nS pozdravom,\nTím Strader`
  },
];

export function ComplaintsAgent() {
  const [complaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'missing':
        return <X className="h-5 w-5" />;
      case 'damaged':
        return <AlertTriangle className="h-5 w-5" />;
      case 'surplus':
        return <Package className="h-5 w-5" />;
      case 'delay':
        return <Clock className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'missing':
        return 'Chýbajúci tovar';
      case 'damaged':
        return 'Poškodený tovar';
      case 'surplus':
        return 'Prebytočný tovar';
      case 'delay':
        return 'Oneskorenie';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'missing':
        return 'text-red-400 bg-red-500/20 border-red-400';
      case 'damaged':
        return 'text-orange-400 bg-orange-500/20 border-orange-400';
      case 'surplus':
        return 'text-blue-400 bg-blue-500/20 border-blue-400';
      case 'delay':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-400';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-400">Prijatá</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400">V riešení</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-400">Vyriešená</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 85) return 'text-green-400';
    if (confidence > 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleSendResponse = (complaint: Complaint) => {
    alert(`Odosielam odpoveď zákazníkovi ${complaint.customer}...`);
  };

  const handleResolve = (complaint: Complaint) => {
    alert(`Označujem reklamáciu ${complaint.number} ako vyriešenú...`);
  };

  return (
    <div className="flex h-screen glass-dark">
      {/* Complaints List */}
      <div className="w-96 border-r border-white/10 glass-dark backdrop-blur-xl">
        <div className="border-b border-white/10 p-4 glass">
          <h2 className="text-lg font-semibold text-white">Reklamácie</h2>
          <p className="text-sm text-gray-400">{complaints.length} aktívnych reklamácií</p>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)] p-2 space-y-2">
          {complaints.map((complaint) => (
            <button
              key={complaint.id}
              onClick={() => setSelectedComplaint(complaint)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all-smooth glass-card',
                selectedComplaint?.id === complaint.id && 'gradient-bg glow-border scale-[1.02]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{complaint.customer}</span>
                {getStatusBadge(complaint.status)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeColor(complaint.type)}>
                  {getTypeIcon(complaint.type)}
                  <span className="ml-1">{getTypeLabel(complaint.type)}</span>
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mb-2">{complaint.number}</p>
              <p className="text-sm text-gray-300 line-clamp-2 mb-2">{complaint.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatDate(complaint.date)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Complaint Detail */}
      <div className="flex-1 overflow-y-auto glass p-6">
        {selectedComplaint ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">{selectedComplaint.number}</h1>
                {getStatusBadge(selectedComplaint.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {selectedComplaint.customer}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatDate(selectedComplaint.date)}
                </div>
                <Badge className={getTypeColor(selectedComplaint.type)}>
                  {getTypeIcon(selectedComplaint.type)}
                  <span className="ml-1">{getTypeLabel(selectedComplaint.type)}</span>
                </Badge>
              </div>
            </div>

            {/* Description */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Popis problému</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{selectedComplaint.description}</p>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Dotknuté položky</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedComplaint.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between glass border border-white/10 rounded-lg p-3">
                      <div>
                        <p className="font-semibold text-white">{item.product}</p>
                        <p className="text-xs text-gray-400">{item.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-400">{item.quantity}x</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedComplaint.timeline.map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2",
                        stage.completed 
                          ? "bg-green-500/20 border-green-400" 
                          : "bg-gray-500/20 border-gray-600"
                      )}>
                        {stage.completed && <CheckCircle className="h-5 w-5 text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-semibold",
                          stage.completed ? "text-white" : "text-gray-500"
                        )}>
                          {stage.stage}
                        </p>
                        {stage.date && (
                          <p className="text-xs text-gray-500">{stage.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Suggested Resolution */}
            <Card className="glass-card border-blue-400/30 bg-blue-50/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  AI Navrhované riešenie
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI confidence: <span className={cn("font-semibold", getConfidenceColor(selectedComplaint.aiConfidence))}>
                    {selectedComplaint.aiConfidence}%
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{selectedComplaint.aiSuggestedResolution}</p>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${selectedComplaint.aiConfidence}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Response Template */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-400" />
                  AI Generovaná odpoveď
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Automaticky vygenerovaný email pre zákazníka
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="glass border border-white/10 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300 whitespace-pre-line">{selectedComplaint.responseTemplate}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSendResponse(selectedComplaint)}
                    className="flex-1 gradient-bg hover:scale-105 transition-all"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Odoslať odpoveď
                  </Button>
                  {selectedComplaint.status !== 'resolved' && (
                    <Button 
                      onClick={() => handleResolve(selectedComplaint)}
                      variant="outline"
                      className="glass-card border-white/10 hover:border-green-400"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Označiť ako vyriešené
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">Vyberte reklamáciu zo zoznamu</p>
          </div>
        )}
      </div>
    </div>
  );
}
