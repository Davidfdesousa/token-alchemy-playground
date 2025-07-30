// src/pages/Index.tsx
import { useEffect, useState } from "react";
import { TokenViewer } from "@/components/TokenViewer";
import { processTokens } from "@/utils/tokenProcessor";
import designTokens from "../../tokens/selected-tokens.json";

// Import direto dos helpers de primitivos
import primitiveTokens from "../../tokens/design-tokens.json";
import {
  generatePrimitivesCSS,
  generatePrimitivesJSON,
} from "@/utils/primitivesProcessor";

const Index = () => {
  const [semanticOutputs, setSemanticOutputs] = useState<any[]>([]);
  const [primitiveOutputs, setPrimitiveOutputs] = useState<any[]>([]);

  const handleRebuildSemantic = () => {
    const sem = processTokens();
    setSemanticOutputs(sem);
  };

  const handleRebuildPrimitives = () => {
    // Gera o CSS e JSON de primitivos
    const css = generatePrimitivesCSS(primitiveTokens);
    const jsonObj = generatePrimitivesJSON(primitiveTokens);

    setPrimitiveOutputs([
      { format: "CSS", filename: "primitives.css", content: css, icon: "file-text" },
      {
        format: "JSON",
        filename: "primitives.json",
        content: JSON.stringify(jsonObj, null, 2),
        icon: "brackets",
      },
    ]);
  };

  useEffect(() => {
    handleRebuildSemantic();
    // opcional: já chame também os primitivos na montagem
    handleRebuildPrimitives();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TokenViewer
        tokens={designTokens}
        semanticOutputs={semanticOutputs}
        primitiveOutputs={primitiveOutputs}
        onRebuildSemantic={handleRebuildSemantic}
        onRebuildPrimitives={handleRebuildPrimitives}
      />
    </div>
  );
};

export default Index;
