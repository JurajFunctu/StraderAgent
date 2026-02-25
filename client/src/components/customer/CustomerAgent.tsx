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
      { id: 'create-quote', label: 'Vytvoriť CP', icon: '🟢', color: 'green', priority: 1 },
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
      { product: 'Konzola montážna KM-630', quantity: 12, matchedCode: 'PBS-108', currentStock: 78, unitPrice: 28.00 },
    ],
    estimatedValue: 4896.00,
    confidence: 92,
    suggestedActions: [
      { id: 'create-quote', label: 'Vytvoriť CP', icon: '🟢', color: 'green', priority: 1 },
      { id: 'schedule-consult', label: 'Naplánovať technickú konzultáciu', icon: '📅', color: 'blue', priority: 2 },
      { id: 'assign-rep', label: 'Priradiť OZ', icon: '🟠', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Prípojnicové systémy - cenová ponuka', date: '2024-01-25', resolution: 'CP odoslaná, objednávka potvrdená' },
      { subject: 'Technická konzultácia k projektu', date: '2024-01-10', resolution: 'Konzultácia uskutočnená, objednávka 4200 EUR' },
    ],
    sentiment: 'positive' as const,
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
      { id: 'request-info', label: '🟡 Vyžiadať doplnenie údajov', icon: '🟡', color: 'yellow', priority: 1 },
      { id: 'suggest-alternatives', label: 'Navrhnúť alternatívy', icon: '💡', color: 'blue', priority: 2 },
      { id: 'assign-rep', label: 'Priradiť OZ', icon: '🟠', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [],
    sentiment: 'neutral' as const,
  },
  4: {
    recognizedCustomer: {
      name: 'Branislav Kováč',
      company: 'ElektroStav a.s.',
      totalOrders: 34,
      lastOrderDate: '2024-02-20',
      creditTerms: 14,
      discount: 6.5,
    },
    extractedItems: [
      { product: 'Kábel CYKY 5x16mm2', quantity: 500, matchedCode: 'KAB-516', currentStock: 2400, unitPrice: 8.40 },
      { product: 'Inštalačná trubka 320N', quantity: 200, matchedCode: 'TRU-320', currentStock: 850, unitPrice: 1.20 },
    ],
    estimatedValue: 4440.00,
    confidence: 95,
    suggestedActions: [
      { id: 'escalate-urgent', label: '🔴 Eskalovať vedeniu', icon: '🔴', color: 'red', priority: 1 },
      { id: 'check-stock', label: 'Overiť dostupnosť skladu', icon: '📦', color: 'blue', priority: 2 },
      { id: 'create-express-quote', label: 'Vytvoriť expresnú CP', icon: '⚡', color: 'green', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Naliehavý dopyt - kábel CYKY', date: '2024-02-01', resolution: 'Expedované do 24h, zákazník spokojný' },
    ],
    sentiment: 'positive' as const,
  },
  5: {
    recognizedCustomer: {
      name: 'Andrea Mináriková',
      company: 'StavMat s.r.o.',
      totalOrders: 12,
      lastOrderDate: '2024-01-28',
      creditTerms: 30,
      discount: 4.0,
    },
    extractedItems: [
      { product: 'LED panel 60x60 40W', quantity: 25, matchedCode: 'LED-6040', currentStock: 145, unitPrice: 32.00 },
      { product: 'Zásuvka ABB Tango', quantity: 50, matchedCode: 'ZAS-ABB', currentStock: 420, unitPrice: 4.80 },
    ],
    estimatedValue: 1040.00,
    confidence: 78,
    suggestedActions: [
      { id: 'respond-prices', label: 'Odpovedať s cenami', icon: '💰', color: 'blue', priority: 1 },
      { id: 'create-quote', label: 'Vytvoriť CP', icon: '🟢', color: 'green', priority: 2 },
      { id: 'offer-vip-discount', label: 'Navrhnúť zľavu pre VIP', icon: '⭐', color: 'yellow', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Cenový dopyt na svietidlá', date: '2024-01-15', resolution: 'Cenník odoslaný, objednávka o 5 dní' },
    ],
    sentiment: 'neutral' as const,
  },
  6: {
    recognizedCustomer: {
      name: 'Ján Horák',
      company: 'HagardHal s.r.o.',
      totalOrders: 48,
      lastOrderDate: '2024-02-24',
      creditTerms: 30,
      discount: 8.5,
    },
    extractedItems: [
      { product: 'Káblový mostík KM-300', quantity: 100, matchedCode: 'KMO-300', currentStock: 580, unitPrice: 12.50 },
      { product: 'Svorka KS-M8', quantity: 400, matchedCode: 'SVO-M8', currentStock: 2100, unitPrice: 0.85 },
    ],
    estimatedValue: 1590.00,
    confidence: 98,
    suggestedActions: [
      { id: 'auto-confirm-edi', label: '🟢 Automaticky potvrdiť EDI', icon: '🟢', color: 'green', priority: 1 },
      { id: 'check-stock', label: 'Skontrolovať skladové zásoby', icon: '📦', color: 'blue', priority: 2 },
      { id: 'generate-dl', label: 'Generovať DL', icon: '📄', color: 'blue', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'EDI objednávka #892', date: '2024-02-20', resolution: 'Automaticky spracovaná, expedované do 48h' },
      { subject: 'EDI objednávka #867', date: '2024-02-12', resolution: 'Automaticky spracovaná bez problémov' },
    ],
    sentiment: 'positive' as const,
  },
  7: {
    recognizedCustomer: {
      name: 'Martin Novák',
      company: 'KábelPro s.r.o.',
      totalOrders: 19,
      lastOrderDate: '2024-02-15',
      creditTerms: 21,
      discount: 5.5,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 88,
    suggestedActions: [
      { id: 'open-complaint', label: '🔴 Založiť reklamačný prípad', icon: '🔴', color: 'red', priority: 1 },
      { id: 'contact-warehouse', label: 'Kontaktovať sklad', icon: '📞', color: 'blue', priority: 2 },
      { id: 'offer-replacement', label: 'Navrhnúť náhradu', icon: '🔄', color: 'green', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Reklamácia - poškodený kábel', date: '2024-01-22', resolution: 'Výmena do 5 dní, zákazník spokojný' },
    ],
    sentiment: 'negative' as const,
  },
  8: {
    recognizedCustomer: {
      name: 'Eva Tóthová',
      company: 'MegaStav a.s.',
      totalOrders: 56,
      lastOrderDate: '2024-02-22',
      creditTerms: 30,
      discount: 9.0,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 92,
    suggestedActions: [
      { id: 'check-order-status', label: 'Skontrolovať stav objednávky', icon: '🔍', color: 'blue', priority: 1 },
      { id: 'respond-delivery-status', label: 'Odpovedať so stavom dodania', icon: '📧', color: 'green', priority: 2 },
      { id: 'contact-logistics', label: 'Kontaktovať logistiku', icon: '🚚', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Dopyt na stav objednávky #1245', date: '2024-02-10', resolution: 'Expedované, tracking číslo odoslané' },
      { subject: 'Kedy príde objednávka?', date: '2024-01-28', resolution: 'Doručené nasledujúci deň' },
    ],
    sentiment: 'neutral' as const,
  },
  9: {
    recognizedCustomer: {
      name: 'Michal Balog',
      company: 'ElektroPro s.r.o.',
      totalOrders: 27,
      lastOrderDate: '2024-02-19',
      creditTerms: 30,
      discount: 6.0,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 85,
    suggestedActions: [
      { id: 'check-invoice', label: '🟡 Skontrolovať faktúru', icon: '🟡', color: 'yellow', priority: 1 },
      { id: 'create-credit-note', label: 'Vytvoriť dobropis', icon: '📝', color: 'green', priority: 2 },
      { id: 'escalate-accounting', label: 'Eskalovať účtovníctvu', icon: '🔄', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Chyba vo faktúre FA-2024/1802', date: '2024-02-05', resolution: 'Dobropis vygenerovaný, zákazník spokojný' },
    ],
    sentiment: 'neutral' as const,
  },
  10: {
    recognizedCustomer: {
      name: 'Jozef Mrva',
      company: 'Mesto Prešov',
      totalOrders: 3,
      lastOrderDate: '2023-11-10',
      creditTerms: 60,
      discount: 12.0,
    },
    extractedItems: [
      { product: 'Stĺp verejného osvetlenia VO-8m', quantity: 45, matchedCode: 'SVO-08', currentStock: 12, unitPrice: 890.00 },
      { product: 'LED svietidlo VO 150W', quantity: 45, matchedCode: 'LED-VO150', currentStock: 67, unitPrice: 245.00 },
      { product: 'Káblový box podzemný', quantity: 45, matchedCode: 'KBX-P', currentStock: 34, unitPrice: 78.00 },
    ],
    estimatedValue: 54585.00,
    confidence: 89,
    suggestedActions: [
      { id: 'prepare-tender', label: '📋 Pripraviť ponuku do tendra', icon: '📋', color: 'blue', priority: 1 },
      { id: 'schedule-inspection', label: 'Naplánovať obhliadku', icon: '🏗️', color: 'green', priority: 2 },
      { id: 'escalate-management', label: 'Eskalovať vedeniu', icon: '⬆️', color: 'red', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Výberové konanie - rekonštrukcia osvetlenia', date: '2023-10-15', resolution: 'Tender vyhraný, projekt 120k EUR' },
    ],
    sentiment: 'positive' as const,
  },
  11: {
    recognizedCustomer: {
      name: 'Ján Horák',
      company: 'HagardHal s.r.o.',
      totalOrders: 49,
      lastOrderDate: '2024-02-25',
      creditTerms: 30,
      discount: 8.5,
    },
    extractedItems: [
      { product: 'Káblový systém KS-200', quantity: 80, matchedCode: 'KSY-200', currentStock: 340, unitPrice: 18.50 },
      { product: 'Upevňovacia sada US-200', quantity: 40, matchedCode: 'UPS-200', currentStock: 520, unitPrice: 5.20 },
    ],
    estimatedValue: 1688.00,
    confidence: 96,
    suggestedActions: [
      { id: 'auto-process', label: '🟢 Automaticky spracovať', icon: '🟢', color: 'green', priority: 1 },
      { id: 'update-frame-contract', label: 'Aktualizovať rámcovú zmluvu', icon: '📄', color: 'blue', priority: 2 },
      { id: 'generate-dl', label: 'Generovať DL', icon: '📦', color: 'blue', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Pravidelná objednávka január', date: '2024-01-25', resolution: 'Automaticky spracovaná' },
      { subject: 'Pravidelná objednávka december', date: '2023-12-28', resolution: 'Automaticky spracovaná' },
    ],
    sentiment: 'positive' as const,
  },
  12: {
    recognizedCustomer: {
      name: 'Roman Kocúr',
      company: 'TechInstall s.r.o.',
      totalOrders: 14,
      lastOrderDate: '2024-02-08',
      creditTerms: 21,
      discount: 4.5,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 73,
    suggestedActions: [
      { id: 'respond-technical', label: '📚 Odpovedať s technickými info', icon: '📚', color: 'blue', priority: 1 },
      { id: 'send-catalog', label: 'Zaslať katalógový list', icon: '📖', color: 'green', priority: 2 },
      { id: 'assign-tech-rep', label: 'Priradiť technickému OZ', icon: '👨‍🔧', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Technické parametre KZL systému', date: '2024-01-18', resolution: 'Katalóg odoslaný, následná objednávka 2800 EUR' },
    ],
    sentiment: 'neutral' as const,
  },
  13: {
    recognizedCustomer: {
      name: 'Zuzana Králiková',
      company: 'StavbyPlus s.r.o.',
      totalOrders: 21,
      lastOrderDate: '2024-02-16',
      creditTerms: 30,
      discount: 5.5,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 91,
    suggestedActions: [
      { id: 'escalate-logistics', label: '🔴 Eskalovať logistike', icon: '🔴', color: 'red', priority: 1 },
      { id: 'offer-compensation', label: 'Ponúknuť kompenzáciu', icon: '💶', color: 'yellow', priority: 2 },
      { id: 'respond-apology', label: 'Odpovedať s ospravedlnením', icon: '📧', color: 'blue', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Oneskorená dodávka objednávky #1678', date: '2024-01-29', resolution: '10% zľava na ďalšiu objednávku, zákazník spokojný' },
    ],
    sentiment: 'negative' as const,
  },
  14: {
    recognizedCustomer: {
      name: 'Pavol Hudák',
      company: 'Nový zákazník',
      totalOrders: 0,
      lastOrderDate: '',
      creditTerms: 0,
      discount: 0,
    },
    extractedItems: [
      { product: 'Vzorka KZL100x60/3', quantity: 2, matchedCode: 'KNS-001-V', currentStock: 5, unitPrice: 0.00 },
      { product: 'Vzorka káblového mostíka', quantity: 1, matchedCode: 'KMO-300-V', currentStock: 3, unitPrice: 0.00 },
    ],
    estimatedValue: 0,
    confidence: 82,
    suggestedActions: [
      { id: 'prepare-samples', label: '📦 Pripraviť vzorky', icon: '📦', color: 'green', priority: 1 },
      { id: 'create-free-dl', label: 'Vytvoriť bezplatnú DL', icon: '📄', color: 'blue', priority: 2 },
      { id: 'schedule-visit', label: 'Naplánovať návštevu', icon: '📅', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Požiadavka na vzorky od ProfiStav', date: '2024-01-20', resolution: 'Vzorky odoslané, objednávka 5600 EUR o 2 týždne' },
    ],
    sentiment: 'positive' as const,
  },
  15: {
    recognizedCustomer: {
      name: 'Ladislav Žitný',
      company: 'ElektroMontáž s.r.o.',
      totalOrders: 33,
      lastOrderDate: '2024-02-21',
      creditTerms: 21,
      discount: 6.5,
    },
    extractedItems: [
      { product: 'LED panel 60x60 40W', quantity: 15, matchedCode: 'LED-6040', currentStock: 145, unitPrice: 32.00 },
      { product: 'Zásuvka ABB Tango', quantity: 30, matchedCode: 'ZAS-ABB', currentStock: 420, unitPrice: 4.80 },
    ],
    estimatedValue: 624.00,
    confidence: 76,
    suggestedActions: [
      { id: 'modify-order', label: '🟡 Upraviť objednávku', icon: '🟡', color: 'yellow', priority: 1 },
      { id: 'recalculate-quote', label: 'Prepočítať CP', icon: '🔢', color: 'blue', priority: 2 },
      { id: 'verify-availability', label: 'Overiť dostupnosť', icon: '✅', color: 'green', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Zmena objednávky #1534', date: '2024-02-03', resolution: 'Upravená CP odoslaná, potvrdená' },
    ],
    sentiment: 'neutral' as const,
  },
  16: {
    recognizedCustomer: {
      name: 'Miroslav Sedlák',
      company: 'Nový zákazník',
      totalOrders: 0,
      lastOrderDate: '',
      creditTerms: 0,
      discount: 0,
    },
    extractedItems: [
      { product: 'Káblový systém KS-200', quantity: 120, matchedCode: 'KSY-200', currentStock: 340, unitPrice: 18.50 },
      { product: 'Prípojnicový systém PS-400A', quantity: 10, matchedCode: 'PBS-400', currentStock: 56, unitPrice: 385.00 },
    ],
    estimatedValue: 6070.00,
    confidence: 68,
    suggestedActions: [
      { id: 'create-customer', label: '👤 Založiť zákazníka', icon: '👤', color: 'green', priority: 1 },
      { id: 'verify-finstat', label: 'Overiť na FinStat', icon: '🔍', color: 'blue', priority: 2 },
      { id: 'assign-rep', label: 'Priradiť OZ', icon: '🟠', color: 'orange', priority: 3 },
      { id: 'send-catalog', label: 'Zaslať katalóg', icon: '📖', color: 'blue', priority: 4 },
    ],
    similarPastEmails: [],
    sentiment: 'positive' as const,
  },
  17: {
    recognizedCustomer: {
      name: 'Katarína Bučková',
      company: 'EnergoBuild a.s.',
      totalOrders: 42,
      lastOrderDate: '2024-02-17',
      creditTerms: 45,
      discount: 10.0,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 79,
    suggestedActions: [
      { id: 'prepare-frame-contract', label: '📋 Pripraviť návrh zmluvy', icon: '📋', color: 'blue', priority: 1 },
      { id: 'escalate-management', label: 'Eskalovať vedeniu', icon: '⬆️', color: 'red', priority: 2 },
      { id: 'schedule-meeting', label: 'Naplánovať stretnutie', icon: '📅', color: 'green', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Rámcová zmluva HagardHal', date: '2023-06-12', resolution: 'Zmluva podpísaná, ročný obrat 180k EUR' },
    ],
    sentiment: 'positive' as const,
  },
  18: {
    recognizedCustomer: {
      name: 'Filip Grega',
      company: 'InstalPro s.r.o.',
      totalOrders: 16,
      lastOrderDate: '2024-02-14',
      creditTerms: 21,
      discount: 5.0,
    },
    extractedItems: [],
    estimatedValue: 0,
    confidence: 94,
    suggestedActions: [
      { id: 'open-complaint', label: '🔴 Založiť reklamačný prípad', icon: '🔴', color: 'red', priority: 1 },
      { id: 'verify-dl-order', label: 'Overiť DL vs objednávka', icon: '🔍', color: 'yellow', priority: 2 },
      { id: 'send-missing-items', label: 'Doplniť chýbajúci tovar', icon: '📦', color: 'green', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Chýbajúce položky v dodávke', date: '2024-01-24', resolution: 'Chýbajúci tovar expedovaný do 24h' },
    ],
    sentiment: 'negative' as const,
  },
  19: {
    recognizedCustomer: {
      name: 'Igor Benko',
      company: 'Mesto Bardejov',
      totalOrders: 5,
      lastOrderDate: '2023-09-15',
      creditTerms: 60,
      discount: 11.0,
    },
    extractedItems: [
      { product: 'Stĺp verejného osvetlenia VO-10m', quantity: 28, matchedCode: 'SVO-10', currentStock: 8, unitPrice: 1050.00 },
      { product: 'LED svietidlo VO 200W', quantity: 28, matchedCode: 'LED-VO200', currentStock: 45, unitPrice: 295.00 },
    ],
    estimatedValue: 37660.00,
    confidence: 86,
    suggestedActions: [
      { id: 'create-quote', label: 'Vytvoriť CP', icon: '🟢', color: 'green', priority: 1 },
      { id: 'send-static-analysis', label: 'Zaslať statický posudok', icon: '📊', color: 'blue', priority: 2 },
      { id: 'assign-specialist', label: 'Priradiť špecialistovi', icon: '👨‍🔧', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'Verejné osvetlenie - dopyt Prešov', date: '2023-10-15', resolution: 'CP vytvorená, projekt vyhraný 120k EUR' },
    ],
    sentiment: 'positive' as const,
  },
  20: {
    recognizedCustomer: {
      name: 'Ján Horák',
      company: 'HagardHal s.r.o.',
      totalOrders: 50,
      lastOrderDate: '2024-02-26',
      creditTerms: 30,
      discount: 8.5,
    },
    extractedItems: [
      { product: 'Káblový mostík KM-300', quantity: 100, matchedCode: 'KMO-300', currentStock: 580, unitPrice: 14.80 },
      { product: 'Svorka KS-M8', quantity: 400, matchedCode: 'SVO-M8', currentStock: 2100, unitPrice: 0.90 },
    ],
    estimatedValue: 1840.00,
    confidence: 72,
    suggestedActions: [
      { id: 'pause-edi-order', label: '⚠️ Pozastaviť EDI objednávku', icon: '⚠️', color: 'yellow', priority: 1 },
      { id: 'check-price-list', label: 'Skontrolovať cenník', icon: '💰', color: 'blue', priority: 2 },
      { id: 'contact-customer', label: 'Kontaktovať zákazníka', icon: '📞', color: 'orange', priority: 3 },
    ],
    similarPastEmails: [
      { subject: 'EDI objednávka - cenový nesúlad', date: '2024-01-30', resolution: 'Cenník aktualizovaný, objednávka potvrdená' },
    ],
    sentiment: 'neutral' as const,
  },
};

export function CustomerAgent() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionResult, setActionResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'original'>('ai');
  const [qKeyPressed, setQKeyPressed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        setQKeyPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        setQKeyPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const loadData = async () => {
    try {
      const [emailsData, customersData, repsData] = await Promise.all([
        api.getEmails(),
        api.getCustomers(),
        api.getSalesReps(),
      ]);
      
      // Inject AI analysis and limit to 20 emails
      const enrichedEmails = emailsData
        .slice(0, 20)
        .map((email: Email) => ({
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

  const generateActionOutput = (actionId: string): string => {
    if (!selectedEmail?.aiAnalysis) return '';

    const analysis = selectedEmail.aiAnalysis;
    const customer = analysis.recognizedCustomer;

    switch (actionId) {
      case 'create-quote':
        let quoteOutput = `📄 CENOVÁ PONUKA #CP-2024-${Math.floor(Math.random() * 9000) + 1000}\n\n`;
        quoteOutput += `Zákazník: ${customer.company}\n`;
        quoteOutput += `Kontakt: ${customer.name}\n`;
        quoteOutput += `Dátum: ${new Date().toLocaleDateString('sk-SK')}\n`;
        quoteOutput += `Platnosť: 14 dní\n\n`;
        quoteOutput += `POLOŽKY:\n`;
        quoteOutput += `${'─'.repeat(60)}\n`;
        
        if (analysis.extractedItems.length > 0) {
          analysis.extractedItems.forEach((item, idx) => {
            const total = item.quantity * item.unitPrice;
            quoteOutput += `${idx + 1}. ${item.product}\n`;
            quoteOutput += `   Kód: ${item.matchedCode} | ${item.quantity}x ${formatCurrency(item.unitPrice)} = ${formatCurrency(total)}\n\n`;
          });
          
          const subtotal = analysis.estimatedValue;
          const discount = subtotal * (customer.discount / 100);
          const total = subtotal - discount;
          
          quoteOutput += `${'─'.repeat(60)}\n`;
          quoteOutput += `Medzisúčet: ${formatCurrency(subtotal)}\n`;
          quoteOutput += `Zľava (${customer.discount}%): -${formatCurrency(discount)}\n`;
          quoteOutput += `\n✅ CELKOM: ${formatCurrency(total)}\n\n`;
          quoteOutput += `Splatnosť: ${customer.creditTerms} dní\n`;
          quoteOutput += `Dodacia lehota: 5-7 pracovných dní`;
        }
        return quoteOutput;

      case 'respond-prices':
        return `📧 ODPOVEĎ S CENAMI\n\nDobrý deň,\n\nďakujeme za Váš dopyt. Zasielame Vám aktuálny cenník požadovaných položiek:\n\n${
          analysis.extractedItems.map((item, idx) => 
            `${idx + 1}. ${item.product} (${item.matchedCode})\n   Cena: ${formatCurrency(item.unitPrice)}/ks\n   Dostupnosť: ${item.currentStock} ks na sklade`
          ).join('\n\n')
        }\n\n${customer.discount > 0 ? `Pre Vás platí zľava ${customer.discount}% na všetky položky.\n\n` : ''}V prípade otázok nás neváhajte kontaktovať.\n\nS pozdravom,\nStrader Agent`;

      case 'request-info':
        return `📧 ŽIADOSŤ O DOPLNENIE ÚDAJOV\n\nDobrý deň,\n\nďakujeme za Váš dopyt. Pre presné spracovanie Vašej objednávky potrebujeme doplniť nasledovné údaje:\n\n• Presné kódy produktov alebo detailný popis\n• Požadované množstvá\n• Termín dodania\n• Dodacia adresa\n• IČO a DIČ pre vystavenie faktúry\n\nPo doplnení týchto informácií Vám radi pripravíme cenovú ponuku.\n\nS pozdravom,\nStrader Agent`;

      case 'escalate-urgent':
        return `🔴 ESKALÁCIA VEDENIU\n\n⚠️ URGENTNÁ OBJEDNÁVKA\n\nZákazník: ${customer.company}\nKontakt: ${customer.name}\nHodnota: ${formatCurrency(analysis.estimatedValue)}\n\nPožadované položky:\n${analysis.extractedItems.map(item => `• ${item.product} (${item.quantity}x)`).join('\n')}\n\n✅ STATUS:\n• Vedenie informované\n• Priorita: VYSOKÁ\n• Sklad kontaktovaný pre overenie dostupnosti\n• Expedícia možná do 24h\n• Obchodný zástupca pridelený: ${customer.name}\n\nAkcia: Pripraviť expresnú cenovú ponuku a kontaktovať zákazníka telefonicky.`;

      case 'check-stock':
        return `📦 KONTROLA SKLADU\n\n${analysis.extractedItems.length > 0 ? 
          analysis.extractedItems.map(item => 
            `✅ ${item.product}\n   Kód: ${item.matchedCode}\n   Na sklade: ${item.currentStock} ks\n   Požadované: ${item.quantity} ks\n   ${item.currentStock >= item.quantity ? '🟢 DOSTUPNÉ' : '🔴 NEDOSTATOK'}`
          ).join('\n\n') :
          '✅ Všetky položky overené\n🟢 Dostupnosť na sklade je dostatočná'
        }\n\n${analysis.extractedItems.every(item => item.currentStock >= item.quantity) ? 
          '✅ Všetky položky sú dostupné. Možná okamžitá expedícia.' : 
          '⚠️ Niektoré položky vyžadujú doplnenie skladu. Očakávaný termín: 3-5 dní.'}`;

      case 'create-express-quote':
        return `⚡ EXPRESNÁ CENOVÁ PONUKA #CP-EX-2024-${Math.floor(Math.random() * 900) + 100}\n\n🔴 PRIORITA: VYSOKÁ\n\nZákazník: ${customer.company}\nDátum: ${new Date().toLocaleDateString('sk-SK')}\nPlatnosť: 48 hodín\n\n${analysis.extractedItems.map((item, idx) => 
          `${idx + 1}. ${item.product}\n   ${item.quantity}x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.quantity * item.unitPrice)}`
        ).join('\n\n')}\n\n✅ CELKOM: ${formatCurrency(analysis.estimatedValue * (1 - customer.discount / 100))}\n\n⚡ EXPRESNÁ EXPEDÍCIA: do 24 hodín\n📦 Dostupnosť overená\n✅ Pripravené k odoslaniu`;

      case 'offer-vip-discount':
        return `⭐ ŠPECIÁLNA PONUKA PRE VIP ZÁKAZNÍKA\n\nVážený zákazník ${customer.company},\n\nna základe Vašej dlhodobej spolupráce (${customer.totalOrders} objednávok) Vám ponúkame špeciálnu zľavu:\n\n📊 Štandardná cena: ${formatCurrency(analysis.estimatedValue)}\n⭐ VIP zľava: ${customer.discount + 3}% (bežná ${customer.discount}% + 3% bonus)\n💰 Vaša cena: ${formatCurrency(analysis.estimatedValue * (1 - (customer.discount + 3) / 100))}\n\n🎁 UŠETRÍTE: ${formatCurrency(analysis.estimatedValue * 0.03)}\n\nPonuka platí do: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n\nĎakujeme za Vašu dôveru!`;

      case 'auto-confirm-edi':
        return `🟢 EDI OBJEDNÁVKA AUTOMATICKY POTVRDENÁ\n\nObjednávka: #EDI-${customer.company.substring(0, 2).toUpperCase()}-2024-${Math.floor(Math.random() * 900) + 100}\nZákazník: ${customer.company}\nDátum prijatia: ${new Date().toLocaleString('sk-SK')}\n\n✅ STATUS: AUTOMATICKY SPRACOVANÁ\n\n📋 Položky:\n${analysis.extractedItems.map(item => `• ${item.product}: ${item.quantity}x`).join('\n')}\n\n💰 Celková hodnota: ${formatCurrency(analysis.estimatedValue)}\n📦 Sklad: Všetky položky dostupné\n🚚 Expedícia: Naplánovaná na ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n📧 Potvrdenie odoslané zákazníkovi\n\n✅ Žiadna ďalšia akcia nie je potrebná.`;

      case 'generate-dl':
        return `📄 DODACÍ LIST #DL-2024-${Math.floor(Math.random() * 9000) + 1000}\n\nOdberateľ: ${customer.company}\nAdresa: ${customer.name}\nIČO: ${Math.floor(Math.random() * 90000000) + 10000000}\n\nDátum expedície: ${new Date().toLocaleDateString('sk-SK')}\n\n${analysis.extractedItems.map((item, idx) => 
          `${idx + 1}. ${item.product}\n   Kód: ${item.matchedCode}\n   Množstvo: ${item.quantity} ${item.product.includes('kábel') || item.product.includes('Kábel') ? 'm' : 'ks'}`
        ).join('\n\n')}\n\n📦 Počet balíkov: ${Math.ceil(analysis.extractedItems.length / 2)}\n⚖️ Celková hmotnosť: ${(analysis.estimatedValue / 100).toFixed(1)} kg\n🚚 Prepravca: DPD Slovakia\n📍 Tracking: SK${Math.floor(Math.random() * 900000000) + 100000000}\n\n✅ Pripravené k expedícii`;

      case 'open-complaint':
        return `🔴 REKLAMAČNÝ PRÍPAD ZALOŽENÝ\n\nČíslo prípadu: #RK-2024-${Math.floor(Math.random() * 900) + 100}\nZákazník: ${customer.company}\nKontakt: ${customer.name}\nDátum: ${new Date().toLocaleDateString('sk-SK')}\n\n📋 Kategória: ${actionId.includes('poškodený') ? 'Poškodený tovar' : 'Chýbajúci tovar'}\n⚠️ Priorita: VYSOKÁ\n\n👤 Pridelené: Sklad Stropkov\n📧 Zákazník informovaný o začatí reklamácie\n⏱️ Predpokladané vybavenie: 5 pracovných dní\n\n✅ Ďalšie kroky:\n1. Fotodokumentácia od zákazníka\n2. Kontrola dodacieho listu\n3. Príprava náhradnej zásielky\n4. Vybavenie reklamácie`;

      case 'contact-warehouse':
        return `📞 KONTAKT SO SKLADOM\n\n📦 Sklad: Stropkov\n⏰ Čas kontaktu: ${new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}\n\n✅ Informácie získané:\n• Všetky položky skontrolované\n• ${analysis.extractedItems.length > 0 ? 'Dostupnosť potvrdená' : 'Príprava náhradnej zásielky'}\n• Expedícia možná do 24 hodín\n• Zodpovedný: Ing. Ján Kováč\n\n📋 Aktuálny stav skladu:\n${analysis.extractedItems.map(item => `• ${item.product}: ${item.currentStock} ks`).join('\n') || '• Položky pripravené na expedíciu'}\n\n✅ Akcia: Pripraviť zásielku pre zákazníka`;

      case 'offer-replacement':
        return `🔄 NÁVRH NÁHRADY\n\nDobrý deň,\n\nomúvame sa za vzniknuté problémy s Vašou objednávkou.\n\n📋 Navrhujeme nasledovné riešenie:\n\n1. ✅ OKAMŽITÁ NÁHRADA\n   • Nová zásielka pripravená\n   • Expedícia do 24 hodín\n   • Doprava ZDARMA\n\n2. 💰 FINANČNÁ KOMPENZÁCIA\n   • Zľava 15% na túto objednávku\n   • Dobropis ${formatCurrency((analysis.estimatedValue || 500) * 0.15)}\n\n3. ⭐ BONUS\n   • Extra 5% zľava na nasledujúcu objednávku\n   • Prednostné vybavenie budúcich objednávok\n\nVyberte si preferované riešenie alebo nás kontaktujte pre iné možnosti.\n\nS úctou,\nStrader Agent`;

      case 'check-order-status':
        return `🔍 STAV OBJEDNÁVKY #${Math.floor(Math.random() * 9000) + 1000}\n\nZákazník: ${customer.company}\nDátum objednávky: ${new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n\n📊 ČASOVÁ OS:\n\n✅ ${new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - Objednávka prijatá\n✅ ${new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - Spracované na sklade\n✅ ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - Expedované\n🚚 ${new Date().toLocaleDateString('sk-SK')} - V preprave\n📍 ${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - Očakávané doručenie\n\n📦 Prepravca: DPD Slovakia\n🔗 Tracking: SK${Math.floor(Math.random() * 900000000) + 100000000}\n📍 Aktuálna pozícia: Distribučné centrum Košice\n\n✅ Zásielka je v poriadku a mala by byť doručená zajtra.`;

      case 'respond-delivery-status':
        return `📧 ODPOVEĎ SO STAVOM DODANIA\n\nDobrý deň,\n\nVáš dopyt ohľadom stavu objednávky:\n\n📦 Objednávka: #${Math.floor(Math.random() * 9000) + 1000}\n✅ Status: V PREPRAVE\n\n🚚 Informácie o zásielke:\n• Expedované: ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n• Prepravca: DPD Slovakia\n• Tracking číslo: SK${Math.floor(Math.random() * 900000000) + 100000000}\n• Očakávané doručenie: ${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n\n🔗 Sledovanie zásielky: https://www.dpd.com/sk/tracking\n\nV prípade akýchkoľvek otázok nás neváhajte kontaktovať.\n\nS pozdravom,\nStrader Agent`;

      case 'contact-logistics':
        return `🚚 KONTAKT S LOGISTIKOU\n\n📞 Oddelenie: Logistika & Expedícia\n⏰ Čas: ${new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}\n\n✅ ZÍSKANÉ INFORMÁCIE:\n\n📦 Objednávka zákazníka: ${customer.company}\n🔍 Tracking: SK${Math.floor(Math.random() * 900000000) + 100000000}\n📍 Aktuálna pozícia: Distribučné centrum\n⏱️ Odhadovaný čas doručenia: ${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n\n👤 Zodpovedná osoba: Mgr. Peter Novák\n📧 Email: peter.novak@strader.sk\n📱 Tel: +421 905 123 456\n\n✅ Akcia: Zákazník bude informovaný o aktuálnom stave`;

      case 'check-invoice':
        return `🟡 KONTROLA FAKTÚRY\n\nFaktúra: #FA-2024-${Math.floor(Math.random() * 9000) + 1000}\nZákazník: ${customer.company}\nDátum vystavenia: ${new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n\n🔍 AI ANALÝZA FAKTÚRY:\n\n✅ Kontrolované položky:\n• IČO a DIČ: Správne\n• Dodacia adresa: Správna\n• Dátum splatnosti: Správny (${customer.creditTerms} dní)\n\n⚠️ NÁJDENÉ ROZDIELY:\n\n1. Množstvo položky "Káblový systém KS-200"\n   • Fakturované: 120 ks\n   • Dodané: 100 ks\n   • Rozdiel: 20 ks\n   • Hodnota: ${formatCurrency(20 * 18.50)}\n\n📊 Odporúčaná akcia:\n✅ Vytvoriť dobropis na sumu ${formatCurrency(20 * 18.50)}\n📧 Kontaktovať zákazníka s ospravedlnením`;

      case 'create-credit-note':
        return `📝 DOBROPIS VYGENEROVANÝ\n\nDobropis: #DB-2024-${Math.floor(Math.random() * 900) + 100}\nK faktúre: #FA-2024-${Math.floor(Math.random() * 9000) + 1000}\nZákazník: ${customer.company}\nDátum: ${new Date().toLocaleDateString('sk-SK')}\n\n📋 DÔVOD:\nOprava fakturačnej chyby - nesprávne uvedené množstvo\n\n💰 SUMA DOBROPISU: ${formatCurrency((analysis.estimatedValue || 1000) * 0.1)}\n\n✅ STATUS:\n• Dobropis vytvorený v systéme\n• Odoslaný do účtovníctva na schválenie\n• Zákazník bude informovaný emailom\n• Suma bude pripísaná do 3 pracovných dní\n\n📧 Automatický email odoslaný zákazníkovi s kópiou dobropisu.`;

      case 'escalate-accounting':
        return `🔄 ESKALÁCIA ÚČTOVNÍCTVU\n\n⚠️ PRIORITA: STREDNÁ\n\nZákazník: ${customer.company}\nProblém: Chyba vo faktúre\nHodnota: ${formatCurrency((analysis.estimatedValue || 1000) * 0.1)}\n\n📋 ESKALOVANÉ NA:\n👤 Vedúca účtovníctva: Ing. Jana Kováčová\n📧 jana.kovacova@strader.sk\n📱 +421 907 234 567\n\n✅ AKCIE VYKONANÉ:\n• Problém popísaný a zdokumentovaný\n• Priložené doklady: Faktúra, Dodací list\n• Urgencia: Do 3 pracovných dní\n• Zákazník informovaný o riešení\n\n⏰ Očakávané vybavenie: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}`;

      case 'prepare-tender':
        return `📋 PONUKA DO VEREJNÉHO OBSTARÁVANIA\n\nObjednávateľ: ${customer.company}\nNázov: Modernizácia verejného osvetlenia\nHodnota: ${formatCurrency(analysis.estimatedValue)}\n\n📑 PRIPRAVENÉ DOKUMENTY:\n\n1. ✅ Technická špecifikácia\n   • Katalógové listy všetkých produktov\n   • Certifikáty zhody CE\n   • Statické posudky\n\n2. ✅ Cenová kalkulácia\n   • Položkový rozpočet\n   • Dodacia lehota: 45 dní\n   • Záruka: 5 rokov\n\n3. ✅ Referencie\n   • ${customer.totalOrders > 0 ? `${customer.totalOrders} úspešných projektov` : '15 úspešných projektov'}\n   • Referencie od miest a obcí\n\n📅 Termín podania: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n✅ Ponuka kompletná a pripravená na odoslanie`;

      case 'schedule-inspection':
        return `🏗️ PLÁNOVANIE OBHLIADKY\n\nProjekt: ${customer.company}\nTyp: Technická obhliadka a zameranie\n\n📅 NAVRHOVANÉ TERMÍNY:\n\n1. ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 10:00\n2. ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 14:00\n3. ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 09:00\n\n👥 ÚČASTNÍCI:\n• Technický špecialista: Ing. Marián Horváth\n• Obchodný zástupca: ${customer.name}\n• Zástupca zákazníka\n\n📋 PROGRAM:\n• Obhliadka lokality (1-2 hodiny)\n• Zameranie rozmerov\n• Konzultácia technických riešení\n• Príprava finálnej ponuky\n\n📧 Pozvánka odoslaná zákazníkovi na schválenie termínu.`;

      case 'escalate-management':
        return `⬆️ ESKALÁCIA VEDENIU\n\n🔴 PRIORITA: VYSOKÁ\n\nZákazník: ${customer.company}\nTyp: ${analysis.estimatedValue > 10000 ? 'Veľký projekt / Tender' : 'Rámcová zmluva'}\nHodnota: ${formatCurrency(analysis.estimatedValue)}\n\n📋 DÔVOD ESKALÁCIE:\n• Vysoká hodnota projektu\n• Potreba schválenia vedenia\n• Strategický zákazník\n• Dlhodobá spolupráca\n\n👥 ESKALOVANÉ NA:\n• Obchodný riaditeľ: Ing. Peter Novák\n• Email: peter.novak@strader.sk\n• Tel: +421 905 111 222\n\n✅ AKCIE:\n• Kompletná dokumentácia pripravená\n• Urgentné prerokovanie\n• Termín: Do 48 hodín\n\n⏰ Očakávané vybavenie: ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}`;

      case 'auto-process':
        return `🟢 AUTOMATICKÉ SPRACOVANIE\n\nObjednávka: #${Math.floor(Math.random() * 9000) + 1000}\nZákazník: ${customer.company}\nTyp: Rámcová zmluva - pravidelná objednávka\n\n✅ AUTOMATICKY VYKONANÉ:\n\n1. ✅ Overenie rámcovej zmluvy\n   • Zmluva platná do: 31.12.2024\n   • Mesačný limit: ${formatCurrency(5000)}\n   • Aktuálny obrat: ${formatCurrency(analysis.estimatedValue)}\n\n2. ✅ Kontrola skladu\n   • Všetky položky dostupné\n   • Rezervácia vytvorená\n\n3. ✅ Vytvorenie objednávky\n   • Automaticky potvrdené\n   • Zľava ${customer.discount}% aplikovaná\n\n4. ✅ Expedícia\n   • Naplánovaná na ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n   • Dodací list pripravený\n\n📧 Potvrdenie odoslané zákazníkovi\n✅ Žiadna ďalšia akcia nie je potrebná`;

      case 'update-frame-contract':
        return `📄 AKTUALIZÁCIA RÁMCOVEJ ZMLUVY\n\nZmluva: #RZ-2024-${Math.floor(Math.random() * 900) + 100}\nZákazník: ${customer.company}\n\n📊 ŠTATISTIKA:\n• Objednávok tento mesiac: 4\n• Hodnota tento mesiac: ${formatCurrency(analysis.estimatedValue * 4)}\n• Celková hodnota zmluvy: ${formatCurrency(analysis.estimatedValue * 12)}\n\n✅ AKTUALIZOVANÉ:\n• Počet objednávok: +1\n• Celkový obrat: +${formatCurrency(analysis.estimatedValue)}\n• Zostávajúci limit: ${formatCurrency(60000 - analysis.estimatedValue * 4)}\n\n📈 TREND:\n🟢 Stabilný - pravidelné mesačné objednávky\n⭐ Odporúčanie: Ponúknuť predĺženie zmluvy s výhodnejšími podmienkami\n\n✅ Zmluva aktualizovaná v systéme`;

      case 'respond-technical':
        return `📚 TECHNICKÁ ODPOVEĎ\n\nDobrý deň,\n\nďakujeme za Váš technický dopyt. Zasielame požadované informácie:\n\n🔧 TECHNICKÉ PARAMETRE:\n\n${analysis.extractedItems.map((item, idx) => 
          `${idx + 1}. ${item.product}\n   • Kód: ${item.matchedCode}\n   • Materiál: Pozinkovaná oceľ\n   • Nosnosť: 50 kg/m\n   • Rozmer: Podľa normy\n   • Certifikát: CE, EN 61537`
        ).join('\n\n') || '• Kompletná technická dokumentácia\n   • Katalógové listy\n   • Certifikáty\n   • Návody na montáž'}\n\n📋 K dispozícii máme:\n• Technické výkresy\n• Certifikáty zhody\n• Návody na inštaláciu\n• Statické výpočty\n\nV prípade potreby viac informácií nás kontaktujte.\n\nS pozdravom,\nTechnické oddelenie Strader`;

      case 'send-catalog':
        return `📖 KATALÓGOVÝ LIST ODOSLANÝ\n\nZákazník: ${customer.company}\nKontakt: ${customer.name}\n\n📧 ODOSLANÉ DOKUMENTY:\n\n1. ✅ Hlavný produktový katalóg 2024\n   • 156 strán\n   • PDF formát\n   • Veľkosť: 24 MB\n\n2. ✅ Cenník platný od 01.2024\n   • Excel formát\n   • Aktualizovaný ${new Date().toLocaleDateString('sk-SK')}\n\n3. ✅ Technické špecifikácie\n   • Certifikáty CE\n   • Návody na montáž\n\n4. ✅ Referencie a realizácie\n   • Fotogaléria projektov\n   • Kontakty na referencie\n\n📧 Email odoslaný na: ${customer.name}@${customer.company.toLowerCase().replace(/[^a-z]/g, '')}.sk\n\n✅ Stav: Doručené (${new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })})`;

      case 'assign-tech-rep':
        return `👨‍🔧 PRIDELENIE TECHNICKÉHO ZÁSTUPCU\n\nZákazník: ${customer.company}\nTyp dopytu: Technická konzultácia\n\n👤 PRIDELENÝ ŠPECIALISTA:\n\nMeno: Ing. Marián Horváth\nPozícia: Technický špecialista\nSpecializácia: Káblové systémy & osvetlenie\nSkúsenosti: 12 rokov\n\n📧 Kontakt:\nEmail: marian.horvath@strader.sk\nTel: +421 907 345 678\nMobil: +421 905 345 678\n\n✅ AKCIE:\n• Zákazník informovaný\n• Prvý kontakt naplánovaný na dnes popoludní\n• Technická dokumentácia pripravená\n• Vzorky k dispozícii\n\n📋 Prideľujúci: AI Agent\n⏰ Čas: ${new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}`;

      case 'escalate-logistics':
        return `🔴 ESKALÁCIA LOGISTIKE\n\n⚠️ SŤAŽNOSŤ NA ONESKORENIE\n\nZákazník: ${customer.company}\nObjednávka: #${Math.floor(Math.random() * 9000) + 1000}\nOneskorenie: 3 dni\n\n📋 ESKALOVANÉ NA:\n👤 Vedúci logistiky: Mgr. Peter Novák\n📧 peter.novak@strader.sk\n📱 +421 905 123 456\n\n🔍 ANALÝZA PROBLÉMU:\n• Pôvodný termín: ${new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n• Aktuálny stav: V preprave\n• Dôvod oneskorenia: Nedostatok vodiča\n\n✅ RIEŠENIE:\n• Prioritná expedícia\n• Dodanie zajtra ráno\n• Kompenzácia: 10% zľava\n• Zákazník kontaktovaný telefonicky\n\n⏰ Očakávané doručenie: ${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} 09:00`;

      case 'offer-compensation':
        return `💶 NÁVRH KOMPENZÁCIE\n\nZákazník: ${customer.company}\nDôvod: Oneskorenie dodávky\n\n🎁 PONÚKAME KOMPENZÁCIU:\n\n1. 💰 FINANČNÁ ZĽAVA\n   • 10% zľava na túto objednávku\n   • Hodnota: ${formatCurrency((analysis.estimatedValue || 1000) * 0.1)}\n   • Dobropis vystavený automaticky\n\n2. ⭐ BUDÚCE VÝHODY\n   • Extra 5% zľava na nasledujúcu objednávku\n   • Prednostné vybavenie (VIP status)\n   • Platnosť: 3 mesiace\n\n3. 🚚 DOPRAVA ZDARMA\n   • Pri nasledujúcej objednávke\n   • Hodnota: až ${formatCurrency(50)}\n\n📧 Email s kompenzáciou odoslaný zákazníkovi.\n✅ Čakáme na potvrdenie prijatia.`;

      case 'respond-apology':
        return `📧 ODPOVEĎ S OSPRAVEDLNENÍM\n\nDobrý deň,\n\nz celého srdca sa ospravedlňujeme za oneskorenie Vašej objednávky.\n\n😔 Chápeme, že spoliehate sa na včasné dodanie a toto oneskorenie Vám spôsobilo komplikácie.\n\n✅ ČO SME UROBILI:\n• Identifikovali sme príčinu oneskorenia\n• Objednávka je teraz prioritná\n• Dodanie garantované do ${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n• Tracking: SK${Math.floor(Math.random() * 900000000) + 100000000}\n\n🎁 AKO KOMPENZÁCIU PONÚKAME:\n• 10% zľava na túto objednávku (${formatCurrency((analysis.estimatedValue || 1000) * 0.1)})\n• Dopravu ZDARMA pri ďalšej objednávke\n\nJešte raz sa ospravedlňujeme a ďakujeme za pochopenie.\n\nS pozdravom,\nStrader Agent\n+421 905 123 456`;

      case 'prepare-samples':
        return `📦 PRÍPRAVA VZORIEK\n\nZákazník: ${customer.company} (nový)\nKontakt: ${customer.name}\n\n✅ PRIPRAVOVANÉ VZORKY:\n\n${analysis.extractedItems.map((item, idx) => 
          `${idx + 1}. ${item.product}\n   • Množstvo: ${item.quantity}x vzorka\n   • Hodnota: ZDARMA\n   • Balenie: Reprezentatívne`
        ).join('\n\n') || '• Káblový systém KS-200 (2m)\n   • Káblový mostík KM-300 (1ks)\n   • Upevňovacia sada (komplet)'}\n\n📋 PRILOŽENÉ DOKUMENTY:\n• Katalógový list\n• Cenník\n• Technická špecifikácia\n• Návod na montáž\n• Certifikáty CE\n\n📦 BALENIE:\n• Kartónová krabica s logom\n• Ochranné obaly\n• Vizitky obchodného zástupcu\n\n🚚 Expedícia: ${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n✅ Vzorky pripravené na odoslanie`;

      case 'create-free-dl':
        return `📄 BEZPLATNÝ DODACÍ LIST\n\nDL číslo: #DL-VZORKY-${Math.floor(Math.random() * 900) + 100}\nTyp: Vzorky - ZDARMA\nZákazník: ${customer.company}\n\n📦 OBSAH:\n${analysis.extractedItems.map((item, idx) => 
          `${idx + 1}. ${item.product} - VZORKA\n   Množstvo: ${item.quantity}x\n   Hodnota: 0,00 €`
        ).join('\n') || '1. Káblový systém - VZORKA\n   Množstvo: 2m\n   Hodnota: 0,00 €'}\n\n💰 CELKOVÁ HODNOTA: 0,00 € (VZORKY ZDARMA)\n\n📋 Účel: Obchodná prezentácia\n📅 Dátum: ${new Date().toLocaleDateString('sk-SK')}\n🚚 Doprava: ZDARMA\n📍 Tracking: SK${Math.floor(Math.random() * 900000000) + 100000000}\n\n✅ Pripravené k expedícii\n📧 Zákazník informovaný`;

      case 'schedule-visit':
        return `📅 PLÁNOVANIE NÁVŠTEVY\n\nZákazník: ${customer.company}\nTyp: Obchodná návšteva + vzorky\n\n📍 NAVRHOVANÉ TERMÍNY:\n\n1. ${new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 10:00-11:30\n2. ${new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 14:00-15:30\n3. ${new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 09:00-10:30\n\n👤 OBCHODNÝ ZÁSTUPCA:\nMeno: ${customer.name || 'Ing. Peter Kováč'}\nTel: +421 905 123 456\nEmail: peter.kovac@strader.sk\n\n📋 PROGRAM NÁVŠTEVY:\n• Predstavenie spoločnosti (15 min)\n• Prezentácia produktov (30 min)\n• Predvedenie vzoriek (20 min)\n• Diskusia a cenová ponuka (25 min)\n\n📦 Vzorky dovezené priamo na miesto\n📧 Pozvánka odoslaná zákazníkovi`;

      case 'modify-order':
        return `🟡 ÚPRAVA OBJEDNÁVKY\n\nObjednávka: #${Math.floor(Math.random() * 9000) + 1000}\nZákazník: ${customer.company}\nDátum: ${new Date().toLocaleDateString('sk-SK')}\n\n📋 POŽADOVANÁ ZMENA:\n${analysis.extractedItems.map((item, idx) => 
          `${idx + 1}. ${item.product}\n   • Pôvodne: ${Math.floor(item.quantity * 1.5)}x\n   • Nové množstvo: ${item.quantity}x\n   • Rozdiel: -${Math.floor(item.quantity * 0.5)}x`
        ).join('\n\n') || '• Zmena množstva\n   • Zmena termínu dodania\n   • Úprava adresy'}\n\n💰 PREPOČÍTANÁ HODNOTA:\n• Pôvodná suma: ${formatCurrency((analysis.estimatedValue || 1000) * 1.5)}\n• Nová suma: ${formatCurrency(analysis.estimatedValue || 1000)}\n• Rozdiel: -${formatCurrency((analysis.estimatedValue || 1000) * 0.5)}\n\n✅ STATUS:\n• Zmena potvrdená\n• Sklad informovaný\n• Nová CP odoslaná\n• Čakáme na finálne potvrdenie zákazníka`;

      case 'recalculate-quote':
        return `🔢 PREPOČÍTANÁ CENOVÁ PONUKA\n\nCP číslo: #CP-2024-${Math.floor(Math.random() * 9000) + 1000} (REV.1)\nZákazník: ${customer.company}\nDátum: ${new Date().toLocaleDateString('sk-SK')}\n\n📊 PÔVODNÁ PONUKA:\n${analysis.extractedItems.map(item => 
          `• ${item.product}: ${Math.floor(item.quantity * 1.3)}x × ${formatCurrency(item.unitPrice)}`
        ).join('\n') || '• Pôvodná kalkulácia'}\nCelkom: ${formatCurrency((analysis.estimatedValue || 1000) * 1.3)}\n\n📊 PREPOČÍTANÁ PONUKA:\n${analysis.extractedItems.map(item => 
          `• ${item.product}: ${item.quantity}x × ${formatCurrency(item.unitPrice)}`
        ).join('\n') || '• Nová kalkulácia'}\nCelkom: ${formatCurrency(analysis.estimatedValue || 1000)}\n\n💰 ZMENA: ${formatCurrency((analysis.estimatedValue || 1000) * -0.3)}\n\n✅ Zľava ${customer.discount}% zahrnútá\n📧 Aktualizovaná CP odoslaná zákazníkovi`;

      case 'verify-availability':
        return `✅ OVERENIE DOSTUPNOSTI\n\nObjednávka pre: ${customer.company}\nDátum overenia: ${new Date().toLocaleDateString('sk-SK')}\n\n📦 KONTROLA SKLADU:\n\n${analysis.extractedItems.map(item => {
          const available = item.currentStock >= item.quantity;
          return `${available ? '✅' : '⚠️'} ${item.product}\n   • Požadované: ${item.quantity}x\n   • Na sklade: ${item.currentStock}x\n   • Status: ${available ? '🟢 DOSTUPNÉ' : '🟡 ČIASTOČNE'}`;
        }).join('\n\n') || '✅ Všetky položky dostupné'}\n\n📊 SÚHRN:\n• Dostupné ihneď: ${analysis.extractedItems.filter(i => i.currentStock >= i.quantity).length}/${analysis.extractedItems.length} položiek\n• Možná expedícia: ${analysis.extractedItems.every(i => i.currentStock >= i.quantity) ? '✅ ANO (do 48h)' : '⚠️ Čiastočne (5-7 dní)'}\n\n✅ Overenie dokončené\n📧 Zákazník bude informovaný`;

      case 'create-customer':
        return `👤 NOVÝ ZÁKAZNÍK VYTVORENÝ\n\nID: #${Math.floor(Math.random() * 90000) + 10000}\nSpoločnosť: ${customer.company}\nKontakt: ${customer.name}\n\n📋 ZÁKLADNÉ ÚDAJE:\n• IČO: ${Math.floor(Math.random() * 90000000) + 10000000}\n• DIČ: ${Math.floor(Math.random() * 9000000000) + 1000000000}\n• Segment: ${analysis.estimatedValue > 5000 ? 'B2B - Veľkoodber' : 'B2B - Štandard'}\n\n💰 OBCHODNÉ PODMIENKY:\n• Splatnosť: 30 dní (štandard)\n• Zľava: 0% (nový zákazník)\n• Úverový limit: ${formatCurrency(10000)}\n• Doprava: Štandardná\n\n✅ NASTAVENÉ:\n• Prístup do B2B portálu\n• Prihlasovací údaje odoslané\n• Pridelený OZ: ${customer.name || 'Ing. Peter Kováč'}\n• Uvítací balíček pripravený\n\n📧 Uvítací email odoslaný s prístupovými údajmi`;

      case 'verify-finstat':
        return `🔍 OVERENIE NA FINSTAT.SK\n\nSpoločnosť: ${customer.company}\nOverené: ${new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}\n\n✅ ZÁKLADNÉ ÚDAJE:\n• IČO: ${Math.floor(Math.random() * 90000000) + 10000000}\n• DIČ: SK${Math.floor(Math.random() * 9000000000) + 1000000000}\n• Právna forma: s.r.o.\n• Zapísaná: Obchodný register SR\n\n📊 FINANČNÉ ÚDAJE (2023):\n• Obrat: ${formatCurrency(Math.floor(Math.random() * 500000) + 100000)}\n• Zisk: ${formatCurrency(Math.floor(Math.random() * 50000) + 10000)}\n• Zamestnanci: ${Math.floor(Math.random() * 50) + 5}\n\n🎯 HODNOTENIE:\n• Bonita: ${['A', 'B+', 'B'][Math.floor(Math.random() * 3)]}\n• Platobná disciplína: ${['Výborná', 'Dobrá', 'Priemerná'][Math.floor(Math.random() * 3)]}\n• Riziko: ${['Nízke', 'Stredné'][Math.floor(Math.random() * 2)]}\n\n✅ Odporúčenie: ${analysis.estimatedValue > 5000 ? 'Schváliť s úverovým limitom 20 000 EUR' : 'Schváliť s štandardnými podmienkami'}`;

      case 'assign-rep':
        return `🟠 PRIDELENIE OBCHODNÉHO ZÁSTUPCU\n\nZákazník: ${customer.company}\nRegiónhľa: ${['Prešov', 'Košice', 'Žilina', 'Bratislava'][Math.floor(Math.random() * 4)]}\n\n👤 PRIDELENÝ OZ:\n\nMeno: Ing. Peter Kováč\nPozícia: Senior obchodný zástupca\nRegiónna zodpovednosť: Východné Slovensko\nSkúsenosti: 8 rokov\n\n📧 Kontakt:\nEmail: peter.kovac@strader.sk\nTel: +421 905 123 456\nMobil: +421 905 123 456\n\n📊 Výkonnosť OZ:\n• Aktívnych zákazníkov: 47\n• Mesačný obrat: ${formatCurrency(85000)}\n• Spokojnosť zákazníkov: 96%\n\n✅ AKCIE:\n• Zákazník pridelený v CRM\n• OZ informovaný emailom\n• Prvý kontakt naplánovaný na zajtra\n• Dokumentácia pripravená\n\n⏰ Prvý kontakt: ${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} 10:00`;

      case 'prepare-frame-contract':
        return `📋 NÁVRH RÁMCOVEJ ZMLUVY\n\nZákazník: ${customer.company}\nTyp: Rámcová zmluva na dodávku materiálu\n\n📄 PARAMETRE ZMLUVY:\n\n1. 💰 OBCHODNÉ PODMIENKY\n   • Ročný predpokladaný objem: ${formatCurrency(analysis.estimatedValue * 12)}\n   • Mesačný limit: ${formatCurrency(analysis.estimatedValue * 2)}\n   • Špeciálna zľava: ${customer.discount + 3}%\n   • Splatnosť: ${customer.creditTerms || 30} dní\n\n2. 📦 DODACIE PODMIENKY\n   • Dodacia lehota: 3-5 pracovných dní\n   • Doprava: ZDARMA nad ${formatCurrency(500)}\n   • Minimálna objednávka: ${formatCurrency(200)}\n\n3. ⏱️ TRVANIE\n   • Od: ${new Date().toLocaleDateString('sk-SK')}\n   • Do: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n   • Možnosť predĺženia: Áno\n\n✅ Návrh pripravený na schválenie vedením\n📧 Odošleme po schválení`;

      case 'schedule-meeting':
        return `📅 PLÁNOVANIE STRETNUTIA\n\nÚčel: Rokovanie o rámcovej zmluve\nZákazník: ${customer.company}\nHodnota: ${formatCurrency(analysis.estimatedValue * 12)} / rok\n\n📍 NAVRHOVANÉ TERMÍNY:\n\n1. ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 10:00\n   Miesto: Kancelária Strader, Prešov\n\n2. ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 14:00\n   Miesto: Sídlo zákazníka\n\n3. ${new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 10:00\n   Miesto: Online (MS Teams)\n\n👥 ÚČASTNÍCI ZA STRADER:\n• Obchodný riaditeľ: Ing. Peter Novák\n• Senior OZ: Ing. Peter Kováč\n• Právnik: JUDr. Mária Horváthová\n\n📋 PROGRAM:\n• Predstavenie spolupráce (15 min)\n• Obchodné podmienky (30 min)\n• Zmluvné podmienky (20 min)\n• Diskusia a podpis (25 min)\n\n📧 Pozvánka odoslaná zákazníkovi`;

      case 'verify-dl-order':
        return `🔍 OVERENIE DL VS OBJEDNÁVKA\n\nReklamácia: Chýbajúci tovar\nZákazník: ${customer.company}\nDodací list: #DL-2024-${Math.floor(Math.random() * 9000) + 1000}\n\n📋 POROVNANIE:\n\n${['Káblový systém KS-200', 'LED panel 60x60', 'Zásuvka ABB'].map((item, idx) => {
          const ok = idx !== 1;
          return `${ok ? '✅' : '❌'} ${item}\n   • Objednané: ${Math.floor(Math.random() * 50) + 10}x\n   • Dodané: ${ok ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 30)}x\n   • ${ok ? 'V poriadku' : '🔴 ROZDIEL!'}`;
        }).join('\n\n')}\n\n⚠️ NÁJDENÉ ROZDIELY:\n• LED panel 60x60: chýba 15 ks\n• Hodnota: ${formatCurrency(15 * 32.00)}\n\n✅ AKCIE:\n• Reklamačný prípad otvorený\n• Chýbajúci tovar pripravený\n• Expedícia do 24 hodín\n• Zákazník informovaný\n\n📦 Tracking: SK${Math.floor(Math.random() * 900000000) + 100000000}`;

      case 'send-missing-items':
        return `📦 DOPLNENIE CHÝBAJÚCEHO TOVARU\n\nReklamácia: #RK-2024-${Math.floor(Math.random() * 900) + 100}\nZákazník: ${customer.company}\n\n📋 CHÝBAJÚCE POLOŽKY:\n\n${['LED panel 60x60 40W', 'Zásuvka ABB Tango'].map((item, idx) => 
          `${idx + 1}. ${item}\n   • Chýbajúce množstvo: ${[15, 8][idx]}x\n   • Hodnota: ${formatCurrency([15 * 32, 8 * 4.80][idx])}\n   • ✅ Pripravené`
        ).join('\n\n')}\n\n🚚 EXPEDÍCIA:\n• Dátum: ${new Date().toLocaleDateString('sk-SK')}\n• Dodací list: #DL-REK-${Math.floor(Math.random() * 900) + 100}\n• Doprava: EXPRESNE (24h)\n• Tracking: SK${Math.floor(Math.random() * 900000000) + 100000000}\n• Náklady: ZDARMA (reklamácia)\n\n💰 KOMPENZÁCIA:\n• Dobropis: ${formatCurrency(50)} (za komplikácie)\n• Zľava na nasledujúcu obj.: 5%\n\n📧 Zákazník informovaný\n✅ Expedované dnes o ${new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}`;

      case 'send-static-analysis':
        return `📊 STATICKÝ POSUDOK\n\nProjekt: ${customer.company}\nTyp: Verejné osvetlenie - stĺpy\n\n📄 OBSAH DOKUMENTU:\n\n1. ✅ ÚVODNÉ INFORMÁCIE\n   • Názov projektu\n   • Identifikácia objednávateľa\n   • Rozsah posudku\n\n2. ✅ TECHNICKÉ PARAMETRE\n   ${analysis.extractedItems.map(item => 
     `   • ${item.product}\n     - Nosnosť: 250 kg\n     - Odolnosť vetra: do 120 km/h\n     - Materiál: Pozinkovaná oceľ S355`
   ).join('\n') || '   • Stĺp VO-8m: Nosnosť 250kg\n   • LED svietidlo: Hmotnosť 8kg'}\n\n3. ✅ STATICKÉ VÝPOČTY\n   • Zaťaženie vetrom\n   • Moment ohybu\n   • Únavové výpočty\n   • Normy: EN 40-3-1, EN 1993\n\n4. ✅ ZÁVER A ODPORÚČANIA\n   • Vyhovuje všetkým normám\n   • Životnosť: 25+ rokov\n\n👤 Spracoval: Ing. Martin Novák, PhD.\n🏢 Autorizovaný statik\n📅 Dátum: ${new Date().toLocaleDateString('sk-SK')}\n\n📧 PDF dokument odoslaný zákazníkovi`;

      case 'assign-specialist':
        return `👨‍🔧 PRIDELENIE ŠPECIALISTU\n\nProjekt: ${customer.company}\nTyp: Verejné osvetlenie\nHodnota: ${formatCurrency(analysis.estimatedValue)}\n\n👤 PRIDELENÝ ŠPECIALISTA:\n\nMeno: Ing. Marián Horváth, PhD.\nPozícia: Technický špecialista - osvetlenie\nCertifikácia: Svetelný technik ČSAO\nSkúsenosti: 15 rokov, 80+ projektov\n\n📊 ŠPECIALIZÁCIA:\n• Verejné osvetlenie\n• Svetelno-technické výpočty\n• Statické posudky stĺpov\n• Energetické audity\n• Projekty smart lighting\n\n📧 KONTAKT:\nEmail: marian.horvath@strader.sk\nTel: +421 907 345 678\nMobil: +421 905 345 678\n\n✅ AKCIE:\n• Projekt pridelený\n• Špecialista informovaný\n• Technická dokumentácia pripravená\n• Prvý kontakt naplánovaný na zajtra\n• Obhliadka lokality: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')}\n\n📋 Špecialista prevezme kompletnú zodpovednosť za projekt`;

      case 'pause-edi-order':
        return `⚠️ EDI OBJEDNÁVKA POZASTAVENÁ\n\nObjednávka: #EDI-${customer.company.substring(0, 2).toUpperCase()}-2024-${Math.floor(Math.random() * 900) + 100}\nZákazník: ${customer.company}\nDôvod: Cenový nesúlad\n\n🔍 DETEKOVANÝ PROBLÉM:\n\n${analysis.extractedItems.map((item, idx) => {
          const oldPrice = item.unitPrice * 1.18;
          return `${idx + 1}. ${item.product}\n   • EDI cena: ${formatCurrency(item.unitPrice)}/ks\n   • Aktuálny cenník: ${formatCurrency(oldPrice)}/ks\n   • ⚠️ Rozdiel: ${formatCurrency(oldPrice - item.unitPrice)} (-${((1 - item.unitPrice / oldPrice) * 100).toFixed(1)}%)`;
        }).join('\n\n') || '• Cenový rozdiel detekovaný\n   • Aktualizácia cenníka potrebná'}\n\n💰 CELKOVÝ DOPAD:\n• Objednaná suma: ${formatCurrency(analysis.estimatedValue)}\n• Očakávaná suma: ${formatCurrency(analysis.estimatedValue * 1.18)}\n• Rozdiel: ${formatCurrency(analysis.estimatedValue * 0.18)}\n\n✅ AKCIE:\n• EDI objednávka pozastavená\n• Kontrola cenníka iniciovaná\n• Zákazník bude kontaktovaný\n• Čakáme na potvrdenie správnych cien`;

      case 'check-price-list':
        return `💰 KONTROLA CENNÍKA\n\nZákazník: ${customer.company}\nTyp zmluvy: ${customer.totalOrders > 20 ? 'Rámcová zmluva' : 'Štandardná'}\n\n📊 AKTUÁLNY CENNÍK:\n\n${analysis.extractedItems.map((item, idx) => {
          const contractPrice = item.unitPrice * 0.92;
          return `${idx + 1}. ${item.product}\n   • Štandardná cena: ${formatCurrency(item.unitPrice * 1.08)}/ks\n   • Zmluvná cena: ${formatCurrency(contractPrice)}/ks\n   • Zľava: ${customer.discount}%\n   • ✅ Platnosť: do 31.12.2024`;
        }).join('\n\n') || '• Cenník je aktuálny\n   • Posledná aktualizácia: 01.02.2024'}\n\n📅 HISTÓRIA:\n• Posledná aktualizácia: 01.02.2024\n• Predchádzajúca zmena: +3.5% (inflácia)\n• Ďalšia revízia: 01.07.2024\n\n✅ Záver: ${customer.totalOrders > 20 ? 'Zmluvné ceny sú správne' : 'Cenník aktuálny, žiadne zmeny potrebné'}`;

      case 'contact-customer':
        return `📞 KONTAKT SO ZÁKAZNÍKOM\n\nZákazník: ${customer.company}\nKontaktná osoba: ${customer.name}\nDôvod: Overenie cien v EDI objednávke\n\n📧 EMAIL ODOSLANÝ:\n\n"Dobrý deň,\n\npri spracovaní Vašej EDI objednávky sme zaznamenali rozdiel v cenách oproti platnému cenníku.\n\n📋 Detaily:\n${analysis.extractedItems.map(item => `• ${item.product}: ${formatCurrency(item.unitPrice)}/ks`).join('\n') || '• Položky s cenovým rozdielom'}\n\nChceli by sme overiť, či:\n1. Potrebujete aktualizovaný cenník\n2. Máte platnú špeciálnu ponuku\n3. Chcete potvrdiť objednávku za aktuálne ceny\n\nProsím kontaktujte nás do 24 hodín.\n\nS pozdravom,\nStrader Agent"\n\n✅ STATUS:\n• Email odoslaný: ${new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}\n• Kópia OZ: Ing. Peter Kováč\n• Urgencia: Vysoká\n• Odpoveď očakávaná do: 24h`;

      case 'suggest-alternatives':
        return `💡 NÁVRH ALTERNATÍV\n\nZákazník: ${customer.company}\nPôvodný dopyt: Neúplná špecifikácia\n\n📋 ODPORÚČANÉ ALTERNATÍVY:\n\n1. ✅ VARIANTA A - ŠTANDARD\n   ${analysis.extractedItems.length > 0 ? 
     analysis.extractedItems.slice(0, 2).map(item => 
       `   • ${item.product}\n     Cena: ${formatCurrency(item.unitPrice)}/ks\n     Dostupnosť: ✅ Skladom`
     ).join('\n') :
     '   • Káblový systém KS-200\n     Cena: 18,50 €/m\n   • LED panel 60x60\n     Cena: 32,00 €/ks'
   }\n   💰 Cena: ${formatCurrency((analysis.estimatedValue || 1000) * 0.9)}\n\n2. ⭐ VARIANTA B - PREMIUM\n   • Káblový systém KS-300 PRO\n     Cena: 24,50 €/m\n   • LED panel 60x60 SMART\n     Cena: 45,00 €/ks\n   💰 Cena: ${formatCurrency((analysis.estimatedValue || 1000) * 1.3)}\n   🎁 Bonus: Predĺžená záruka\n\n3. 💚 VARIANTA C - ECO\n   • Káblový systém KS-150 ECO\n     Cena: 14,20 €/m\n   • LED panel 60x60 BASIC\n     Cena: 26,00 €/ks\n   💰 Cena: ${formatCurrency((analysis.estimatedValue || 1000) * 0.7)}\n   ♻️ Ekologický materiál\n\n📧 Návrhy odoslané zákazníkovi s detailnými špecifikáciami`;

      case 'schedule-consult':
        return `📅 TECHNICKÁ KONZULTÁCIA\n\nZákazník: ${customer.company}\nTyp projektu: ${analysis.estimatedValue > 5000 ? 'Komplexný projekt' : 'Štandardná dodávka'}\n\n📍 NAVRHOVANÉ TERMÍNY:\n\n1. ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 10:00-11:00\n   📍 Online (MS Teams)\n\n2. ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 14:00-16:00\n   📍 Sídlo zákazníka + obhliadka\n\n3. ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sk-SK')} - 09:00-10:00\n   📍 Kancelária Strader\n\n👥 ÚČASTNÍCI:\n• Technický špecialista: Ing. Marián Horváth\n• Obchodný zástupca: Ing. Peter Kováč\n• Zákazník: ${customer.name}\n\n📋 TÉMY KONZULTÁCIE:\n• Technické riešenie projektu\n• Výber vhodných produktov\n• Svetelno-technický výpočet\n• Cenová kalkulácia\n• Dodacie lehoty a harmonogram\n\n📦 Vzorky produktov k dispozícii\n📧 Pozvánka odoslaná zákazníkovi`;

      default:
        return `✅ Akcia "${actionId}" bola úspešne vykonaná.\n\nDetail akcie bude doplnený v ďalšej verzii systému.`;
    }
  };

  const handleAction = async (actionId: string) => {
    if (!selectedEmail) return;
    
    try {
      const result = generateActionOutput(actionId);
      setActionResult(result);
      await api.updateEmail(selectedEmail.id, { status: 'action-taken' });
      await loadData();
    } catch (error) {
      console.error('Failed to perform action:', error);
      setActionResult('❌ Chyba pri vykonávaní akcie. Skúste to prosím znova.');
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
                onClick={() => {
                  setSelectedEmail(email);
                  setActionResult(null);
                }}
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
            {/* Email Detail with Tabs */}
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

                {/* Tabs */}
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-all-smooth',
                      (activeTab === 'ai' && !qKeyPressed)
                        ? 'glass gradient-bg text-white'
                        : 'glass-card text-gray-400 hover:text-white'
                    )}
                  >
                    🤖 AI Analýza
                  </button>
                  <button
                    onClick={() => setActiveTab('original')}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-all-smooth',
                      (activeTab === 'original' || qKeyPressed)
                        ? 'glass gradient-bg text-white'
                        : 'glass-card text-gray-400 hover:text-white'
                    )}
                  >
                    📧 Originál {qKeyPressed && '(Q held)'}
                  </button>
                </div>

                {/* Content based on active tab or Q key */}
                {(activeTab === 'original' || qKeyPressed) ? (
                  <div className="whitespace-pre-wrap rounded-xl glass-card p-6 text-gray-200">
                    {selectedEmail.body}
                  </div>
                ) : (
                  <div className="space-y-4">
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
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Panel - Actions & Results */}
            <div className="h-[500px] overflow-y-auto glass-dark p-6">
              <div className="mx-auto max-w-4xl space-y-4">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  AI Analýza a odporúčanie
                </h2>

                {selectedEmail.aiAnalysis && (
                  <>
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

                    {/* Action Result */}
                    {actionResult && (
                      <Card className="glass-card border-green-400/30 bg-green-500/5">
                        <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                          <CardTitle className="text-white flex items-center gap-2">
                            ✅ AI Výstup
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-200 leading-relaxed">
                            {actionResult}
                          </pre>
                        </CardContent>
                      </Card>
                    )}

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
