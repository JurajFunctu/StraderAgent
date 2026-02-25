import { useState, useEffect } from 'react';
import { Mail, Building2, Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';

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
      setEmails(emailsData);
      setCustomers(customersData);
      setSalesReps(repsData);
      if (emailsData.length > 0) {
        setSelectedEmail(emailsData[0]);
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

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'create-order': 'Vytvoriť objednávku',
      'create-invoice': 'Vytvoriť faktúru',
      'respond-with-prices': 'Odpovedať s produktami a cenami',
      'assign-to-rep': 'Priradiť obchodníkovi',
      'request-info': 'Vyžiadať doplňujúce informácie',
    };
    return labels[action] || action;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create-order':
      case 'create-invoice':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'respond-with-prices':
      case 'request-info':
        return <Mail className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
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

  const handleAction = async (action: string) => {
    if (!selectedEmail) return;
    
    try {
      await api.updateEmail(selectedEmail.id, { status: 'action-taken' });
      await loadData();
      alert(`Akcia "${getActionLabel(action)}" bola vykonaná!`);
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
    <div className="flex h-screen">
      {/* Email List */}
      <div className="w-96 border-r bg-white">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Prijaté správy</h2>
          <p className="text-sm text-gray-500">{emails.length} emailov</p>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="space-y-2 p-2">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={cn(
                  'w-full rounded-lg border p-4 text-left transition-colors hover:bg-gray-50',
                  selectedEmail?.id === email.id && 'border-blue-500 bg-blue-50'
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{email.fromCompany}</span>
                  {getStatusBadge(email.status)}
                </div>
                <p className="mb-1 text-sm font-medium text-gray-900">{email.subject}</p>
                <p className="mb-2 line-clamp-2 text-xs text-gray-600">{email.body}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDate(email.receivedAt)}
                </div>
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
            <div className="flex-1 overflow-y-auto border-b bg-white p-6">
              <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                  <h1 className="mb-2 text-2xl font-bold">{selectedEmail.subject}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
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

                <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-6">
                  {selectedEmail.body}
                </div>
              </div>
            </div>

            {/* AI Analysis Panel */}
            <div className="h-80 overflow-y-auto bg-gray-50 p-6">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  AI Analýza a odporúčanie
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Zákazník</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedEmail.customerId ? (
                        <>
                          <p className="font-semibold">{getCustomer(selectedEmail.customerId)?.company}</p>
                          <p className="text-sm text-gray-600">{getCustomer(selectedEmail.customerId)?.name}</p>
                          <Badge className="mt-2" variant="secondary">
                            {getCustomer(selectedEmail.customerId)?.segment}
                          </Badge>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Nezistený</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Pridelený OZ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedEmail.assignedOzId ? (
                        <>
                          <p className="font-semibold">{getSalesRep(selectedEmail.assignedOzId)?.name}</p>
                          <p className="text-sm text-gray-600">{getSalesRep(selectedEmail.assignedOzId)?.location}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Nepridelený</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Spoľahlivosť AI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-600">
                        {parseFloat(selectedEmail.aiConfidence || '0').toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-600">Confidence score</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Odporúčaná akcia</CardTitle>
                    <CardDescription>
                      AI navrhuje nasledovnú akciu na základe obsahu emailu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          {getActionIcon(selectedEmail.aiSuggestedAction)}
                        </div>
                        <div>
                          <p className="font-semibold">{getActionLabel(selectedEmail.aiSuggestedAction)}</p>
                          <p className="text-sm text-gray-600">Kliknite na vykonanie akcie</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAction(selectedEmail.aiSuggestedAction)}
                        disabled={selectedEmail.status === 'action-taken'}
                      >
                        Vykonať akciu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-white">
            <p className="text-gray-500">Vyberte email zo zoznamu</p>
          </div>
        )}
      </div>
    </div>
  );
}
