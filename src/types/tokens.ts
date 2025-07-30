export interface DesignToken {
  value: string;
  type: string;
  category?: string;
  path?: string[];
}

export interface TokenCategory {
  name: string;
  tokens: DesignToken[];
  color?: string;
}

export interface GeneratedOutput {
  format: string;
  content: string;
  filename: string;
  icon: string;
}