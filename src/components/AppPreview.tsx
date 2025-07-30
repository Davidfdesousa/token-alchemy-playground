import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Search, Settings, ArrowLeft, Send, QrCode, CreditCard, Zap, Wifi, Play } from 'lucide-react';

interface AppPreviewProps {
  selectedBrand: string;
  selectedMode: string;
}

const AppPreview = ({ selectedBrand, selectedMode }: AppPreviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Home Screen */}
      <Card className="overflow-hidden bg-background border-2">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-90">9:41 AM</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-primary-foreground/60 rounded-sm"></div>
                <div className="w-4 h-2 bg-primary-foreground/60 rounded-sm"></div>
                <div className="w-4 h-2 bg-primary-foreground rounded-sm"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold">Home</h1>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <p className="text-sm opacity-90 mb-1">Total balance</p>
              <h2 className="text-2xl font-bold mb-3">$8800.250</h2>
              <p className="text-sm opacity-75">7858 XXXX XXXX XXXX</p>
              <div className="flex justify-end mt-2">
                <span className="text-lg font-bold">VISA</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button variant="secondary" className="flex flex-col gap-2 h-auto py-3">
                <Send className="w-5 h-5" />
                <span className="text-xs">Send Money</span>
              </Button>
              <Button variant="secondary" className="flex flex-col gap-2 h-auto py-3">
                <QrCode className="w-5 h-5" />
                <span className="text-xs">QR Actions</span>
              </Button>
              <Button variant="secondary" className="flex flex-col gap-2 h-auto py-3">
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Pay Bill</span>
              </Button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activities</h3>
              <Button variant="ghost" size="sm">→</Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Netflix Membership</p>
                    <p className="text-xs text-muted-foreground">19.02.2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium">- $25.90</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Turkcell Invoice</p>
                    <p className="text-xs text-muted-foreground">16.02.2021</p>
                  </div>
                </div>
                <span className="text-sm font-medium">- $65.00</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around py-4 border-t bg-muted/30">
            <Button variant="ghost" size="icon" className="text-primary">
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <CreditCard className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Report */}
      <Card className="overflow-hidden bg-background border-2">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-90">9:41 AM</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-primary-foreground/60 rounded-sm"></div>
                <div className="w-4 h-2 bg-primary-foreground/60 rounded-sm"></div>
                <div className="w-4 h-2 bg-primary-foreground rounded-sm"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold">Transaction report</h1>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Total balance</p>
              <h2 className="text-2xl font-bold mb-3">$8800.250</h2>
              <p className="text-sm opacity-75">7858 XXXX XXXX XXXX</p>
              <div className="flex justify-end mt-2">
                <span className="text-lg font-bold">VISA</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Today</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Water Bill</p>
                        <p className="text-xs text-muted-foreground">Utilities/Monthly</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-500">- $280</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Yesterday</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Income: Salary Oct</p>
                        <p className="text-xs text-muted-foreground">Transfer</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-500">+ $1200</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Electric Bill</p>
                        <p className="text-xs text-muted-foreground">Electricity</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-500">- $480</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">J</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Income: Jane transfers</p>
                        <p className="text-xs text-muted-foreground">Transfer</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-500">+ $500</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Wifi className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Internet Bill</p>
                        <p className="text-xs text-muted-foreground">Accessibility</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-500">- $100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="overflow-hidden bg-background border-2">
        <CardContent className="p-0">
          <div className="bg-muted/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">9:41 AM</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-muted-foreground rounded-sm"></div>
                <div className="w-4 h-2 bg-muted-foreground rounded-sm"></div>
                <div className="w-4 h-2 bg-foreground rounded-sm"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold">Account and card</h1>
            </div>

            <div className="flex gap-2 mb-6">
              <Button variant="default" size="sm" className="rounded-full">
                Account
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                Card
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">Jayson</h2>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Account1</p>
                <p className="text-sm text-muted-foreground">Available balance</p>
                <p className="text-sm text-muted-foreground">Branch: New York</p>
              </div>
              <div className="text-right">
                <p className="font-medium">1900 8888 1234</p>
                <p className="text-sm text-muted-foreground">$20,000</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Account 2</p>
                <p className="text-sm text-muted-foreground">Available balance</p>
                <p className="text-sm text-muted-foreground">Branch: New York</p>
              </div>
              <div className="text-right">
                <p className="font-medium">8888 1234</p>
                <p className="text-sm text-muted-foreground">$8,000</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Account 3</p>
                <p className="text-sm text-muted-foreground">Available balance</p>
                <p className="text-sm text-muted-foreground">Branch: New York</p>
              </div>
              <div className="text-right">
                <p className="font-medium">1900 1234 2222</p>
                <p className="text-sm text-muted-foreground">$230,000</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around py-4 border-t bg-muted/30">
            <Button variant="ghost" size="icon">
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <CreditCard className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppPreview;