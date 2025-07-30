import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BuildTokensButtonProps {
  onBuild: () => void;
}

export const BuildTokensButton = ({ onBuild }: BuildTokensButtonProps) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const { toast } = useToast();

  const handleBuild = async () => {
    setIsBuilding(true);
    
    try {
      // Simulate build time
      await new Promise(resolve => setTimeout(resolve, 1500));
      onBuild();
      
      toast({
        title: "Build Complete!",
        description: "Design tokens have been successfully generated in all formats",
      });
    } catch (error) {
      toast({
        title: "Build Failed",
        description: "There was an error generating the design tokens",
        variant: "destructive",
      });
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <Button 
      onClick={handleBuild} 
      disabled={isBuilding}
      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
    >
      {isBuilding ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Building Tokens...
        </>
      ) : (
        <>
          <Play className="w-4 h-4 mr-2" />
          Build Tokens
        </>
      )}
    </Button>
  );
};