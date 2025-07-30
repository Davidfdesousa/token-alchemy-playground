import fs from 'fs';
import path from 'path';

/**
 * Utilitário para processar e validar tokens antes da construção
 * 
 * Funções principais:
 * - Validar estrutura do arquivo de tokens
 * - Mapear marcas e modos disponíveis
 * - Verificar referências de tokens
 * - Gerar relatórios de construção
 */

class TokenProcessor {
  constructor(tokenFilePath) {
    this.tokenFilePath = tokenFilePath;
    this.tokens = null;
    this.brands = [];
    this.modes = [];
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Carrega e valida o arquivo de tokens
   */
  loadTokens() {
    try {
      if (!fs.existsSync(this.tokenFilePath)) {
        this.errors.push(`Arquivo de tokens não encontrado: ${this.tokenFilePath}`);
        return false;
      }

      const content = fs.readFileSync(this.tokenFilePath, 'utf8');
      this.tokens = JSON.parse(content);
      
      console.log('✅ Arquivo de tokens carregado com sucesso');
      return true;
    } catch (error) {
      this.errors.push(`Erro ao carregar tokens: ${error.message}`);
      return false;
    }
  }

  /**
   * Extrai marcas disponíveis dos tokens
   */
  extractBrands() {
    if (!this.tokens) return [];

    const brands = new Set();
    
    // Procurar em tokens de marca (Brands)
    if (this.tokens.Brands) {
      this.traverseTokens(this.tokens.Brands, (token) => {
        if (token.$extensions && token.$extensions.mode) {
          Object.keys(token.$extensions.mode).forEach(brand => {
            brands.add(brand);
          });
        }
      });
    }

    this.brands = Array.from(brands);
    console.log(`📋 Marcas encontradas: ${this.brands.join(', ')}`);
    return this.brands;
  }

  /**
   * Extrai modos disponíveis dos tokens
   */
  extractModes() {
    if (!this.tokens) return [];

    const modes = new Set();
    
    // Procurar em tokens semânticos (Semantics)
    if (this.tokens.Semantics) {
      this.traverseTokens(this.tokens.Semantics, (token) => {
        if (token.$extensions && token.$extensions.mode) {
          Object.keys(token.$extensions.mode).forEach(mode => {
            modes.add(mode);
          });
        }
      });
    }

    this.modes = Array.from(modes);
    console.log(`🎨 Modos encontrados: ${this.modes.join(', ')}`);
    return this.modes;
  }

  /**
   * Percorre recursivamente a árvore de tokens
   */
  traverseTokens(obj, callback) {
    for (const key in obj) {
      const value = obj[key];
      
      if (value && typeof value === 'object') {
        // Se tem propriedade 'value', é um token
        if (value.value !== undefined) {
          callback(value);
        } else {
          // Caso contrário, continue percorrendo
          this.traverseTokens(value, callback);
        }
      }
    }
  }

  /**
   * Valida referências de tokens
   */
  validateReferences() {
    if (!this.tokens) return false;

    let validReferences = 0;
    let invalidReferences = 0;

    this.traverseTokens(this.tokens, (token) => {
      if (typeof token.value === 'string' && token.value.startsWith('{') && token.value.endsWith('}')) {
        const reference = token.value.slice(1, -1);
        
        // Verificação básica de formato da referência
        if (reference.includes('.')) {
          validReferences++;
        } else {
          invalidReferences++;
          this.warnings.push(`Referência possivelmente inválida: ${token.value}`);
        }
      }
    });

    console.log(`🔗 Referências válidas: ${validReferences}`);
    if (invalidReferences > 0) {
      console.log(`⚠️  Referências com problemas: ${invalidReferences}`);
    }

    return invalidReferences === 0;
  }

  /**
   * Gera relatório de estatísticas dos tokens
   */
  generateReport() {
    if (!this.tokens) return null;

    let globalTokens = 0;
    let brandTokens = 0;
    let semanticTokens = 0;

    // Contar tokens globais
    if (this.tokens.Global) {
      this.traverseTokens(this.tokens.Global, () => globalTokens++);
    }

    // Contar tokens de marca
    if (this.tokens.Brands) {
      this.traverseTokens(this.tokens.Brands, () => brandTokens++);
    }

    // Contar tokens semânticos
    if (this.tokens.Semantics) {
      this.traverseTokens(this.tokens.Semantics, () => semanticTokens++);
    }

    const report = {
      globalTokens,
      brandTokens,
      semanticTokens,
      totalTokens: globalTokens + brandTokens + semanticTokens,
      brands: this.brands,
      modes: this.modes,
      errors: this.errors,
      warnings: this.warnings
    };

    return report;
  }

  /**
   * Executa todo o processo de validação
   */
  process() {
    console.log('🔍 Processando tokens...');
    
    if (!this.loadTokens()) {
      return false;
    }

    this.extractBrands();
    this.extractModes();
    this.validateReferences();

    const report = this.generateReport();
    
    console.log('📊 Relatório de tokens:');
    console.log(`   • Total: ${report.totalTokens} tokens`);
    console.log(`   • Globais: ${report.globalTokens}`);
    console.log(`   • Marcas: ${report.brandTokens}`);
    console.log(`   • Semânticos: ${report.semanticTokens}`);
    console.log(`   • Marcas disponíveis: ${report.brands.length}`);
    console.log(`   • Modos disponíveis: ${report.modes.length}`);

    if (this.errors.length > 0) {
      console.log('❌ Erros encontrados:');
      this.errors.forEach(error => console.log(`   • ${error}`));
      return false;
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Avisos:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    return true;
  }
}

export default TokenProcessor;
