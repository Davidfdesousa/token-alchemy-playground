import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorToken {
  name: string;
  value: string;
  category: string;
}

const ColorPalettePlayground = () => {
  const [selectedBrand, setSelectedBrand] = useState('apple');
  const [selectedMode, setSelectedMode] = useState('light');
  const [allTokens, setAllTokens] = useState<Record<string, Record<string, Record<string, string>>>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Marcas reais da pasta dist/tokens
  const brands = [
    { id: "apple", name: "Apple", emoji: "🍎" },
    { id: "apricot", name: "Apricot", emoji: "🍑" },
    { id: "banana", name: "Banana", emoji: "🍌" },
    { id: "cherry", name: "Cherry", emoji: "🍒" },
    { id: "fig", name: "Fig", emoji: "🫐" },
    { id: "grape", name: "Grape", emoji: "🍇" },
    { id: "kiwi", name: "Kiwi", emoji: "🥝" },
    { id: "orange", name: "Orange", emoji: "🍊" },
  ];

  const modes = [
    { id: "light", name: "Light", emoji: "☀️" },
    { id: "dark", name: "Dark", emoji: "🌙" },
  ];

  // Carrega todos os tokens de uma vez
  const loadAllTokens = async () => {
    setLoading(true);
    try {
      const tokenCache: Record<string, Record<string, Record<string, string>>> = {};
      
      for (const brand of brands) {
        tokenCache[brand.id] = {};
        for (const mode of modes) {
          try {
            const response = await fetch(`/dist/tokens/${brand.id}/css/${mode.id}.css`);
            const cssText = await response.text();
            
            const colorTokens: Record<string, string> = {};
            const regex = /--color_([^:]+):\s*([^;]+);/g;
            let match;
            
            while ((match = regex.exec(cssText)) !== null) {
              const tokenName = match[1];
              const tokenValue = match[2].trim();
              colorTokens[tokenName] = tokenValue;
            }
            
            tokenCache[brand.id][mode.id] = colorTokens;
          } catch (error) {
            console.error(`Erro ao carregar tokens para ${brand.id}/${mode.id}:`, error);
            tokenCache[brand.id][mode.id] = {};
          }
        }
      }
      
      setAllTokens(tokenCache);
    } catch (error) {
      console.error("Erro ao carregar tokens:", error);
      toast({
        title: "Erro ao carregar tokens",
        description: "Não foi possível carregar os tokens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Carrega todos os tokens na inicialização
  useEffect(() => {
    loadAllTokens();
  }, []);

  // Aplica a classe de tema dinamicamente
  useEffect(() => {
    const body = document.body;
    
    // Remove classes de tema anteriores
    body.className = body.className.replace(/ids-theme-\w+/g, '');
    
    // Adiciona nova classe de tema
    body.classList.add(`ids-theme-${selectedBrand}`);
    
    // Define o modo (light/dark)
    if (selectedMode === 'dark') {
      body.setAttribute('data-schema', 'dark');
    } else {
      body.removeAttribute('data-schema');
    }
  }, [selectedBrand, selectedMode]);

  const copyToClipboard = async (token: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
      
      toast({
        title: "Cor copiada!",
        description: `${value} foi copiado para a área de transferência.`,
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a cor. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getCurrentTokens = () => {
    return allTokens[selectedBrand]?.[selectedMode] || {};
  };

  const getColorTokens = (): ColorToken[] => {
    const currentTokens = getCurrentTokens();
    return Object.entries(currentTokens).map(([name, value]) => ({
      name,
      value,
      category: 'color'
    }));
  };

  const groupTokensByType = (tokens: ColorToken[]) => {
    const groups: { [key: string]: ColorToken[] } = {};
    
    tokens.forEach(token => {
      let groupName = 'Other';
      
      if (token.name.includes('brand_primary')) {
        groupName = 'Brand Primary';
      } else if (token.name.includes('brand_secondary')) {
        groupName = 'Brand Secondary';
      } else if (token.name.includes('text_')) {
        groupName = 'Text Colors';
      } else if (token.name.includes('surface_')) {
        groupName = 'Surface Colors';
      } else if (token.name.includes('stroke_')) {
        groupName = 'Stroke Colors';
      } else if (token.name.includes('container_')) {
        groupName = 'Container Colors';
      } else if (token.name.includes('feedback_')) {
        groupName = 'Feedback Colors';
      }
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(token);
    });

    return groups;
  };

  const colorTokens = getColorTokens();
  const groupedTokens = groupTokensByType(colorTokens);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4 animate-slide-up">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Design Tokens Playground
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore as paletas de cores geradas pelo Style Dictionary para diferentes marcas e temas. 
            Clique nas cores para copiar os valores.
          </p>
        </div>

        {/* Brand and Mode Selection */}
        <div className="flex flex-wrap gap-6 justify-center items-end animate-scale-in">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Marca</label>
            <div className="flex flex-wrap gap-3">
              {brands.map(brand => (
                <Button
                  key={brand.id}
                  variant={selectedBrand === brand.id ? 'default' : 'outline'}
                  onClick={() => setSelectedBrand(brand.id)}
                  className="capitalize transition-all duration-300 hover:scale-105"
                  size="lg"
                   disabled={loading}
                 >
                   <span className="mr-2 text-lg">{brand.emoji}</span> 
                   {brand.name}
                 </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Modo</label>
            <div className="flex gap-3">
              {modes.map(mode => (
                <Button
                  key={mode.id}
                  variant={selectedMode === mode.id ? 'default' : 'outline'}
                  onClick={() => setSelectedMode(mode.id)}
                  className="capitalize transition-all duration-300 hover:scale-105"
                  size="lg"
                   disabled={loading}
                 >
                   <span className="mr-2 text-lg">{mode.emoji}</span>
                   {mode.name}
                 </Button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Carregando tokens...
            </div>
          )}
        </div>

        {/* Color Palette Display */}
        {!loading && (
          <div className="animate-fade-in">
            <Tabs defaultValue="grouped" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="grouped" className="text-base">Agrupado por Tipo</TabsTrigger>
                <TabsTrigger value="all" className="text-base">Todas as Cores</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grouped" className="space-y-8 mt-8">
                {Object.entries(groupedTokens).map(([groupName, tokens]) => (
                  <Card key={groupName} className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
                     <CardHeader className="bg-muted/50 border-b">
                       <CardTitle className="flex items-center gap-3 text-foreground">
                         <span className="text-xl font-semibold">{groupName}</span>
                         <Badge variant="secondary" className="text-sm px-3 py-1">
                           {tokens.length} tokens
                         </Badge>
                       </CardTitle>
                     </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {tokens.map(token => (
                          <div
                            key={token.name}
                            className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            <div
                              className="w-full h-24 cursor-pointer relative"
                              style={{ backgroundColor: token.value }}
                              onClick={() => copyToClipboard(token.name, token.value)}
                            >
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                            <div className="p-3 space-y-1">
                              <div className="font-mono text-xs text-muted-foreground truncate">
                                {token.name.replace(/_/g, ' ')}
                              </div>
                              <div className="font-mono text-xs font-medium">
                                {token.value}
                              </div>
                              <button
                                onClick={() => copyToClipboard(token.name, token.value)}
                                className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {copiedToken === token.name ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copiar
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Todas as Cores - {brands.find(b => b.id === selectedBrand)?.name} ({modes.find(m => m.id === selectedMode)?.name})
                      <Badge variant="secondary">{colorTokens.length} tokens</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                      {colorTokens.map(token => (
                        <div
                          key={token.name}
                          className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <div
                            className="w-full h-20 cursor-pointer relative"
                            style={{ backgroundColor: token.value }}
                            onClick={() => copyToClipboard(token.name, token.value)}
                          >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                          <div className="p-2 space-y-1">
                            <div className="font-mono text-xs text-muted-foreground truncate" title={token.name}>
                              {token.name.replace(/_/g, ' ')}
                            </div>
                            <div className="font-mono text-xs font-medium">
                              {token.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Exemplos de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">CSS Variables</h4>
                <div className="p-3 bg-muted rounded font-mono text-xs">
                  .element {'{'}
                  <br />
                  &nbsp;&nbsp;color: var(--color_brand_primary_accent);
                  <br />
                  &nbsp;&nbsp;background: var(--color_brand_primary_lightest);
                  <br />
                  {'}'}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Classe CSS</h4>
                <div className="p-3 bg-muted rounded font-mono text-xs">
                  &lt;div className="ids-theme-{selectedBrand}"&gt;
                  <br />
                  &nbsp;&nbsp;Conteúdo com tema aplicado
                  <br />
                  &lt;/div&gt;
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Modo Escuro</h4>
                <div className="p-3 bg-muted rounded font-mono text-xs">
                  &lt;div className="ids-theme-{selectedBrand}" data-schema="dark"&gt;
                  <br />
                  &nbsp;&nbsp;Conteúdo em modo escuro
                  <br />
                  &lt;/div&gt;
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColorPalettePlayground;