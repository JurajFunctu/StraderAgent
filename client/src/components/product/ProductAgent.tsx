import { useState, useEffect } from 'react';
import { Search, Grid3x3, List, Package, MessageSquare, Layers } from 'lucide-react';
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

const categories = [
  'Všetky kategórie',
  'Káblové nosné systémy',
  'Prípojnicové systémy',
  'Upevňovacie systémy',
  'Osvetľovacie stĺpy',
  'Rozvádzačové skrine',
];

export function ProductAgent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Všetky kategórie');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState('');

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
    if (!aiQuery.trim()) return;
    
    // Mock AI response
    alert(`AI odpoveď na "${aiQuery}":\n\nNa 150m káblovú trasu na strop potrebujete:\n- 50ks Žľab 100x60mm\n- 150ks Závesný systém\n- 100ks Spojka\n- 300ks Kotevný bolt M8`);
    setAiQuery('');
  };

  const getStockBadge = (qty: number) => {
    if (qty === 0) return <Badge variant="destructive">Nie je skladom</Badge>;
    if (qty < 50) return <Badge variant="warning">Nízky stav</Badge>;
    return <Badge variant="success">Skladom</Badge>;
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
      {/* Main Product Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b bg-white p-6">
          <h1 className="mb-4 text-3xl font-bold">Produktový Agent</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Hľadať podľa kódu, názvu alebo kategórie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 border-l pl-4">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 overflow-y-auto border-r bg-white p-4">
            <h3 className="mb-3 font-semibold">Kategórie</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    selectedCategory === category
                      ? 'bg-blue-100 font-semibold text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-semibold">Celkom produktov</p>
              <p className="text-2xl font-bold text-blue-600">{filteredProducts.length}</p>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {filteredProducts.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Žiadne produkty</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => loadProductDetail(product.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="mb-2 flex items-start justify-between">
                        <Badge variant="outline">{product.code}</Badge>
                        {product.isComposite && (
                          <Badge variant="secondary">
                            <Layers className="mr-1 h-3 w-3" />
                            Súprava
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <CardDescription className="text-xs">{product.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cena:</span>
                          <span className="font-bold text-blue-600">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sklad:</span>
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
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => loadProductDetail(product.id)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{product.code}</Badge>
                            {product.isComposite && (
                              <Badge variant="secondary">
                                <Layers className="mr-1 h-3 w-3" />
                                Súprava
                              </Badge>
                            )}
                          </div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-sm text-gray-600">/{product.unit}</p>
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

      {/* AI Assistant Panel */}
      <div className="w-96 border-l bg-white">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              AI Asistent
            </h2>
            <p className="text-sm text-gray-600">Opýtajte sa na materiál</p>
          </div>

          {selectedProduct ? (
            <div className="flex-1 overflow-y-auto p-4">
              <Card>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    {selectedProduct.code}
                  </Badge>
                  <CardTitle className="text-lg">{selectedProduct.name}</CardTitle>
                  <CardDescription>{selectedProduct.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Cena</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedProduct.price)}
                      <span className="text-sm text-gray-600">/{selectedProduct.unit}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">Skladová zásoba</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{selectedProduct.stockQty} ks</p>
                      {getStockBadge(selectedProduct.stockQty)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">Dodávateľ</p>
                    <p className="font-medium">{selectedProduct.supplier}</p>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Popis</p>
                      <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                    </div>
                  )}

                  {selectedProduct.isComposite && selectedProduct.components && (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-gray-600">Zložené položky</p>
                      <div className="space-y-2">
                        {selectedProduct.components.map((comp, idx) => (
                          <div key={idx} className="rounded-lg bg-gray-50 p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{comp.product.name}</span>
                              <span className="text-blue-600">{comp.quantity}x</span>
                            </div>
                            <p className="text-xs text-gray-600">{comp.product.code}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-base">AI Materiálový asistent</CardTitle>
                  <CardDescription>
                    Opýtajte sa napríklad: "Aký materiál potrebujem na 150m káblovú trasu na strop?"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Input
                      placeholder="Napíšte vašu otázku..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                    />
                    <Button onClick={handleAiQuery} className="w-full">
                      Opýtať sa AI
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="font-semibold">Príklady otázok:</p>
                    <button
                      className="w-full rounded-lg bg-white p-2 text-left hover:bg-blue-100"
                      onClick={() =>
                        setAiQuery('Aký materiál potrebujem na 150m káblovú trasu na strop?')
                      }
                    >
                      Aký materiál potrebujem na 150m káblovú trasu na strop?
                    </button>
                    <button
                      className="w-full rounded-lg bg-white p-2 text-left hover:bg-blue-100"
                      onClick={() =>
                        setAiQuery('Čo všetko potrebujem na montáž rozvádzača 800x600?')
                      }
                    >
                      Čo všetko potrebujem na montáž rozvádzača 800x600?
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="border-t p-4">
            <Button variant="outline" className="w-full" onClick={() => setSelectedProduct(null)}>
              Nová otázka
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
