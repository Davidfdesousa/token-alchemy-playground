import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorToken {
  name: string;
  value: string;
  category: string;
}

interface BrandTokens {
  [mode: string]: {
    [category: string]: {
      [token: string]: string;
    };
  };
}

interface DistTokens {
  [brand: string]: BrandTokens;
}

const ColorPalettePlayground = () => {
  const [selectedBrand, setSelectedBrand] = useState('tech');
  const [selectedMode, setSelectedMode] = useState('light');
  const [distTokens, setDistTokens] = useState<DistTokens | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulate loading tokens from dist folder (in real app, this would fetch from built files)
  useEffect(() => {
    // Mock data simulating the output from Style Dictionary build
    const mockDistTokens: DistTokens = {
      tech: {
        light: {
          color: {
            primary: '#2563eb',
            primaryLightest: '#dbeafe',
            primaryLighter: '#93c5fd',
            primaryDarker: '#1d4ed8',
            primaryDarkest: '#1e3a8a',
            secondary: '#64748b',
            secondaryLightest: '#f1f5f9',
            secondaryLighter: '#cbd5e1',
            secondaryDarker: '#475569',
            secondaryDarkest: '#334155',
            accent: '#10b981',
            accentLightest: '#d1fae5',
            accentLighter: '#6ee7b7',
            accentDarker: '#059669',
            accentDarkest: '#047857'
          }
        },
        dark: {
          color: {
            primary: '#3b82f6',
            primaryLightest: '#1e3a8a',
            primaryLighter: '#1d4ed8',
            primaryDarker: '#93c5fd',
            primaryDarkest: '#dbeafe',
            secondary: '#94a3b8',
            secondaryLightest: '#334155',
            secondaryLighter: '#475569',
            secondaryDarker: '#cbd5e1',
            secondaryDarkest: '#f1f5f9',
            accent: '#34d399',
            accentLightest: '#047857',
            accentLighter: '#059669',
            accentDarker: '#6ee7b7',
            accentDarkest: '#d1fae5'
          }
        }
      },
      nature: {
        light: {
          color: {
            primary: '#059669',
            primaryLightest: '#ecfdf5',
            primaryLighter: '#a7f3d0',
            primaryDarker: '#047857',
            primaryDarkest: '#064e3b',
            secondary: '#92400e',
            secondaryLightest: '#fef3c7',
            secondaryLighter: '#fcd34d',
            secondaryDarker: '#78350f',
            secondaryDarkest: '#451a03',
            accent: '#dc2626',
            accentLightest: '#fef2f2',
            accentLighter: '#fca5a5',
            accentDarker: '#b91c1c',
            accentDarkest: '#7f1d1d'
          }
        },
        dark: {
          color: {
            primary: '#10b981',
            primaryLightest: '#064e3b',
            primaryLighter: '#047857',
            primaryDarker: '#a7f3d0',
            primaryDarkest: '#ecfdf5',
            secondary: '#f59e0b',
            secondaryLightest: '#451a03',
            secondaryLighter: '#78350f',
            secondaryDarker: '#fcd34d',
            secondaryDarkest: '#fef3c7',
            accent: '#ef4444',
            accentLightest: '#7f1d1d',
            accentLighter: '#b91c1c',
            accentDarker: '#fca5a5',
            accentDarkest: '#fef2f2'
          }
        }
      },
      creative: {
        light: {
          color: {
            primary: '#7c3aed',
            primaryLightest: '#f3e8ff',
            primaryLighter: '#c4b5fd',
            primaryDarker: '#6d28d9',
            primaryDarkest: '#581c87',
            secondary: '#ec4899',
            secondaryLightest: '#fdf2f8',
            secondaryLighter: '#f9a8d4',
            secondaryDarker: '#db2777',
            secondaryDarkest: '#9d174d',
            accent: '#f59e0b',
            accentLightest: '#fffbeb',
            accentLighter: '#fde68a',
            accentDarker: '#d97706',
            accentDarkest: '#92400e'
          }
        },
        dark: {
          color: {
            primary: '#8b5cf6',
            primaryLightest: '#581c87',
            primaryLighter: '#6d28d9',
            primaryDarker: '#c4b5fd',
            primaryDarkest: '#f3e8ff',
            secondary: '#f472b6',
            secondaryLightest: '#9d174d',
            secondaryLighter: '#db2777',
            secondaryDarker: '#f9a8d4',
            secondaryDarkest: '#fdf2f8',
            accent: '#fbbf24',
            accentLightest: '#92400e',
            accentLighter: '#d97706',
            accentDarker: '#fde68a',
            accentDarkest: '#fffbeb'
          }
        }
      }
    };
    
    setDistTokens(mockDistTokens);
  }, []);

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

  const getColorTokens = (): ColorToken[] => {
    if (!distTokens || !distTokens[selectedBrand] || !distTokens[selectedBrand][selectedMode]) {
      return [];
    }

    const brandModeTokens = distTokens[selectedBrand][selectedMode];
    const colorTokens: ColorToken[] = [];

    Object.entries(brandModeTokens).forEach(([category, tokens]) => {
      if (category === 'color') {
        Object.entries(tokens).forEach(([tokenName, value]) => {
          colorTokens.push({
            name: tokenName,
            value: value as string,
            category
          });
        });
      }
    });

    return colorTokens;
  };

  const groupTokensByType = (tokens: ColorToken[]) => {
    const groups: { [key: string]: ColorToken[] } = {};
    
    tokens.forEach(token => {
      let groupName = 'Other';
      
      if (token.name.includes('primary')) {
        groupName = 'Primary';
      } else if (token.name.includes('secondary')) {
        groupName = 'Secondary';
      } else if (token.name.includes('accent')) {
        groupName = 'Accent';
      }
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(token);
    });

    return groups;
  };

  const brands = ['tech', 'nature', 'creative'];
  const modes = ['light', 'dark'];
  const colorTokens = getColorTokens();
  const groupedTokens = groupTokensByType(colorTokens);

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'tech': return '💻';
      case 'nature': return '🌿';
      case 'creative': return '🎨';
      default: return '🎯';
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4 animate-slide-up">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Style Dictionary Color Playground
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
            <div className="flex gap-3">
              {brands.map(brand => (
                <Button
                  key={brand}
                  variant={selectedBrand === brand ? 'default' : 'outline'}
                  onClick={() => setSelectedBrand(brand)}
                  className="capitalize transition-all duration-smooth hover:scale-105"
                  size="lg"
                >
                  <span className="mr-2 text-lg">{getBrandIcon(brand)}</span> 
                  {brand}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Modo</label>
            <div className="flex gap-3">
              {modes.map(mode => (
                <Button
                  key={mode}
                  variant={selectedMode === mode ? 'default' : 'outline'}
                  onClick={() => setSelectedMode(mode)}
                  className="capitalize transition-all duration-smooth hover:scale-105"
                  size="lg"
                >
                  <span className="mr-2 text-lg">{mode === 'light' ? '☀️' : '🌙'}</span>
                  {mode}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Palette Display */}
        <div className="animate-fade-in">
          <Tabs defaultValue="grouped" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="grouped" className="text-base">Agrupado por Tipo</TabsTrigger>
              <TabsTrigger value="all" className="text-base">Todas as Cores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grouped" className="space-y-8 mt-8">
              {Object.entries(groupedTokens).map(([groupName, tokens]) => (
                <Card key={groupName} className="overflow-hidden border-2 hover:shadow-lg transition-all duration-smooth">
                  <CardHeader className="bg-gradient-secondary">
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-xl">{groupName} Colors</span>
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {tokens.length} tokens
                      </Badge>
                    </CardTitle>
                  </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {tokens.map(token => (
                    <div
                      key={token.name}
                      className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div
                        className="w-full h-24 cursor-pointer"
                        style={{ backgroundColor: token.value }}
                        onClick={() => copyToClipboard(token.name, token.value)}
                      />
                      <div className="p-3 space-y-1">
                        <div className="font-mono text-xs text-muted-foreground">
                          {token.name}
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
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
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
                All Colors for {selectedBrand} ({selectedMode})
                <Badge variant="secondary">{colorTokens.length} tokens</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {colorTokens.map(token => (
                  <div
                    key={token.name}
                    className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="w-full h-20 cursor-pointer"
                      style={{ backgroundColor: token.value }}
                      onClick={() => copyToClipboard(token.name, token.value)}
                    />
                    <div className="p-2 space-y-1">
                      <div className="font-mono text-xs text-muted-foreground truncate">
                        {token.name}
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
                  &nbsp;&nbsp;color: var(--color-primary);
                  <br />
                  &nbsp;&nbsp;background: var(--color-primary-lightest);
                  <br />
                  {'}'}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Tailwind Classes</h4>
                <div className="p-3 bg-muted rounded font-mono text-xs">
                  &lt;div className="bg-primary text-primary-foreground"&gt;
                  <br />
                  &nbsp;&nbsp;Content
                  <br />
                  &lt;/div&gt;
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">JavaScript</h4>
                <div className="p-3 bg-muted rounded font-mono text-xs">
                  import tokens from './tokens.json';
                  <br />
                  <br />
                  const primary = tokens.color.primary;
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