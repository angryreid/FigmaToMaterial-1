import { FigmaFileResponse } from "@shared/schema";
import type { FigmaComponent } from "@/types";
import fetch from 'node-fetch';

// Mapping of common Figma button components to Angular Material variants
const BUTTON_VARIANTS: Record<string, string> = {
  'primary': 'raised',
  'secondary': 'stroked',
  'text': 'basic',
  'icon': 'icon',
  'flat': 'flat'
};

// Mapping of common input field variants to Angular Material appearances
const INPUT_APPEARANCES: Record<string, string> = {
  'outline': 'outline',
  'standard': 'standard',
  'fill': 'fill'
};

// Known component IDs for specific component types (would be expanded in production)
const COMPONENT_TYPE_IDS: Record<string, string[]> = {
  'Button': ['button-primary', 'button-secondary', 'button-flat', 'button-icon'],
  'Input': ['input-standard', 'input-outline', 'input-fill', 'text-field'],
  'Card': ['card-standard', 'card-elevated', 'card-outlined'],
  'Checkbox': ['checkbox-standard', 'checkbox-indeterminate'],
  'Radio': ['radio-button', 'radio-option'],
  'Select': ['select-standard', 'dropdown', 'combobox'],
  'DatePicker': ['date-picker', 'calendar-input'],
  'Tabs': ['tabs-standard', 'tab-bar'],
  'Table': ['table-standard', 'data-table']
};

/**
 * Extract Figma file key from a Figma URL
 */
function extractFileKeyFromUrl(url: string): string {
  // Handle different Figma URL formats
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // File URL format: https://www.figma.com/file/KEY/title
    if (pathParts.includes('file')) {
      const keyIndex = pathParts.indexOf('file') + 1;
      if (keyIndex < pathParts.length) {
        return pathParts[keyIndex];
      }
    }
    
    // Design URL format: https://www.figma.com/design/KEY/title
    if (pathParts.includes('design')) {
      const keyIndex = pathParts.indexOf('design') + 1;
      if (keyIndex < pathParts.length) {
        return pathParts[keyIndex];
      }
    }
    
    // Prototype URL format: https://www.figma.com/proto/KEY/title
    if (pathParts.includes('proto')) {
      const keyIndex = pathParts.indexOf('proto') + 1;
      if (keyIndex < pathParts.length) {
        return pathParts[keyIndex];
      }
    }
    
    // If we couldn't extract a key, use a generic fallback
    return 'figma-file-key';
  } catch (error) {
    console.error('Error extracting file key from URL:', error);
    return 'figma-file-key';
  }
}

/**
 * Import design from Figma using the provided URL
 */
export async function importFigmaFile(url: string): Promise<any> {
  console.log(`Importing Figma file from URL: ${url}`);
  
  // In a production environment, we would use the Figma API
  // This requires a Figma API token
  try {
    const fileKey = extractFileKeyFromUrl(url);
    
    // In a real implementation with an API token:
    /*
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': process.env.FIGMA_API_TOKEN
      }
    });
    
    if (!response.ok) {
      throw new Error(`Figma API returned ${response.status}: ${await response.text()}`);
    }
    
    return await response.json();
    */
    
    // For now, simulate API response with mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: fileKey,
      name: "Design System",
      lastModified: new Date().toISOString(),
      thumbnailUrl: "https://example.com/thumbnail.png",
      document: {
        children: [
          {
            id: "0:1",
            name: "Page 1",
            type: "CANVAS",
            children: [
              {
                id: "1:1",
                name: "Primary Button",
                type: "INSTANCE",
                componentId: "button-primary",
                fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 0.9 } }],
                effects: [{ type: 'DROP_SHADOW', visible: true }],
                absoluteBoundingBox: { width: 120, height: 40 },
                strokes: [],
                cornerRadius: 4
              },
              {
                id: "1:2",
                name: "Input Field",
                type: "INSTANCE",
                componentId: "input-standard",
                absoluteBoundingBox: { width: 280, height: 56 },
                fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                strokes: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }],
                cornerRadius: 4,
                children: [
                  {
                    id: "1:2:1",
                    name: "Label",
                    type: "TEXT",
                    characters: "Username"
                  },
                  {
                    id: "1:2:2",
                    name: "Input",
                    type: "RECTANGLE"
                  },
                  {
                    id: "1:2:3",
                    name: "Hint",
                    type: "TEXT",
                    characters: "Enter your username"
                  }
                ]
              },
              {
                id: "1:3",
                name: "Card Component",
                type: "FRAME",
                absoluteBoundingBox: { width: 320, height: 200 },
                fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                effects: [{ type: 'DROP_SHADOW', visible: true }],
                cornerRadius: 8,
                children: [
                  {
                    id: "1:3:1",
                    name: "Card Title",
                    type: "TEXT",
                    characters: "Card Title",
                    style: { fontWeight: 600, fontSize: 18 }
                  },
                  {
                    id: "1:3:2",
                    name: "Card Content",
                    type: "TEXT",
                    characters: "This is the card content area with description text."
                  },
                  {
                    id: "1:3:3",
                    name: "Card Actions",
                    type: "FRAME",
                    children: [
                      {
                        id: "1:3:3:1",
                        name: "Action 1",
                        type: "INSTANCE",
                        componentId: "button-text"
                      },
                      {
                        id: "1:3:3:2",
                        name: "Action 2",
                        type: "INSTANCE",
                        componentId: "button-text"
                      }
                    ]
                  }
                ]
              },
              {
                id: "1:4",
                name: "Date Picker",
                type: "INSTANCE",
                componentId: "date-picker",
                absoluteBoundingBox: { width: 280, height: 56 },
                children: [
                  {
                    id: "1:4:1",
                    name: "Input",
                    type: "INSTANCE",
                    componentId: "input-standard",
                    children: [
                      {
                        id: "1:4:1:1",
                        name: "Label",
                        type: "TEXT",
                        characters: "Select Date"
                      }
                    ]
                  },
                  {
                    id: "1:4:2",
                    name: "Calendar Icon",
                    type: "VECTOR"
                  }
                ]
              },
              {
                id: "1:5",
                name: "Custom Carousel",
                type: "FRAME",
                absoluteBoundingBox: { width: 400, height: 240 },
                children: [
                  {
                    id: "1:5:1",
                    name: "Slide 1",
                    type: "RECTANGLE"
                  },
                  {
                    id: "1:5:2",
                    name: "Slide 2",
                    type: "RECTANGLE"
                  },
                  {
                    id: "1:5:3",
                    name: "Navigation",
                    type: "FRAME",
                    children: [
                      {
                        id: "1:5:3:1",
                        name: "Prev",
                        type: "VECTOR"
                      },
                      {
                        id: "1:5:3:2",
                        name: "Next",
                        type: "VECTOR"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  } catch (error) {
    console.error('Error importing Figma file:', error);
    throw new Error(`Failed to import Figma design: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Analyze Figma data to extract components and their properties
 */
export async function analyzeFigmaComponents(figmaData: any): Promise<FigmaFileResponse> {
  console.log("Analyzing Figma components");
  
  try {
    // Generate file key from the Figma data
    const fileKey = figmaData.id || "figma-file-1";
    const fileName = figmaData.name || "Design System";
    
    // Extract components from the Figma document
    const components: FigmaComponent[] = [];
    let frameCount = 0;
    
    // Traverse the document tree to find components
    traverseFigmaNodes(figmaData.document, components, frameCount);
    
    // Calculate stats
    const supported = components.filter(c => c.supportStatus === "supported").length;
    const partial = components.filter(c => c.supportStatus === "partial").length;
    const unsupported = components.filter(c => c.supportStatus === "unsupported").length;
    
    // Return analysis results
    return {
      fileKey,
      fileName,
      components,
      stats: {
        totalComponents: components.length,
        frames: frameCount,
        supported,
        partial,
        unsupported
      }
    };
  } catch (error) {
    console.error('Error analyzing Figma components:', error);
    throw new Error(`Failed to analyze Figma components: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Traverse Figma document nodes to identify components
 */
function traverseFigmaNodes(node: any, components: FigmaComponent[] = [], frameCount: number = 0): void {
  // Check if the current node is a component candidate
  if (isComponentCandidate(node)) {
    const componentType = detectComponentType(node);
    const componentProps = extractComponentProperties(node, componentType);
    const styles = extractComponentStyles(node);
    const supportStatus = determineComponentSupportStatus(componentType);
    const angularComponent = mapToAngularMaterialComponent(componentType);
    
    components.push({
      figmaId: node.id,
      name: node.name,
      type: componentType,
      angularComponent,
      supportStatus,
      properties: componentProps,
      styles
    });
  }
  
  // Count frames
  if (node.type === 'FRAME' || node.type === 'GROUP') {
    frameCount++;
  }
  
  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child: any) => traverseFigmaNodes(child, components, frameCount));
  }
}

/**
 * Check if a node is a potential component candidate
 */
function isComponentCandidate(node: any): boolean {
  // Component or instance nodes
  if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    return true;
  }
  
  // Frames that might represent components
  if (node.type === 'FRAME') {
    const nameLower = node.name.toLowerCase();
    return (
      nameLower.includes('button') ||
      nameLower.includes('input') ||
      nameLower.includes('field') ||
      nameLower.includes('card') ||
      nameLower.includes('checkbox') ||
      nameLower.includes('select') ||
      nameLower.includes('date') ||
      nameLower.includes('table') ||
      nameLower.includes('tab') ||
      nameLower.includes('carousel')
    );
  }
  
  return false;
}

/**
 * Detect the type of component based on node properties
 */
function detectComponentType(node: any): string {
  const nameLower = node.name.toLowerCase();
  
  // Check component ID if available
  if (node.componentId) {
    for (const [type, ids] of Object.entries(COMPONENT_TYPE_IDS)) {
      if (ids.includes(node.componentId)) {
        return type;
      }
    }
  }
  
  // Check name patterns
  if (nameLower.includes('button')) {
    return 'Button';
  }
  
  if (nameLower.includes('input') || nameLower.includes('field') || nameLower.includes('text field')) {
    return 'Input';
  }
  
  if (nameLower.includes('card')) {
    return 'Card';
  }
  
  if (nameLower.includes('check') || nameLower.includes('checkbox')) {
    return 'Checkbox';
  }
  
  if (nameLower.includes('select') || nameLower.includes('dropdown') || nameLower.includes('combo')) {
    return 'Select';
  }
  
  if (nameLower.includes('date') || nameLower.includes('calendar')) {
    return 'DatePicker';
  }
  
  if (nameLower.includes('tab') && !nameLower.includes('table')) {
    return 'Tabs';
  }
  
  if (nameLower.includes('table') || nameLower.includes('data table')) {
    return 'Table';
  }
  
  if (nameLower.includes('carousel') || nameLower.includes('slider')) {
    return 'Carousel';
  }
  
  // Analyze structure
  if (hasButtonLikeStructure(node)) {
    return 'Button';
  }
  
  if (hasInputFieldStructure(node)) {
    return 'Input';
  }
  
  if (hasCardStructure(node)) {
    return 'Card';
  }
  
  // Default to custom component
  return 'Custom';
}

/**
 * Check if node has button-like structure
 */
function hasButtonLikeStructure(node: any): boolean {
  // Buttons often have specific characteristics
  const hasButtonShape = node.cornerRadius && node.cornerRadius > 0;
  const isClickable = node.name.toLowerCase().includes('click') || 
                      node.name.toLowerCase().includes('action');
  const hasLimitedSize = node.absoluteBoundingBox && 
                         node.absoluteBoundingBox.width < 300 &&
                         node.absoluteBoundingBox.height < 100;
  
  return hasButtonShape && (isClickable || hasLimitedSize);
}

/**
 * Check if node has input field structure
 */
function hasInputFieldStructure(node: any): boolean {
  // Input fields often have specific characteristics
  if (!node.children) return false;
  
  const hasLabel = node.children.some((child: any) => 
    child.type === 'TEXT' && 
    (child.name.toLowerCase().includes('label') || 
     child.characters?.length < 30)
  );
  
  const hasInputArea = node.children.some((child: any) =>
    child.type === 'RECTANGLE' ||
    (child.type === 'FRAME' && child.name.toLowerCase().includes('input'))
  );
  
  return hasLabel && hasInputArea;
}

/**
 * Check if node has card structure
 */
function hasCardStructure(node: any): boolean {
  // Cards often have specific characteristics
  if (node.type !== 'FRAME' && node.type !== 'GROUP') return false;
  
  const hasElevation = node.effects && 
                       node.effects.some((effect: any) => 
                         effect.type === 'DROP_SHADOW' && effect.visible !== false
                       );
  
  const hasCardContent = node.children && 
                         node.children.length > 1 &&
                         node.children.some((child: any) => child.type === 'TEXT');
  
  return hasElevation && hasCardContent;
}

/**
 * Extract properties from a component node
 */
function extractComponentProperties(node: any, componentType: string): Record<string, any> {
  const properties: Record<string, any> = {};
  
  switch (componentType) {
    case 'Button':
      // Determine button variant
      properties.variant = determineButtonVariant(node);
      
      // Determine color theme
      properties.color = determineColorTheme(node);
      
      // Check if disabled
      properties.disabled = isNodeDisabled(node);
      
      // Check for icon
      properties.icon = hasChildIcon(node);
      break;
      
    case 'Input':
      // Determine input appearance
      properties.appearance = determineInputAppearance(node);
      
      // Extract label
      properties.label = extractTextContent(node, 'label');
      
      // Extract placeholder
      properties.placeholder = extractTextContent(node, 'placeholder') || 
                              extractTextContent(node, 'hint');
      
      // Check if required
      properties.required = isInputRequired(node);
      break;
      
    case 'Card':
      // Extract card title
      properties.title = extractTextContent(node, 'title');
      
      // Extract card subtitle if any
      const subtitle = extractTextContent(node, 'subtitle');
      if (subtitle) {
        properties.subtitle = subtitle;
      }
      
      // Extract card content
      properties.content = extractTextContent(node, 'content');
      
      // Check for action buttons
      properties.actions = hasActionButtons(node);
      break;
      
    case 'DatePicker':
      // Extract label
      properties.label = extractTextContent(node, 'label') || 'Choose a date';
      
      // Determine appearance
      properties.appearance = determineInputAppearance(node);
      break;
      
    case 'Select':
      // Extract label
      properties.label = extractTextContent(node, 'label') || 'Select an option';
      
      // Determine appearance
      properties.appearance = determineInputAppearance(node);
      
      // Try to extract options
      properties.options = extractSelectOptions(node);
      break;
  }
  
  return properties;
}

/**
 * Determine button variant from node properties
 */
function determineButtonVariant(node: any): string {
  // Check for known component ids
  if (node.componentId) {
    for (const [variant, ids] of Object.entries(BUTTON_VARIANTS)) {
      if (node.componentId.includes(variant)) {
        return ids;
      }
    }
  }
  
  // Check name patterns
  const nameLower = node.name.toLowerCase();
  for (const [variant, value] of Object.entries(BUTTON_VARIANTS)) {
    if (nameLower.includes(variant)) {
      return value;
    }
  }
  
  // Analyze visual properties
  // Raised buttons typically have shadows
  if (node.effects?.some((effect: any) => 
      effect.type === 'DROP_SHADOW' && effect.visible !== false)) {
    return 'raised';
  }
  
  // Check if it has a fill (background color)
  const hasFill = node.fills?.some((fill: any) => 
    fill.visible !== false && fill.opacity > 0);
  
  // Check if it has a stroke (border)
  const hasStroke = node.strokes?.some((stroke: any) => 
    stroke.visible !== false);
  
  // Stroked/outlined buttons have visible strokes but minimal or no fills
  if (hasStroke && (!hasFill || node.fills.every((fill: any) => fill.opacity < 0.2))) {
    return 'stroked';
  }
  
  // Flat buttons have background but no elevation
  if (hasFill) {
    return 'flat';
  }
  
  // Default to basic
  return 'basic';
}

/**
 * Determine color theme from node properties
 */
function determineColorTheme(node: any): string {
  // Check name patterns
  const nameLower = node.name.toLowerCase();
  
  if (nameLower.includes('primary')) {
    return 'primary';
  }
  
  if (nameLower.includes('accent') || nameLower.includes('secondary')) {
    return 'accent';
  }
  
  if (nameLower.includes('warn') || nameLower.includes('danger') || nameLower.includes('error')) {
    return 'warn';
  }
  
  // Check fill colors
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills.find((f: any) => f.visible !== false && f.opacity > 0);
    
    if (fill && fill.color) {
      const { r, g, b } = fill.color;
      
      // Simple color analysis (would be more sophisticated in production)
      if (r > 0.7 && g < 0.3 && b < 0.3) {
        return 'warn';
      }
      
      if (r < 0.3 && g < 0.5 && b > 0.7) {
        return 'primary';
      }
      
      if (r > 0.7 && g > 0.5 && b < 0.3) {
        return 'accent';
      }
    }
  }
  
  // Default to primary
  return 'primary';
}

/**
 * Check if a node appears to be disabled
 */
function isNodeDisabled(node: any): boolean {
  // Check for disabled in name
  if (node.name.toLowerCase().includes('disabled')) {
    return true;
  }
  
  // Check for opacity that suggests disabled state
  if (node.opacity && node.opacity < 0.5) {
    return true;
  }
  
  // Check for desaturated colors that suggest disabled state
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills.find((f: any) => f.visible !== false);
    if (fill && fill.color) {
      const { r, g, b } = fill.color;
      // Check if the color is very gray (low saturation)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      
      if (saturation < 0.1) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if node has child icon
 */
function hasChildIcon(node: any): boolean {
  if (!node.children) return false;
  
  return node.children.some((child: any) => 
    child.type === 'VECTOR' || 
    child.name.toLowerCase().includes('icon') || 
    (child.width && child.height && child.width === child.height && child.width < 24)
  );
}

/**
 * Determine input appearance from node properties
 */
function determineInputAppearance(node: any): string {
  // Check for known component ids
  if (node.componentId) {
    for (const [appearance, value] of Object.entries(INPUT_APPEARANCES)) {
      if (node.componentId.includes(appearance)) {
        return value;
      }
    }
  }
  
  // Check name patterns
  const nameLower = node.name.toLowerCase();
  for (const [appearance, value] of Object.entries(INPUT_APPEARANCES)) {
    if (nameLower.includes(appearance)) {
      return value;
    }
  }
  
  // Check if it has a visible stroke (border)
  const hasStroke = node.strokes?.some((stroke: any) => 
    stroke.visible !== false);
  
  if (hasStroke) {
    return 'outline';
  }
  
  // Check if it has a background fill
  const hasFill = node.fills?.some((fill: any) => 
    fill.visible !== false && fill.opacity > 0);
  
  if (hasFill) {
    return 'fill';
  }
  
  // Default to standard
  return 'standard';
}

/**
 * Extract text content from a specific child by purpose
 */
function extractTextContent(node: any, purpose: string): string | null {
  if (!node.children) return null;
  
  // First look for a text element with the purpose in its name
  const textByName = node.children.find((child: any) => 
    child.type === 'TEXT' && 
    child.name.toLowerCase().includes(purpose.toLowerCase())
  );
  
  if (textByName && textByName.characters) {
    return textByName.characters;
  }
  
  // If not found, use heuristics based on position and styling
  if (purpose === 'title' || purpose === 'heading') {
    // Look for the largest, boldest text
    const textNodes = node.children.filter((child: any) => child.type === 'TEXT');
    if (textNodes.length > 0) {
      const sorted = textNodes.sort((a: any, b: any) => {
        const aFontSize = a.style?.fontSize || 0;
        const bFontSize = b.style?.fontSize || 0;
        const aFontWeight = a.style?.fontWeight || 0;
        const bFontWeight = b.style?.fontWeight || 0;
        
        // Prioritize font size, then weight
        if (aFontSize !== bFontSize) {
          return bFontSize - aFontSize;
        }
        return bFontWeight - aFontWeight;
      });
      
      return sorted[0].characters;
    }
  }
  
  if (purpose === 'label') {
    // Look for smaller text at the top or left
    const textNodes = node.children.filter((child: any) => 
      child.type === 'TEXT' && 
      (child.y < node.height * 0.3 || child.x < node.width * 0.2)
    );
    
    if (textNodes.length > 0) {
      return textNodes[0].characters;
    }
  }
  
  if (purpose === 'content') {
    // Look for the most substantial text block
    const textNodes = node.children.filter((child: any) => child.type === 'TEXT');
    if (textNodes.length > 0) {
      const sorted = textNodes.sort((a: any, b: any) => {
        // Prioritize length of content
        return (b.characters?.length || 0) - (a.characters?.length || 0);
      });
      
      return sorted[0].characters;
    }
  }
  
  return null;
}

/**
 * Check if an input field appears to be required
 */
function isInputRequired(node: any): boolean {
  // Check for required in name
  if (node.name.toLowerCase().includes('required')) {
    return true;
  }
  
  // Check for asterisk in children
  if (node.children) {
    return node.children.some((child: any) => 
      (child.type === 'TEXT' && child.characters?.includes('*')) ||
      child.name.toLowerCase().includes('required') ||
      child.name.toLowerCase().includes('asterisk')
    );
  }
  
  return false;
}

/**
 * Check if a card node has action buttons
 */
function hasActionButtons(node: any): boolean {
  if (!node.children) return false;
  
  // Look for a frame that contains actions
  const actionsFrame = node.children.find((child: any) => 
    (child.type === 'FRAME' || child.type === 'GROUP') &&
    (child.name.toLowerCase().includes('action') || 
     child.name.toLowerCase().includes('button'))
  );
  
  if (actionsFrame) {
    return true;
  }
  
  // Look for button-like children
  return node.children.some((child: any) => 
    child.type === 'INSTANCE' && 
    (child.componentId?.includes('button') || 
     child.name.toLowerCase().includes('button'))
  );
}

/**
 * Extract options from a select component
 */
function extractSelectOptions(node: any): string[] | null {
  if (!node.children) return null;
  
  // Look for option elements
  const optionNodes = node.children.filter((child: any) => 
    child.name.toLowerCase().includes('option') ||
    child.name.toLowerCase().includes('item')
  );
  
  if (optionNodes.length > 0) {
    return optionNodes.map((option: any) => {
      if (option.characters) {
        return option.characters;
      }
      if (option.children && option.children.some((child: any) => child.type === 'TEXT')) {
        const textChild = option.children.find((child: any) => child.type === 'TEXT');
        return textChild.characters;
      }
      return option.name.replace(/option|item/i, '').trim();
    });
  }
  
  return null;
}

/**
 * Extract styles from a component node
 */
function extractComponentStyles(node: any): Record<string, any> {
  const styles: Record<string, any> = {};
  
  // Extract dimensions
  if (node.absoluteBoundingBox) {
    if (node.absoluteBoundingBox.width) {
      styles.width = node.absoluteBoundingBox.width;
    }
    if (node.absoluteBoundingBox.height) {
      styles.height = node.absoluteBoundingBox.height;
    }
  }
  
  // Extract corner radius
  if (node.cornerRadius) {
    styles.borderRadius = node.cornerRadius;
  }
  
  // Extract padding (if available)
  if (node.paddingLeft || node.paddingRight || node.paddingTop || node.paddingBottom) {
    styles.padding = {
      left: node.paddingLeft || 0,
      right: node.paddingRight || 0,
      top: node.paddingTop || 0,
      bottom: node.paddingBottom || 0
    };
  }
  
  // Extract typography (if available)
  if (node.style) {
    styles.typography = {
      fontSize: node.style.fontSize,
      fontWeight: node.style.fontWeight,
      lineHeight: node.style.lineHeight,
      letterSpacing: node.style.letterSpacing,
      textAlign: node.style.textAlignHorizontal
    };
  }
  
  // Extract colors
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills.find((f: any) => f.visible !== false);
    if (fill && fill.color) {
      styles.backgroundColor = {
        r: Math.round(fill.color.r * 255),
        g: Math.round(fill.color.g * 255),
        b: Math.round(fill.color.b * 255)
      };
    }
  }
  
  if (node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes.find((s: any) => s.visible !== false);
    if (stroke && stroke.color) {
      styles.borderColor = {
        r: Math.round(stroke.color.r * 255),
        g: Math.round(stroke.color.g * 255),
        b: Math.round(stroke.color.b * 255)
      };
    }
  }
  
  // Extract shadows
  if (node.effects && node.effects.length > 0) {
    const shadowEffect = node.effects.find((e: any) => 
      e.type === 'DROP_SHADOW' && e.visible !== false
    );
    
    if (shadowEffect) {
      styles.boxShadow = {
        offsetX: shadowEffect.offset?.x || 0,
        offsetY: shadowEffect.offset?.y || 0,
        radius: shadowEffect.radius || 0,
        color: shadowEffect.color ? {
          r: Math.round(shadowEffect.color.r * 255),
          g: Math.round(shadowEffect.color.g * 255),
          b: Math.round(shadowEffect.color.b * 255),
          a: shadowEffect.color.a || 1
        } : { r: 0, g: 0, b: 0, a: 0.25 }
      };
    }
  }
  
  return styles;
}

/**
 * Determine component support status
 */
function determineComponentSupportStatus(componentType: string): 'supported' | 'partial' | 'unsupported' {
  // Components with full support
  const fullySupported = [
    'Button', 
    'Input', 
    'Card', 
    'Checkbox', 
    'Radio'
  ];
  
  // Components with partial support
  const partiallySupported = [
    'Select',
    'DatePicker',
    'Tabs',
    'Table'
  ];
  
  if (fullySupported.includes(componentType)) {
    return 'supported';
  } else if (partiallySupported.includes(componentType)) {
    return 'partial';
  } else {
    return 'unsupported';
  }
}

/**
 * Map component type to Angular Material component
 */
function mapToAngularMaterialComponent(componentType: string): string | undefined {
  const componentMap: Record<string, string> = {
    'Button': 'mat-button',
    'Input': 'mat-form-field',
    'Card': 'mat-card',
    'Checkbox': 'mat-checkbox',
    'Radio': 'mat-radio',
    'Select': 'mat-select',
    'DatePicker': 'mat-datepicker',
    'Tabs': 'mat-tabs',
    'Table': 'mat-table'
  };
  
  return componentMap[componentType];
}

/**
 * Convert analyzed components to Angular Material
 */
export async function convertToAngularMaterial(fileKey: string): Promise<void> {
  console.log(`Converting components for file: ${fileKey}`);
  
  try {
    // In a production environment, we would:
    // 1. Retrieve the analyzed components from storage
    // 2. Generate Angular Material code for each component
    // 3. Store the generated code for later retrieval
    
    // For now, simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Conversion completed");
  } catch (error) {
    console.error('Error converting to Angular Material:', error);
    throw new Error(`Failed to convert components: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get demo Figma data
 */
export async function getDemoFigmaData(): Promise<FigmaFileResponse> {
  console.log("Loading demo Figma data");
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return demo data
    return {
      fileKey: "demo-figma-file",
      fileName: "Demo Design System",
      components: [
        {
          figmaId: "demo:1",
          name: "Primary Button",
          type: "Button",
          angularComponent: "mat-button",
          supportStatus: "supported",
          properties: {
            variant: "raised",
            color: "primary"
          },
          styles: {
            width: 120,
            height: 40,
            borderRadius: 4,
            backgroundColor: { r: 63, g: 81, b: 181 }
          }
        },
        {
          figmaId: "demo:2",
          name: "Input Field",
          type: "Input",
          angularComponent: "mat-form-field",
          supportStatus: "supported",
          properties: {
            appearance: "outline",
            label: "Input Label",
            placeholder: "Enter text"
          },
          styles: {
            width: 280,
            height: 56
          }
        },
        {
          figmaId: "demo:3",
          name: "Card Component",
          type: "Card",
          angularComponent: "mat-card",
          supportStatus: "supported",
          properties: {
            title: "Card Title",
            content: "Card content text",
            actions: true
          },
          styles: {
            width: 320,
            height: 200,
            borderRadius: 8,
            boxShadow: {
              offsetX: 0,
              offsetY: 2,
              radius: 4,
              color: { r: 0, g: 0, b: 0, a: 0.25 }
            }
          }
        },
        {
          figmaId: "demo:4",
          name: "Date Picker",
          type: "DatePicker",
          angularComponent: "mat-datepicker",
          supportStatus: "partial",
          properties: {
            appearance: "outline",
            label: "Choose a date"
          },
          styles: {
            width: 280,
            height: 56
          }
        },
        {
          figmaId: "demo:5",
          name: "Custom Carousel",
          type: "Custom",
          supportStatus: "unsupported",
          styles: {
            width: 400,
            height: 240
          }
        }
      ],
      stats: {
        totalComponents: 5,
        frames: 3,
        supported: 3,
        partial: 1,
        unsupported: 1
      }
    };
  } catch (error) {
    console.error('Error loading demo data:', error);
    throw new Error(`Failed to load demo data: ${error instanceof Error ? error.message : String(error)}`);
  }
}
