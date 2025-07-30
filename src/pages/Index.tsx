import { useState, useEffect } from "react";
import { TokenViewer } from "@/components/TokenViewer";
import { processTokens } from "@/utils/tokenProcessor";
import { generatePrimitivesCSS, generatePrimitivesJSON } from "@/utils/primitivesProcessor";
import primitivesTokens from "@/tokens/primitives.json";
import selectedTokens from "../../tokens/selected-tokens.json";

const Index = () => {
  const [semanticOutputs, setSemanticOutputs] = useState<any[]>([]);
  const [primitiveOutputs, setPrimitiveOutputs] = useState<any[]>([]);

  const buildSemanticTokens = () => {
    const outputs = processTokens();
    setSemanticOutputs(outputs);
  };

  const buildPrimitiveTokens = () => {
    const cssContent = generatePrimitivesCSS(primitivesTokens);
    const jsonContent = generatePrimitivesJSON(primitivesTokens);
    
    const outputs = [
      {
        format: 'CSS',
        filename: 'primitives.css',
        content: cssContent,
        icon: 'palette'
      },
      {
        format: 'JSON',
        filename: 'primitives.json',
        content: JSON.stringify(jsonContent, null, 2),
        icon: 'brackets'
      }
    ];
    
    setPrimitiveOutputs(outputs);
  };

  useEffect(() => {
    // Build tokens on initial load
    buildSemanticTokens();
    buildPrimitiveTokens();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TokenViewer
        tokens={{ primitives: primitivesTokens, semantic: selectedTokens }}
        semanticOutputs={semanticOutputs}
        primitiveOutputs={primitiveOutputs}
        onRebuildSemantic={buildSemanticTokens}
        onRebuildPrimitives={buildPrimitiveTokens}
      />
    </div>
  );
};

export default Index;
