/**
 * Helper functions to generate CSS and JSON outputs for primitive tokens.
 * This runs independently from the themed token processing.
 */

// Flatten any nested object into an array of { name, value }
const flattenTokens = (obj: any, prefix = ''): Array<{ name: string; value: any }> => {
  const result: Array<{ name: string; value: any }> = [];
  if (!obj || typeof obj !== 'object') return result;
  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === 'object' && 'value' in val) {
      result.push({ name: newKey, value: (val as any).value });
    } else if (val && typeof val === 'object') {
      result.push(...flattenTokens(val, newKey));
    }
  }
  return result;
};

// Camel-case converter for JSON keys
const toCamelCase = (str: string): string =>
  str.replace(/[-](.)/g, (_, c) => c.toUpperCase());

// Produce a CSS string for primitives, grouping by top-level category
export function generatePrimitivesCSS(tokens: Record<string, any>): string {
  let css = `/* Primitives – Generated CSS Variables */\n`;
  
  if (!tokens || typeof tokens !== 'object') return css;
  for (const [category, section] of Object.entries(tokens)) {
    css += `\n/* ${category} */\n:root {\n`;
    const entries = flattenTokens(section, category);
    for (const { name, value } of entries) {
      const varName = name.replace(/[._]/g, '-');
      css += `  --${varName}: ${value};\n`;
    }
    css += `}\n`;
  }

  return css;
}

// Flatten to two levels and convert nested structure to flat object
const flattenToTwoLevels = (obj: any): Record<string, any> => {
  const out: Record<string, any> = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object') {
      if ('value' in v) {
        out[toCamelCase(k)] = (v as any).value;
      } else {
        for (const [sub, subVal] of Object.entries(v || {})) {
          if (subVal && typeof subVal === 'object' && 'value' in subVal) {
            const key = toCamelCase(`${k}-${sub}`);
            out[key] = (subVal as any).value;
          }
        }
      }
    }
  }
  return out;
};

// Produce a JSON object for primitives with flat key/values per category
export function generatePrimitivesJSON(tokens: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  if (!tokens || typeof tokens !== 'object') return result;
  for (const [category, section] of Object.entries(tokens)) {
    result[category] = flattenToTwoLevels(section);
  }
  return result;
}
