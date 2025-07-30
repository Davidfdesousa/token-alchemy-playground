import StyleDictionary from 'style-dictionary';

// Mapeamento das marcas para nomes de arquivo mais amigáveis
const BRAND_MAPPING = {
  'Maçã': 'apple',
  'Banana': 'banana', 
  'Cereja': 'cherry',
  'Damasco': 'apricot',
  'Uva': 'grape',
  'Figo': 'fig',
  'Kiwi': 'kiwi',
  'Laranja': 'orange'
};

// Lista de todas as marcas para iteração
const BRANDS = Object.keys(BRAND_MAPPING);

/**
 * Transform customizado para nomear tokens CSS sem prefixos
 */
StyleDictionary.registerTransform({
  name: 'name/css-custom',
  type: 'name',
  transform: function(token) {
    // Remove prefixos desnecessários e ajusta o nome
    const path = token.path.slice();
    
    // Remove 'Global', 'Brands', 'Semantics' se for o primeiro elemento
    if (['Global', 'Brands', 'Semantics'].includes(path[0])) {
      path.shift();
    }
    
    return path.join('_');
  }
});

/**
 * Transform para processar valores baseados em modos e extensões
 */
StyleDictionary.registerTransform({
  name: 'value/mode-aware',
  type: 'value',
  transform: function(token, options) {
    const mode = options?.mode || 'Light';
    const brand = options?.brand || 'apple';
    const brandMap = {
      'apple': 'Maçã',
      'banana': 'Banana',
      'cherry': 'Cereja',
      'apricot': 'Damasco',
      'grape': 'Uva',
      'fig': 'Figo',
      'kiwi': 'Kiwi',
      'orange': 'Laranja'
    };
    
    // Se o token tem extensões de modo, usar o valor específico do modo
    if (token.$extensions?.mode) {
      const modeValue = token.$extensions.mode[mode];
      if (modeValue !== undefined) {
        return modeValue;
      }
    }
    
    // Se o token tem extensões de marca, usar o valor específico da marca
    if (token.$extensions?.mode && brandMap[brand]) {
      const brandValue = token.$extensions.mode[brandMap[brand]];
      if (brandValue !== undefined) {
        return brandValue;
      }
    }
    
    return token.value;
  }
});

/**
 * Transform group customizado para CSS
 */
StyleDictionary.registerTransformGroup({
  name: 'css-custom',
  transforms: [
    'attribute/cti',
    'name/css-custom',
    'value/mode-aware',
    'color/css'
  ]
});

/**
 * Formato customizado para CSS com custom properties
 * Gera variáveis CSS no formato --token-name: value;
 */
StyleDictionary.registerFormat({
  name: 'css/custom-properties',
  format: function({ dictionary, options }) {
    const brand = options?.brand || 'default';
    const mode = options?.mode || 'light';
    
    // Determina o seletor baseado na marca e modo
    let selector;
    if (mode === 'light') {
      selector = brand === 'apple' 
        ? `[class*="ids-theme-${brand}"], :root:not([class*="ids-theme-"])`
        : `[class*="ids-theme-${brand}"]`;
    } else {
      selector = `[class*="ids-theme-${brand}"][data-schema="dark"]`;
    }
    
    // Filtrar tokens baseado no modo
    let tokensToInclude;
    if (mode === 'dark') {
      // No modo dark, incluir apenas tokens que começam com 'color'
      tokensToInclude = dictionary.allTokens.filter(token => 
        token.name.startsWith('color_')
      );
    } else {
      // No modo light, incluir todos os tokens
      tokensToInclude = dictionary.allTokens;
    }
    
    return `${selector} {
${tokensToInclude.map(token => 
  `  --${token.name}: ${token.value};`
).join('\n')}
}
`;
  }
});

/**
 * Formato customizado para JSON flat
 * Gera arquivo JSON com estrutura simples key-value
 */
StyleDictionary.registerFormat({
  name: 'json/flat',
  format: function({ dictionary, options }) {
    const brand = options?.brand || 'default';
    const mode = options?.mode || 'light';
    
    const tokens = {};
    dictionary.allTokens.forEach(token => {
      tokens[token.name] = token.value;
    });

    return JSON.stringify({
      meta: {
        brand: brand,
        mode: mode,
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      },
      tokens: tokens
    }, null, 2);
  }
});

// Configuração principal do Style Dictionary
const config = {
  log: {
    verbosity: 'verbose'
  },
  // Incluir tokens base e o arquivo principal com a estrutura original
  source: [
    'tokens/base-tokens.json',
    'tokens/selected-tokens.json'
  ],
  
  // Configuração de plataformas
  platforms: {}
};

// Para demonstração, vou criar algumas configurações básicas primeiro
// Todas as marcas - modo Light
BRANDS.forEach(brand => {
  const brandKey = BRAND_MAPPING[brand];
  
  // CSS para modo Light
  config.platforms[`css-${brandKey}-light`] = {
    transformGroup: 'css-custom',
    buildPath: `dist/tokens/${brandKey}/css/`,
    files: [{
      destination: 'light.css',
      format: 'css/custom-properties',
      options: {
        brand: brandKey,
        mode: 'light'
      }
    }]
  };

  // CSS para modo Dark  
  config.platforms[`css-${brandKey}-dark`] = {
    transformGroup: 'css-custom',
    buildPath: `dist/tokens/${brandKey}/css/`,
    files: [{
      destination: 'dark.css',
      format: 'css/custom-properties',
      options: {
        brand: brandKey,
        mode: 'dark'
      }
    }]
  };

  // JSON para modo Light
  config.platforms[`json-${brandKey}-light`] = {
    transformGroup: 'js',
    buildPath: `dist/tokens/${brandKey}/json/`,
    files: [{
      destination: 'light.json',
      format: 'json/flat',
      options: {
        brand: brandKey,
        mode: 'light'
      }
    }]
  };

  // JSON para modo Dark
  config.platforms[`json-${brandKey}-dark`] = {
    transformGroup: 'js',
    buildPath: `dist/tokens/${brandKey}/json/`,
    files: [{
      destination: 'dark.json',
      format: 'json/flat',
      options: {
        brand: brandKey,
        mode: 'dark'
      }
    }]
  };
});

export default config;