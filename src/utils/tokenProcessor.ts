import designTokens from '../../tokens/selected-tokens.json';

/**
 * Processa apenas os outputs de Themed CSS e Themed JSON para os tokens semânticos.
 */
export const processTokens = (): Array<{ format: string; filename: string; content: string; icon: string }> => {
  const outputs = [];

  // Themed CSS (light & dark por marca)
  const themedCss = generateThemedCSS(designTokens);
  outputs.push({
    format: 'CSS',
    filename: 'tokens-themed.css',
    content: themedCss,
    icon: 'palette'
  });

  // Themed JSON (light & dark por marca)
  const themedJson = generateThemedJSON(designTokens);
  outputs.push({
    format: 'JSON',
    filename: 'tokens-themed.json',
    content: JSON.stringify(themedJson, null, 2),
    icon: 'brackets'
  });

  return outputs;
};

/**
 * Converte um string kebab/underscore para camelCase
 */
const toCamelCase = (str: string): string =>
  str.replace(/[-_.](.)/g, (_, c) => c.toUpperCase());

/**
 * Extrai dinamicamente as marcas (contexts) dos tokens
 */
const extractBrandsFromTokens = (tokens: any): string[] => {
  const brands = new Set<string>();
  if (tokens.Global && typeof tokens.Global === 'object') {
    Object.keys(tokens.Global).forEach(b => brands.add(b));
  }
  const recurse = (o: any) => {
    if (o && typeof o === 'object') {
      if (o.$extensions?.mode) {
        Object.keys(o.$extensions.mode)
          .filter(b => !['light','dark','contrast'].includes(b.toLowerCase()))
          .forEach(b => brands.add(b));
      }
      Object.values(o).forEach(v => typeof v === 'object' && recurse(v));
    }
  };
  recurse(tokens);
  return Array.from(brands).map(b => b.toLowerCase());
};

/**
 * Navega recursivamente pelos tokens para coletar valores finais para um dado brand/mode
 */
const processTokensForTheme = (
  obj: any,
  brand: string,
  mode: string,
  prefix = ''
): Array<{ name: string; value: any }> => {
  const out: Array<{ name: string; value: any }> = [];
const walk = (cur: any, curPref: string) => {
    if (!cur || typeof cur !== 'object') return;
    for (const [k, v] of Object.entries(cur)) {
      const np = curPref ? `${curPref}-${k}` : k;
      if (v && typeof v === 'object') {
        if ('value' in v) {
          let val = (v as any).value;
          const ext = (v as any).$extensions?.mode;
          if (ext) {
            if (ext[mode]) val = ext[mode];
            if (ext[brand]) val = ext[brand];
          }
          out.push({ name: np, value: val });
        } else {
          walk(v, np);
        }
      }
    }
  };
  walk(obj, prefix);
  return out;
};

/**
 * Gera o CSS temático agrupado por marca e modo
 */
const generateThemedCSS = (tokens: any): string => {
  let css = `/* Design Tokens - Themed CSS per Brand (light & dark) */\n\n`;
  const brands = extractBrandsFromTokens(tokens);
  const modes: Array<'light' | 'dark'> = ['light', 'dark'];

  brands.forEach(brand => {
    css += `/* ${brand} */\n`;
    modes.forEach(mode => {
      css += `[data-schema="${brand}"][data-mode="${mode}"] {\n`;
      const vars = processTokensForTheme(tokens, brand, mode);
      vars.forEach(token => {
        const varName = token.name.replace(/[._]/g, '-');
        const cleanVal = token.value.toString().replace(/[{}]/g, '');
        css += `  --${varName}: ${cleanVal};\n`;
      });
      css += `}\n\n`;
    });
  });

  return css;
};

/**
 * Gera o JSON temático agrupado por marca e modo
 */
const generateThemedJSON = (tokens: any): any => {
  const brands = extractBrandsFromTokens(tokens);
  const modes = ['light', 'dark'];
  const result: any = {};

  brands.forEach(brand => {
    result[brand] = {};
    modes.forEach(mode => {
      const entries = processTokensForTheme(tokens, brand, mode);
      const grouped: any = {};
      entries.forEach(token => {
        const clean = token.value.toString().replace(/[{}]/g, '');
        const parts = token.name.split('-');
        const category = parts[1];
        const nameKey = toCamelCase(parts.slice(2).join('-'));
        if (!grouped[category]) grouped[category] = {};
        grouped[category][nameKey] = clean;
      });
      result[brand][mode] = grouped;
    });
  });

  return result;
};
