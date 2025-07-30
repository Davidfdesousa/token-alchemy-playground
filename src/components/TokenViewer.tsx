import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Download,
  FileText,
  Code,
  Database,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BuildTokensButton } from "./BuildTokensButton";
import { StatsCards } from "./StatsCards";

interface TokenViewerProps {
  tokens: any;
  semanticOutputs: any[];
  primitiveOutputs: any[];
  onRebuildSemantic: () => void;
  onRebuildPrimitives: () => void;
}

export const TokenViewer = ({
  tokens,
  semanticOutputs,
  primitiveOutputs,
  onRebuildSemantic,
  onRebuildPrimitives,
}: TokenViewerProps) => {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState("tech");

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${type} content copied to clipboard`,
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded`,
    });
  };

  const renderColorPalette = (colors: any, title: string) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {colors && Object.entries(colors).map(
            ([colorName, colorShades]: [string, any]) => (
              <div key={colorName} className="space-y-2">
                <h4 className="text-sm font-medium capitalize text-muted-foreground">
                  {colorName}
                </h4>
                {colorShades && Object.entries(colorShades).map(
                  ([shade, tokenData]: [string, any]) => (
                    <div key={shade} className="group">
                      <div
                        className="w-full h-12 rounded-lg border shadow-sm cursor-pointer transition-all hover:scale-105"
                        style={{ backgroundColor: tokenData.value }}
                        onClick={() =>
                          copyToClipboard(
                            tokenData.value,
                            `${colorName}-${shade}`
                          )
                        }
                      />
                      <div className="mt-1 text-xs">
                        <div className="font-mono text-muted-foreground">
                          {shade}
                        </div>
                        <div className="font-mono text-xs opacity-75">
                          {tokenData.value}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );

  const formatIconMap: Record<string, JSX.Element> = {
    CSS: <FileText className="w-4 h-4" />,
    JSON: <Code className="w-4 h-4" />,
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Style Dictionary Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage and visualize your design tokens.
        </p>
        <div className="flex justify-center gap-4"></div>
      </div>

      <StatsCards
        tokens={tokens}
        outputCount={semanticOutputs.length + primitiveOutputs.length}
      />

      <Tabs defaultValue="semantic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
         
          <TabsTrigger value="semantic" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Semantics
          </TabsTrigger>
          <TabsTrigger value="primitives" className="flex items-center gap-2">
            <Database className="w-4 h-4" /> Primitives
          </TabsTrigger>
           <TabsTrigger value="colors" className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded"></div>{" "}
            Colors
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-violet-500 to-emerald-500 rounded"></div>{" "}
            Themes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="space-y-6">
          {/* existing tokens content */}
        </TabsContent>

        <TabsContent value="colors">
          {tokens?.primitives?.colors && renderColorPalette(tokens.primitives.colors, "Primitive Colors")}
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          {/* existing themes content */}
        </TabsContent>

        <TabsContent value="semantic" className="space-y-6">
          <div style={{display: "flex", width: "100%", justifyContent:"flex-end" }}>
            <BuildTokensButton onBuild={onRebuildSemantic}></BuildTokensButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {semanticOutputs.map((output, index) => (
              <Card key={index} className="group hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formatIconMap[output.format]}
                      {output.format}
                    </div>
                    <Badge variant="outline">{output.filename}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-48 overflow-auto">
                    {output.content}
                  </pre>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(output.content, output.format)
                      }
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(output.content, output.filename)
                      }
                    >
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="primitives" className="space-y-6">
          <div style={{display: "flex", width: "100%", justifyContent:"flex-end" }}>
            <BuildTokensButton
              onBuild={onRebuildPrimitives}
            ></BuildTokensButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {primitiveOutputs.map((output, index) => (
              <Card key={index} className="group hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formatIconMap[output.format]}
                      {output.format}
                    </div>
                    <Badge variant="outline">{output.filename}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-48 overflow-auto">
                    {output.content}
                  </pre>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(output.content, output.format)
                      }
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(output.content, output.filename)
                      }
                    >
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
