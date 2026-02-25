import { useState, useEffect } from 'react';
import { Search, Grid3x3, List, Package, MessageSquare, Layers, Send, Sparkles, ShoppingCart, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: string;
  stockQty: number;
  supplier: string;
  unit: string;
  description: string;
  isComposite: boolean;
  components?: Array<{
    quantity: string;
    product: Product;
  }>;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  bom?: Array<{
    quantity: number;
    product: string;
    code: string;
    unitPrice: number;
    total: number;
  }>;
  totalValue?: number;
}

const categories = [
  'Všetky kategórie',
  'Káblové nosné systémy',
  'Prípojnicové systémy',
  'Upevňovacie systémy',
  'Osvetľovacie stĺpy',
  'Rozvádzačové skrine',
];

const mockAIConversations: Record<string, AIMessage[]> = {
  'kablova-trasa': [
    { role: 'user', content: 'Potrebujem káblovú trasu na strop, 150m, žľab 100x60' },
    { 
      role: 'assistant', 
      content: 'Na 150m káblovej trasy so žľabom 100x60mm na strop budete potrebovať:',
      bom: [
        { quantity: 50, product: 'Žľab KZL100x60/3 (3m)', code: 'KNS-001', unitPrice: 32.50, total: 1625.00 },
        { quantity: 150, product: 'Závesná tyč ZM8x1000', code: 'KNS-012', unitPrice: 2.80, total: 420.00 },
        { quantity: 150, product: 'Stropná kotva KSO-M8', code: 'KNS-023', unitPrice: 1.50, total: 225.00 },
        { quantity: 20, product: 'Spojka KZL100x60', code: 'KNS-005', unitPrice: 4.20, total: 84.00 },
        { quantity: 300, product: 'Skrutka M8x40 DIN933', code: 'KNS-089', unitPrice: 0.35, total: 105.00 },
        { quantity: 300, product: 'Matica M8 DIN934', code: 'KNS-090', unitPrice: 0.18, total: 54.00 },
        { quantity: 4, product: 'Koncovka KZL100x60', code: 'KNS-006', unitPrice: 3.80, total: 15.20 },
      ],
      totalValue: 3847.50
    }
  ],
  'rozvádzač': [
    { role: 'user', content: 'Čo všetko potrebujem na montáž rozvádzača 800x600?' },
    { 
      role: 'assistant', 
      content: 'Na montáž rozvádzača 800x600mm budete potrebovať:',
      bom: [
        { quantity: 1, product: 'Rozvádzač oceľový 800x600x250', code: 'RS-456', unitPrice: 185.00, total: 185.00 },
        { quantity: 1, product: 'Montážna doska 750x550', code: 'RS-457', unitPrice: 28.50, total: 28.50 },
        { quantity: 4, product: 'Kotevný šr. M10x80 + hmož.', code: 'UP-234', unitPrice: 1.85, total: 7.40 },
        { quantity: 1, product: 'Uzemnenie CU 16mm2 2m', code: 'EL-890', unitPrice: 12.40, total: 12.40 },
        { quantity: 1, product: 'Svorka uzemňovacia pre skriňu', code: 'EL-891', unitPrice: 3.20, total: 3.20 },
      ],
      totalValue: 236.50
    }
  ],
  'pripojnice': [
    { role: 'user', content: 'Potrebujem prípojnicový systém na 60m, 630A' },
    { 
      role: 'assistant', 
      content: 'Pre 60m prípojnicového systému 630A:',
      bom: [
        { quantity: 20, product: 'Prípojnica PS-630A/3 (3m)', code: 'PBS-101', unitPrice: 485.00, total: 9700.00 },
        { quantity: 40, product: 'Napájacie body NB-630', code: 'PBS-105', unitPrice: 42.50, total: 1700.00 },
        { quantity: 60, product: 'Závesný systém ZS-630', code: 'PBS-110', unitPrice: 18.80, total: 1128.00 },
        { quantity: 10, product: 'Rozbočka R-630 T', code: 'PBS-120', unitPrice: 125.00, total: 1250.00 },
        { quantity: 4, product: 'Koncovka K-630', code: 'PBS-115', unitPrice: 35.00, total: 140.00 },
      ],
      totalValue: 13918.00
    }
  ],
  'kotvy': [
    { role: 'user', content: 'Koľko kotiev potrebujem na 200 závesov?' },
    { 
      role: 'assistant', 
      content: 'Na 200 závesov odporúčam:',
      bom: [
        { quantity: 200, product: 'Stropná kotva KSO-M8', code: 'KNS-023', unitPrice: 1.50, total: 300.00 },
        { quantity: 200, product: 'Matica M8 DIN934', code: 'KNS-090', unitPrice: 0.18, total: 36.00 },
        { quantity: 200, product: 'Podložka M8 DIN125', code: 'KNS-091', unitPrice: 0.12, total: 24.00 },
      ],
      totalValue: 360.00
    }
  ],
};

export function ProductAgent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Všetky kategórie');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  
  // AI Calculator state
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'Všetky kategórie') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.code.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const loadProductDetail = async (productId: number) => {
    try {
      const data = await api.getProduct(productId);
      setSelectedProduct(data);
    } catch (error) {
      console.error('Failed to load product detail:', error);
    }
  };

  const handleAiQuery = () => {
    if (!aiInput.trim() || isAiThinking) return;
    
    const userMessage: AIMessage = { role: 'user', content: aiInput };
    setAiMessages([...aiMessages, userMessage]);
    setAiInput('');
    setIsAiThinking(true);

    // Simulate AI processing
    setTimeout(() => {
      let response: AIMessage;
      
      // Match query to mock conversations
      const lowerInput = aiInput.toLowerCase();
      if (lowerInput.includes('káblov') || lowerInput.includes('trasa') || lowerInput.includes('žľab')) {
        response = mockAIConversations['kablova-trasa'][1];
      } else if (lowerInput.includes('rozvádzač')) {
        response = mockAIConversations['rozvádzač'][1];
      } else if (lowerInput.includes('prípojnic')) {
        response = mockAIConversations['pripojnice'][1];
      } else if (lowerInput.includes('kotv') || lowerInput.includes('záves')) {
        response = mockAIConversations['kotvy'][1];
      } else {
        response = {
          role: 'assistant',
          content: 'Prosím, špecifikujte viac detailov o vašej požiadavke (dĺžka, typ systému, umiestnenie, záťaž...). Napríklad: "Potrebujem káblovú trasu na strop, 150m, žľab 100x60"'
        };
      }
      
      setAiMessages(prev => [...prev, response]);
      setIsAiThinking(false);
    }, 1500);
  };

  const handleQuickQuery = (query: string) => {
    setAiInput(query);
    setTimeout(() => handleAiQuery(), 100);
  };

  const getStockBadge = (qty: number) => {
    if (qty === 0) return <Badge variant="destructive">Nie je skladom</Badge>;
    if (qty < 50) return <Badge variant="warning">Nízky stav</Badge>;
    return <Badge variant="success">Skladom</Badge>;
  };

  const getRelatedProducts = (product: Product) => {
    // Mock related/complementary products
    const related = products.filter(p => 
      p.category === product.category && p.id !== product.id
    ).slice(0, 3);
    return related;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen glass-dark">
      {/* Main Product Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-white/10 glass p-6">
          <h1 className="mb-4 text-3xl font-bold text-white gradient-text">Produktový Agent</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Hľadať podľa kódu, názvu alebo kategórie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-2 border-l border-white/10 pl-4">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'gradient-bg' : 'glass-card border-white/10'}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'gradient-bg' : 'glass-card border-white/10'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 overflow-y-auto border-r border-white/10 glass-dark p-4">
            <h3 className="mb-3 font-semibold text-white">Kategórie</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-all-smooth',
                    selectedCategory === category
                      ? 'gradient-bg text-white font-semibold glow'
                      : 'text-gray-300 hover:glass hover:text-white'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl glass-card border-white/10 p-3">
              <p className="text-sm font-semibold text-gray-400">Celkom produktov</p>
              <p className="text-2xl font-bold text-blue-400">{filteredProducts.length}</p>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 overflow-y-auto glass p-6">
            {filteredProducts.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-400">Žiadne produkty</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="glass-card border-white/10 cursor-pointer transition-all-smooth hover:scale-105 hover:glow-border"
                    onClick={() => loadProductDetail(product.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="mb-2 flex items-start justify-between">
                        <Badge variant="outline" className="border-white/20 text-gray-300">{product.code}</Badge>
                        {product.isComposite && (
                          <Badge variant="secondary" className="glass">
                            <Layers className="mr-1 h-3 w-3" />
                            Súprava
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base text-white">{product.name}</CardTitle>
                      <CardDescription className="text-xs text-gray-400">{product.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Cena:</span>
                          <span className="font-bold text-blue-400">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Sklad:</span>
                          {getStockBadge(product.stockQty)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Dodávateľ: {product.supplier}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="glass-card border-white/10 cursor-pointer transition-all-smooth hover:glow-border"
                    onClick={() => loadProductDetail(product.id)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg glass gradient-bg">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-white/20 text-gray-300">{product.code}</Badge>
                            {product.isComposite && (
                              <Badge variant="secondary" className="glass">
                                <Layers className="mr-1 h-3 w-3" />
                                Súprava
                              </Badge>
                            )}
                          </div>
                          <p className="font-semibold text-white">{product.name}</p>
                          <p className="text-sm text-gray-400">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-400">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-sm text-gray-400">/{product.unit}</p>
                        </div>
                        <div className="w-32">{getStockBadge(product.stockQty)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Calculator Panel */}
      <div className="w-[500px] border-l border-white/10 glass-dark flex flex-col">
        <div className="border-b border-white/10 p-4 glass">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="h-5 w-5 text-blue-400" />
            AI Materiálový kalkulátor
          </h2>
          <p className="text-sm text-gray-400">Opýtajte sa na materiál a AI vypočíta BOM</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {aiMessages.length === 0 ? (
            <div className="space-y-4">
              <Card className="glass-card border-blue-400/30 bg-blue-50/5">
                <CardHeader>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    Inteligentný materiálový asistent
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Opýtajte sa napríklad: "Potrebujem káblovú trasu na strop, 150m, žľab 100x60"
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-300">Príklady otázok:</p>
                <button
                  className="w-full rounded-lg glass-card border-white/10 p-3 text-left text-sm text-gray-300 hover:gradient-bg hover:text-white hover:scale-[1.02] transition-all-smooth"
                  onClick={() => handleQuickQuery('Potrebujem káblovú trasu na strop, 150m, žľab 100x60')}
                >
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Káblovú trasu na strop, 150m, žľab 100x60
                </button>
                <button
                  className="w-full rounded-lg glass-card border-white/10 p-3 text-left text-sm text-gray-300 hover:gradient-bg hover:text-white hover:scale-[1.02] transition-all-smooth"
                  onClick={() => handleQuickQuery('Čo všetko potrebujem na montáž rozvádzača 800x600?')}
                >
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Čo potrebujem na montáž rozvádzača 800x600?
                </button>
                <button
                  className="w-full rounded-lg glass-card border-white/10 p-3 text-left text-sm text-gray-300 hover:gradient-bg hover:text-white hover:scale-[1.02] transition-all-smooth"
                  onClick={() => handleQuickQuery('Potrebujem prípojnicový systém na 60m, 630A')}
                >
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Prípojnicový systém na 60m, 630A
                </button>
              </div>
            </div>
          ) : (
            <>
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={cn("space-y-2", msg.role === 'user' ? 'flex justify-end' : '')}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] rounded-xl gradient-bg p-3 text-white">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-xl glass-card border-white/10 p-3 text-gray-200">
                        {msg.content}
                      </div>
                      {msg.bom && (
                        <Card className="glass-card border-blue-400/30">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm text-white">Bill of Materials (BOM)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {msg.bom.map((item, bomIdx) => (
                              <div key={bomIdx} className="flex items-start justify-between text-xs p-2 rounded-lg glass border border-white/10">
                                <div className="flex-1">
                                  <p className="font-semibold text-white">{item.quantity}x {item.product}</p>
                                  <p className="text-gray-400">Kód: {item.code}</p>
                                </div>
                                <div className="text-right ml-3">
                                  <p className="text-gray-400">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                                  <p className="font-bold text-blue-400">{formatCurrency(item.total)}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                              <p className="font-semibold text-white">CELKOM:</p>
                              <p className="text-2xl font-bold text-blue-400">{formatCurrency(msg.totalValue || 0)}</p>
                            </div>
                            <Button className="w-full gradient-bg hover:scale-105 transition-all mt-2">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Pridať do CP
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isAiThinking && (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm">AI počíta materiál...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 glass">
          <div className="flex gap-2">
            <Input
              placeholder="Napíšte vašu otázku..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
              disabled={isAiThinking}
              className="glass-card border-white/10 text-white placeholder:text-gray-500"
            />
            <Button 
              onClick={handleAiQuery} 
              disabled={!aiInput.trim() || isAiThinking}
              className="gradient-bg hover:scale-105 transition-all"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-2 glass-card border-white/10 text-gray-300 hover:text-white" 
            onClick={() => {
              setAiMessages([]);
              setSelectedProduct(null);
            }}
          >
            Nová kalkulácia
          </Button>
        </div>

        {/* Product Detail Overlay */}
        {selectedProduct && (
          <div className="absolute right-0 top-0 bottom-0 w-[500px] glass-dark border-l border-white/10 flex flex-col shadow-2xl">
            <div className="border-b border-white/10 p-4 glass flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Detail produktu</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedProduct(null)}
                className="glass-card border-white/10"
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <Badge variant="outline" className="w-fit border-white/20 text-gray-300">
                    {selectedProduct.code}
                  </Badge>
                  <CardTitle className="text-lg text-white">{selectedProduct.name}</CardTitle>
                  <CardDescription className="text-gray-400">{selectedProduct.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-400">Cena</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatCurrency(selectedProduct.price)}
                      <span className="text-sm text-gray-400">/{selectedProduct.unit}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-400">Skladová zásoba</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-white">{selectedProduct.stockQty} ks</p>
                      {getStockBadge(selectedProduct.stockQty)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-400">Dodávateľ</p>
                    <p className="font-medium text-white">{selectedProduct.supplier}</p>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <p className="text-sm font-semibold text-gray-400">Popis</p>
                      <p className="text-sm text-gray-300">{selectedProduct.description}</p>
                    </div>
                  )}

                  {selectedProduct.isComposite && selectedProduct.components && (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-gray-400">Zložené položky</p>
                      <div className="space-y-2">
                        {selectedProduct.components.map((comp, idx) => (
                          <div key={idx} className="rounded-lg glass p-3 text-sm border border-white/10">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white">{comp.product.name}</span>
                              <span className="text-blue-400">{comp.quantity}x</span>
                            </div>
                            <p className="text-xs text-gray-400">{comp.product.code}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Suggests Related Products */}
              {getRelatedProducts(selectedProduct).length > 0 && (
                <Card className="glass-card border-blue-400/30">
                  <CardHeader>
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                      AI navrhuje súvisiace produkty
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getRelatedProducts(selectedProduct).map((related) => (
                      <button
                        key={related.id}
                        onClick={() => loadProductDetail(related.id)}
                        className="w-full text-left p-2 rounded-lg glass border border-white/10 hover:border-blue-400 transition-all-smooth"
                      >
                        <p className="text-sm font-semibold text-white">{related.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">{related.code}</span>
                          <span className="text-sm font-bold text-blue-400">{formatCurrency(related.price)}</span>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
