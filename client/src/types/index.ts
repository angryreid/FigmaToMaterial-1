// Figma Design types
export interface FigmaDesign {
  fileKey: string;
  fileName?: string;
  components: FigmaComponent[];
  stats: DesignStats;
}

export interface FigmaComponent {
  figmaId: string;
  name: string;
  type: string;
  angularComponent?: string;
  supportStatus: 'supported' | 'partial' | 'unsupported';
  properties?: Record<string, any>;
  styles?: Record<string, any>;
  generatedHtml?: string;
  generatedTs?: string;
  generatedScss?: string;
}

export interface DesignStats {
  totalComponents: number;
  frames: number;
  supported: number;
  partial: number;
  unsupported: number;
}

// Step types
export type ConversionStep = 'import' | 'analyze' | 'convert' | 'export';

// Code Generation
export interface GeneratedCode {
  html: string;
  ts: string;
  scss: string;
}

export interface CodeFile {
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface ProjectStructure {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: ProjectStructure[];
}
