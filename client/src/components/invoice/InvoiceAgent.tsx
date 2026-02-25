import { useState, useEffect } from 'react';
import { FileText, Eye, CheckCircle, AlertTriangle, Clock, Download } from 'lucide-react';
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

  const handleGenerateInvoice = async (deliveryNote: DeliveryNote) => {
    alert(`Generujem faktúru z DL ${deliveryNote.number}...`);
    // In production, this would create an actual invoice
  };

  const handleSendReminder = async (invoice: Invoice) => {
    alert(`Odosielam upomienku pre faktúru ${invoice.number}...`);
  };

  const issuedInvoices = invoices.filter((inv) => inv.type === 'issued');
  const receivedInvoices = invoices.filter((inv) => inv.type === 'received');
  const pendingDeliveryNotes = deliveryNotes.filter((dn) => dn.status === 'pending');
  const overdueInvoices = issuedInvoices.filter((inv) => inv.status === 'overdue');

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
        <h1 className="text-3xl font-bold">Fakturačný Agent</h1>
        <p className="text-gray-600">Správa faktúr a dodacích listov</p>
      </div>

      <Tabs defaultValue="delivery-notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="delivery-notes">
            Z dodacích listov ({pendingDeliveryNotes.length})
          </TabsTrigger>
          <TabsTrigger value="sent-invoices">
            Odoslané faktúry ({issuedInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="received-invoices">
            Vstupné faktúry ({receivedInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="reminders">Upomienky ({overdueInvoices.length})</TabsTrigger>
        </TabsList>

        {/* Delivery Notes Tab */}
        <TabsContent value="delivery-notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dodacie listy čakajúce na vyfakturovanie</CardTitle>
              <CardDescription>
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
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-semibold">{dn.number}</p>
                            <p className="text-sm text-gray-600">{getCustomerName(dn.customerId)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(dn.totalAmount)}</p>
                          <p className="text-sm text-gray-600">{formatDateShort(dn.date)}</p>
                        </div>
                        {getStatusBadge(dn.status)}
                        <Button onClick={() => handleGenerateInvoice(dn)} size="sm">
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
              <Card key={invoice.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="text-lg font-semibold">{invoice.number}</p>
                          <p className="text-sm text-gray-600">
                            {getCustomerName(invoice.customerId)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Suma</p>
                        <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Splatnosť</p>
                        <p className="font-semibold">{formatDateShort(invoice.dueDate)}</p>
                      </div>
                      {getStatusBadge(invoice.status)}
                      {invoice.revolutPaymentId && (
                        <Badge variant="success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Revolut
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
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
          <Card>
            <CardHeader>
              <CardTitle>Vstupné faktúry od dodávateľov</CardTitle>
              <CardDescription>
                AI kontroluje, či ceny korešpondujú s objednávkou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receivedInvoices.map((invoice) => {
                  const items = JSON.parse(invoice.items || '[]');
                  const hasDiscrepancy = items.some((item: any) => item.note);

                  return (
                    <div
                      key={invoice.id}
                      className={`rounded-lg border p-4 ${
                        hasDiscrepancy ? 'border-red-300 bg-red-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold">{invoice.number}</p>
                              <p className="text-sm text-gray-600">
                                Dodávateľ: {getCustomerName(invoice.customerId)}
                              </p>
                              {hasDiscrepancy && (
                                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  <span>Rozdiel v cenách voči CP!</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                            <p className="text-sm text-gray-600">{formatDateShort(invoice.dueDate)}</p>
                          </div>
                          {getStatusBadge(invoice.status)}
                          <Button variant="outline" size="sm">
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

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faktúry po splatnosti</CardTitle>
              <CardDescription>
                Automatické upomienky (1 deň, 7 dní, 14 dní po splatnosti)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueInvoices.length === 0 ? (
                  <p className="text-center text-gray-500">Žiadne faktúry po splatnosti</p>
                ) : (
                  overdueInvoices.map((invoice) => {
                    const daysOverdue = Math.floor(
                      (Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="font-semibold">{invoice.number}</p>
                              <p className="text-sm text-gray-600">
                                {getCustomerName(invoice.customerId)}
                              </p>
                              <p className="text-sm font-semibold text-red-600">
                                {daysOverdue} dní po splatnosti
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-red-600">
                              {formatCurrency(invoice.amount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Splatnosť: {formatDateShort(invoice.dueDate)}
                            </p>
                          </div>
                          <Button onClick={() => handleSendReminder(invoice)} variant="destructive" size="sm">
                            Odoslať upomienku
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
