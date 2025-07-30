import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Move, Layers } from "lucide-react";

interface StatsCardsProps {
  tokens: any;
  outputCount: number;
}

export const StatsCards = ({ tokens, outputCount }: StatsCardsProps) => {
  // Count different types of tokens with null safety
  const colorCount = tokens?.primitives?.colors ? Object.keys(tokens.primitives.colors).length : 0;
  const spacingCount = tokens?.primitives?.spacing ? Object.keys(tokens.primitives.spacing).length : 0;
  const fontCount = tokens?.primitives?.font?.size ? Object.keys(tokens.primitives.font.size).length : 0;
  const themeCount = tokens?.Global ? Object.keys(tokens.Global).length : 0;

  const stats = [
    {
      title: "Color Palettes",
      value: colorCount,
      icon: <Palette className="w-5 h-5" />,
      description: "Primitive color schemes",
      color: "from-blue-500 to-violet-500"
    },
    {
      title: "Typography Scale", 
      value: fontCount,
      icon: <Type className="w-5 h-5" />,
      description: "Font size definitions",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Spacing Units",
      value: spacingCount,
      icon: <Move className="w-5 h-5" />,
      description: "Spacing measurements",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Output Formats",
      value: outputCount,
      icon: <Layers className="w-5 h-5" />,
      description: "Generated file types",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};