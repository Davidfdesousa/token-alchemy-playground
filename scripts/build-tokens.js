import StyleDictionary from 'style-dictionary';
import config from '../style-dictionary.config.js';
import TokenProcessor from '../utils/tokenProcessor.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set verbose logging
StyleDictionary.verbosity = 'verbose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para construir design tokens usando Style Dictionary
 * 
 * Este script:
 * 1. Valida e processa o arquivo mestre de tokens (tokens/selected-tokens.json)
 * 2. Separa os tokens por marca (apple, banana, cherry, etc.)
 * 3. Gera arquivos CSS e JSON para cada marca e modo (light/dark)
 * 4. Organiza a saída na estrutura: dist/tokens/{brand}/{css|json}/{light|dark}.{css|json}
 */

console.log('🎨 Construindo design tokens com Style Dictionary...');
console.log('📁 Fonte: tokens/selected-tokens.json');
console.log('📁 Destino: dist/tokens/');

// Verificar se o arquivo fonte existe
const sourceFile = path.join(__dirname, '../tokens/selected-tokens.json');
if (!fs.existsSync(sourceFile)) {
  console.error('❌ Erro: Arquivo fonte não encontrado em tokens/selected-tokens.json');
  process.exit(1);
}

// Processar e validar tokens antes da construção
console.log('');
const processor = new TokenProcessor(sourceFile);
if (!processor.process()) {
  console.error('❌ Falha na validação dos tokens. Construção abortada.');
  process.exit(1);
}

// Criar diretório de saída se não existir
const outputDir = path.join(__dirname, '../dist/tokens');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Diretório de saída criado: dist/tokens/');
}

try {
  // Inicializar Style Dictionary com a nova API (v5.x)
  const sd = new StyleDictionary(config);
  
  console.log('');
  console.log('🔄 Processando tokens...');
  
  // Construir todas as plataformas (todas as combinações de marca/modo)
  await sd.buildAllPlatforms();
  
  console.log('✅ Design tokens construídos com sucesso!');
  console.log('');
  console.log('📁 Arquivos gerados:');
  
  // Listar as marcas disponíveis
  const brands = ['apple', 'banana', 'cherry', 'apricot', 'grape', 'fig', 'kiwi', 'orange'];
  const modes = ['light', 'dark'];
  
  brands.forEach(brand => {
    const brandDir = path.join(outputDir, brand);
    if (fs.existsSync(brandDir)) {
      console.log(`   📂 ${brand}/`);
      modes.forEach(mode => {
        const cssFile = path.join(brandDir, 'css', `${mode}.css`);
        const jsonFile = path.join(brandDir, 'json', `${mode}.json`);
        
        if (fs.existsSync(cssFile)) {
          const stats = fs.statSync(cssFile);
          console.log(`      • css/${mode}.css (${Math.round(stats.size / 1024)}KB)`);
        }
        
        if (fs.existsSync(jsonFile)) {
          const stats = fs.statSync(jsonFile);
          console.log(`      • json/${mode}.json (${Math.round(stats.size / 1024)}KB)`);
        }
      });
    }
  });
  
  console.log('');
  console.log('🎯 Uso dos arquivos:');
  console.log('   • CSS: Importe em seus projetos para usar as custom properties');
  console.log('   • JSON: Use para integração com JavaScript/TypeScript');
  console.log('');
  console.log('💡 Exemplo de uso CSS:');
  console.log('   @import "dist/tokens/apple/css/light.css";');
  console.log('   .my-element { color: var(--color-brand-primary-lightest); }');
  console.log('');
  console.log('💡 Exemplo de uso JSON:');
  console.log('   import tokens from "dist/tokens/apple/json/light.json";');
  console.log('   const primaryColor = tokens.tokens["color-brand-primary-lightest"];');
  
  // Gerar índice de tokens disponíveis
  generateTokenIndex(outputDir, brands, modes);
  
} catch (error) {
  console.error('❌ Erro ao construir tokens:', error.message);
  console.error(error.stack);
  process.exit(1);
}

/**
 * Gera um arquivo índice com informações sobre todos os tokens disponíveis
 */
function generateTokenIndex(outputDir, brands, modes) {
  const index = {
    meta: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      description: 'Índice de design tokens gerados'
    },
    brands: {},
    summary: {
      totalBrands: brands.length,
      totalModes: modes.length,
      totalFiles: brands.length * modes.length * 2 // CSS + JSON para cada combinação
    }
  };

  brands.forEach(brand => {
    index.brands[brand] = {
      modes: {}
    };

    modes.forEach(mode => {
      const cssFile = path.join(outputDir, brand, 'css', `${mode}.css`);
      const jsonFile = path.join(outputDir, brand, 'json', `${mode}.json`);

      index.brands[brand].modes[mode] = {
        css: {
          path: `tokens/${brand}/css/${mode}.css`,
          exists: fs.existsSync(cssFile),
          size: fs.existsSync(cssFile) ? fs.statSync(cssFile).size : 0
        },
        json: {
          path: `tokens/${brand}/json/${mode}.json`,
          exists: fs.existsSync(jsonFile),
          size: fs.existsSync(jsonFile) ? fs.statSync(jsonFile).size : 0
        }
      };
    });
  });

  const indexPath = path.join(outputDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  
  console.log('');
  console.log('📋 Índice de tokens gerado: dist/tokens/index.json');
}