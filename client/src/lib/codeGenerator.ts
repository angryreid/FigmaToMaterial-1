import { FigmaComponent } from '@/types';

interface CodeGenerationOptions {
  selector?: string;
  standalone?: boolean;
  useSass?: boolean;
  generateTestFile?: boolean;
  addAccessibility?: boolean;
  addAnimation?: boolean;
  theme?: 'light' | 'dark' | 'custom';
}

/**
 * Main entry point for generating Angular Material components from Figma components
 */
export function generateAngularComponent(component: FigmaComponent, options: CodeGenerationOptions = {}): {
  ts: string;
  html: string;
  scss: string;
  spec?: string;
} {
  // Generate each part of the component
  const ts = generateTypeScript(component, options);
  const html = generateHtml(component, options);
  const scss = generateScss(component, options);
  
  // Optionally generate test file
  let spec: string | undefined;
  if (options.generateTestFile) {
    spec = generateTestFile(component, options);
  }
  
  return {
    ts,
    html,
    scss,
    spec
  };
}

/**
 * Generate Angular Material TypeScript file content
 */
export function generateTypeScript(component: FigmaComponent, options: CodeGenerationOptions = {}): string {
  const selector = options.selector || `app-${component.name.toLowerCase().replace(/\s+/g, '-')}`;
  const componentClassName = formatComponentClassName(component.name);
  const standalone = options.standalone !== undefined ? options.standalone : true;
  
  // Determine required imports
  const { imports, importModules, additionalImports } = determineComponentImports(component, options);
  
  // Format imports
  const importsStr = imports.join(', ');
  const moduleImports = standalone ? 
    getStandaloneImports(importModules) : '';
  
  // Generate component metadata
  const componentMetadata = getComponentMetadata(component, selector, standalone, moduleImports);
  
  // Generate component class with properties and methods
  const componentProperties = generateComponentProperties(component, options);
  const lifecycle = generateLifecycleHooks(component, options);
  const eventHandlers = generateEventHandlers(component);
  const helperMethods = generateHelperMethods(component, options);
  
  // Assemble the complete TypeScript file
  return `import { ${importsStr} } from '@angular/core';
${importModules.join('\n')}
${additionalImports.join('\n')}

@Component({
${componentMetadata}
})
export class ${componentClassName}Component {
${componentProperties}

${lifecycle}

${eventHandlers}

${helperMethods}
}
`;
}

/**
 * Generate HTML template for Angular Material component
 */
export function generateHtml(component: FigmaComponent, options: CodeGenerationOptions = {}): string {
  // Add accessibility attributes if specified
  const a11y = options.addAccessibility ? generateAccessibilityAttributes(component) : {};
  
  switch(component.type) {
    case 'Button':
      return generateButtonTemplate(component, a11y);
    
    case 'Input':
      return generateInputTemplate(component, a11y);
    
    case 'Card':
      return generateCardTemplate(component, a11y);
    
    case 'Select':
      return generateSelectTemplate(component, a11y);
    
    case 'Checkbox':
      return generateCheckboxTemplate(component, a11y);
    
    case 'DatePicker':
      return generateDatePickerTemplate(component, a11y);
    
    case 'Tabs':
      return generateTabsTemplate(component, a11y);
    
    case 'Table':
      return generateTableTemplate(component, a11y);
    
    default:
      return generateCustomComponentTemplate(component, a11y);
  }
}

/**
 * Generate SCSS styles for Angular Material component
 */
export function generateScss(component: FigmaComponent, options: CodeGenerationOptions = {}): string {
  // Extract base styles from the component
  const baseStyles = generateBaseStyles(component);
  const customThemeVariables = options.theme === 'custom' ? generateThemeVariables(component) : '';
  
  // Generate component-specific styles
  switch(component.type) {
    case 'Button':
      return `${customThemeVariables}

button {
  ${baseStyles.join('\n  ')}
  ${generateButtonSpecificStyles(component).join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-button {
  ${generateButtonMaterialOverrides(component).join('\n  ')}
}

${options.addAnimation ? generateButtonAnimations() : ''}`;
    
    case 'Input':
      return `${customThemeVariables}

mat-form-field {
  ${baseStyles.join('\n  ')}
  ${generateInputSpecificStyles(component).join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-form-field {
  ${generateInputMaterialOverrides(component).join('\n  ')}
}

${options.addAnimation ? generateInputAnimations() : ''}`;
    
    case 'Card':
      return `${customThemeVariables}

mat-card {
  ${baseStyles.join('\n  ')}
  ${generateCardSpecificStyles(component).join('\n  ')}
}

mat-card-header {
  ${generateCardHeaderStyles(component).join('\n  ')}
}

mat-card-content {
  ${generateCardContentStyles(component).join('\n  ')}
}

mat-card-actions {
  ${generateCardActionsStyles(component).join('\n  ')}
}

${options.addAnimation ? generateCardAnimations() : ''}`;
    
    case 'Select':
      return `${customThemeVariables}

mat-form-field {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-select {
  ${generateSelectMaterialOverrides(component).join('\n  ')}
}

::ng-deep .mat-mdc-select-panel {
  ${generateSelectPanelOverrides(component).join('\n  ')}
}

${options.addAnimation ? generateSelectAnimations() : ''}`;
    
    case 'Checkbox':
      return `${customThemeVariables}

mat-checkbox {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-checkbox {
  ${generateCheckboxMaterialOverrides(component).join('\n  ')}
}

${options.addAnimation ? generateCheckboxAnimations() : ''}`;
    
    case 'DatePicker':
      return `${customThemeVariables}

mat-form-field {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-datepicker-toggle {
  ${generateDatepickerToggleOverrides(component).join('\n  ')}
}

::ng-deep .mat-calendar {
  ${generateCalendarOverrides(component).join('\n  ')}
}

${options.addAnimation ? generateDatepickerAnimations() : ''}`;
    
    case 'Tabs':
      return `${customThemeVariables}

mat-tab-group {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-tab {
  ${generateTabMaterialOverrides(component).join('\n  ')}
}

::ng-deep .mat-mdc-tab-header {
  ${generateTabHeaderOverrides(component).join('\n  ')}
}

${options.addAnimation ? generateTabsAnimations() : ''}`;
    
    case 'Table':
      return `${customThemeVariables}

.mat-mdc-table-container {
  ${baseStyles.join('\n  ')}
}

table {
  width: 100%;
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-table {
  ${generateTableMaterialOverrides(component).join('\n  ')}
}

::ng-deep .mat-mdc-row:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

${options.addAnimation ? generateTableAnimations() : ''}`;
    
    default:
      return `${customThemeVariables}

.${component.name.toLowerCase().replace(/\s+/g, '-')} {
  ${baseStyles.join('\n  ')}
  display: block;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
}

${options.addAnimation ? generateCustomComponentAnimations(component) : ''}`;
  }
}

/**
 * Generate test file for Angular component
 */
function generateTestFile(component: FigmaComponent, options: CodeGenerationOptions = {}): string {
  const componentClassName = formatComponentClassName(component.name);
  const selector = options.selector || `app-${component.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
${getTestImports(component)}

import { ${componentClassName}Component } from './${selector.replace('app-', '')}.component';

describe('${componentClassName}Component', () => {
  let component: ${componentClassName}Component;
  let fixture: ComponentFixture<${componentClassName}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ${getTestModuleImports(component)}
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(${componentClassName}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  ${getComponentSpecificTests(component)}
});
`;
}

// Utility functions for TypeScript generation

/**
 * Determine imports needed for the component
 */
function determineComponentImports(component: FigmaComponent, options: CodeGenerationOptions): {
  imports: string[];
  importModules: string[];
  additionalImports: string[];
} {
  let imports = ['Component'];
  let importModules: string[] = [];
  let additionalImports: string[] = [];
  
  // Add Input decorator if the component has inputs
  if (hasInputProperties(component)) {
    imports.push('Input');
  }
  
  // Add Output decorator if the component has outputs
  if (hasOutputEvents(component)) {
    imports.push('Output', 'EventEmitter');
  }
  
  // Add OnInit and other lifecycle hooks if needed
  if (needsLifecycleHooks(component, options)) {
    imports.push('OnInit');
    
    if (options.addAnimation) {
      imports.push('AfterViewInit');
      additionalImports.push('import { trigger, state, style, animate, transition } from \'@angular/animations\';');
    }
  }
  
  // Add ViewChild if the component needs direct DOM access
  if (needsViewChild(component, options)) {
    imports.push('ViewChild', 'ElementRef');
  }
  
  // Add component-specific imports
  switch(component.type) {
    case 'Button':
      importModules.push('import { MatButtonModule } from \'@angular/material/button\';');
      
      // Add icon module if button has an icon
      if (component.properties?.icon) {
        importModules.push('import { MatIconModule } from \'@angular/material/icon\';');
      }
      break;
      
    case 'Input':
      importModules.push('import { MatInputModule } from \'@angular/material/input\';');
      importModules.push('import { MatFormFieldModule } from \'@angular/material/form-field\';');
      
      // Add reactive forms if needed
      if (needsReactiveForms(component)) {
        importModules.push('import { FormsModule, ReactiveFormsModule } from \'@angular/forms\';');
        additionalImports.push('import { FormBuilder, FormGroup, Validators } from \'@angular/forms\';');
      } else {
        importModules.push('import { FormsModule } from \'@angular/forms\';');
      }
      break;
      
    case 'Card':
      importModules.push('import { MatCardModule } from \'@angular/material/card\';');
      
      // Add button module if card has actions
      if (component.properties?.actions) {
        importModules.push('import { MatButtonModule } from \'@angular/material/button\';');
      }
      break;
      
    case 'Select':
      importModules.push('import { MatFormFieldModule } from \'@angular/material/form-field\';');
      importModules.push('import { MatSelectModule } from \'@angular/material/select\';');
      
      if (needsReactiveForms(component)) {
        importModules.push('import { FormsModule, ReactiveFormsModule } from \'@angular/forms\';');
        additionalImports.push('import { FormBuilder, FormGroup, Validators } from \'@angular/forms\';');
      } else {
        importModules.push('import { FormsModule } from \'@angular/forms\';');
      }
      break;
      
    case 'Checkbox':
      importModules.push('import { MatCheckboxModule } from \'@angular/material/checkbox\';');
      importModules.push('import { FormsModule } from \'@angular/forms\';');
      break;
      
    case 'DatePicker':
      importModules.push('import { MatDatepickerModule } from \'@angular/material/datepicker\';');
      importModules.push('import { MatFormFieldModule } from \'@angular/material/form-field\';');
      importModules.push('import { MatInputModule } from \'@angular/material/input\';');
      importModules.push('import { MatNativeDateModule } from \'@angular/material/core\';');
      
      if (needsReactiveForms(component)) {
        importModules.push('import { FormsModule, ReactiveFormsModule } from \'@angular/forms\';');
        additionalImports.push('import { FormBuilder, FormGroup, Validators } from \'@angular/forms\';');
      } else {
        importModules.push('import { FormsModule } from \'@angular/forms\';');
      }
      break;
      
    case 'Tabs':
      importModules.push('import { MatTabsModule } from \'@angular/material/tabs\';');
      break;
      
    case 'Table':
      importModules.push('import { MatTableModule } from \'@angular/material/table\';');
      importModules.push('import { MatSortModule } from \'@angular/material/sort\';');
      importModules.push('import { MatPaginatorModule } from \'@angular/material/paginator\';');
      
      // Add additional imports for table functionality
      imports.push('ViewChild');
      additionalImports.push('import { MatTableDataSource } from \'@angular/material/table\';');
      additionalImports.push('import { MatSort } from \'@angular/material/sort\';');
      additionalImports.push('import { MatPaginator } from \'@angular/material/paginator\';');
      break;
      
    default:
      // For custom components, we might need some basic Angular modules
      importModules.push('import { CommonModule } from \'@angular/common\';');
      break;
  }
  
  return { imports, importModules, additionalImports };
}

/**
 * Format component class name (PascalCase)
 */
function formatComponentClassName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Get standalone imports for Angular standalone components
 */
function getStandaloneImports(importModules: string[]): string {
  const moduleNames = importModules.map(im => {
    const match = im.match(/import \{ ([^}]+) \} from/);
    return match ? match[1] : '';
  }).filter(Boolean);
  
  return `  standalone: true,
  imports: [${moduleNames.join(', ')}]`;
}

/**
 * Get component metadata
 */
function getComponentMetadata(
  component: FigmaComponent, 
  selector: string, 
  standalone: boolean, 
  moduleImports: string
): string {
  let metadata = `  selector: '${selector}',
  templateUrl: './${selector.replace('app-', '')}.component.html',
  styleUrls: ['./${selector.replace('app-', '')}.component.scss']`;
  
  if (standalone) {
    metadata += `,
${moduleImports}`;
  }
  
  return metadata;
}

/**
 * Check if component has input properties
 */
function hasInputProperties(component: FigmaComponent): boolean {
  // Different component types have different input properties
  switch (component.type) {
    case 'Button':
      return true; // Most buttons have text, color, etc. as inputs
    case 'Input':
      return true; // Inputs typically have value, placeholder, etc.
    case 'Card':
      return true; // Cards might have title, content as inputs
    default:
      return false;
  }
}

/**
 * Check if component has output events
 */
function hasOutputEvents(component: FigmaComponent): boolean {
  // Different component types emit different events
  switch (component.type) {
    case 'Button':
      return true; // Buttons emit click events
    case 'Input':
      return true; // Inputs emit change/input events
    case 'Checkbox':
      return true; // Checkboxes emit change events
    case 'Select':
      return true; // Selects emit selection change events
    default:
      return false;
  }
}

/**
 * Check if component needs lifecycle hooks
 */
function needsLifecycleHooks(component: FigmaComponent, options: CodeGenerationOptions): boolean {
  // Components that need initialization logic
  if (['Select', 'Table', 'DatePicker'].includes(component.type)) {
    return true;
  }
  
  // Components that need animations
  if (options.addAnimation) {
    return true;
  }
  
  return false;
}

/**
 * Check if component needs ViewChild
 */
function needsViewChild(component: FigmaComponent, options: CodeGenerationOptions): boolean {
  // Components that need direct DOM access
  if (['Table'].includes(component.type)) {
    return true; // Tables need references to MatSort and MatPaginator
  }
  
  // Components that need animations
  if (options.addAnimation && ['Button', 'Card'].includes(component.type)) {
    return true;
  }
  
  return false;
}

/**
 * Check if component needs reactive forms
 */
function needsReactiveForms(component: FigmaComponent): boolean {
  // Components that work with forms
  return ['Input', 'Select', 'DatePicker'].includes(component.type);
}

/**
 * Generate test imports for component
 */
function getTestImports(component: FigmaComponent): string {
  switch (component.type) {
    case 'Button':
      return 'import { MatButtonModule } from \'@angular/material/button\';';
    case 'Input':
      return `import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';`;
    case 'Card':
      return 'import { MatCardModule } from \'@angular/material/card\';';
    case 'Select':
      return `import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';`;
    case 'Checkbox':
      return `import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';`;
    case 'DatePicker':
      return `import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';`;
    case 'Tabs':
      return 'import { MatTabsModule } from \'@angular/material/tabs\';';
    case 'Table':
      return `import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';`;
    default:
      return 'import { CommonModule } from \'@angular/common\';';
  }
}

/**
 * Get test module imports for component
 */
function getTestModuleImports(component: FigmaComponent): string {
  switch (component.type) {
    case 'Button':
      return 'MatButtonModule';
    case 'Input':
      return 'MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule';
    case 'Card':
      return 'MatCardModule';
    case 'Select':
      return 'MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule';
    case 'Checkbox':
      return 'MatCheckboxModule, FormsModule';
    case 'DatePicker':
      return 'MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, FormsModule, ReactiveFormsModule';
    case 'Tabs':
      return 'MatTabsModule';
    case 'Table':
      return 'MatTableModule, MatSortModule, MatPaginatorModule';
    default:
      return 'CommonModule';
  }
}

/**
 * Get component-specific tests
 */
function getComponentSpecificTests(component: FigmaComponent): string {
  switch (component.type) {
    case 'Button':
      return `it('should emit click event when clicked', () => {
    spyOn(component, 'onClick');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.onClick).toHaveBeenCalled();
  });`;
    case 'Input':
      return `it('should update value when input changes', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'test value';
    inputElement.dispatchEvent(new Event('input'));
    expect(component.value).toBe('test value');
  });`;
    case 'Checkbox':
      return `it('should toggle checked state when clicked', () => {
    const checkboxElement = fixture.nativeElement.querySelector('mat-checkbox');
    checkboxElement.click();
    expect(component.checked).toBe(true);
  });`;
    default:
      return '';
  }
}

// Template generation functions

/**
 * Generate button template
 */
function generateButtonTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  const variant = component.properties?.variant || 'raised';
  const color = component.properties?.color || 'primary';
  const disabled = component.properties?.disabled ? 'disabled' : '';
  const hasIcon = component.properties?.icon;
  
  // Add aria attributes
  const ariaLabel = a11y.ariaLabel || '';
  
  if (hasIcon) {
    return `<button 
  mat-${variant}-button 
  color="${color}"
  ${disabled}
  ${ariaLabel}
  (click)="onClick()"
>
  <mat-icon>{{icon}}</mat-icon>
  <span>{{text}}</span>
</button>`;
  } else {
    return `<button 
  mat-${variant}-button 
  color="${color}"
  ${disabled}
  ${ariaLabel}
  (click)="onClick()"
>
  {{text}}
</button>`;
  }
}

/**
 * Generate input template
 */
function generateInputTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  const appearance = component.properties?.appearance || 'outline';
  const label = component.properties?.label || 'Label';
  const placeholder = component.properties?.placeholder ? `placeholder="${component.properties.placeholder}"` : '';
  const required = component.properties?.required ? 'required' : '';
  const hint = component.properties?.hint;
  
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  // Determine if we should use reactive forms
  if (needsReactiveForms(component)) {
    return `<div [formGroup]="form">
  <mat-form-field appearance="${appearance}">
    <mat-label>${label}</mat-label>
    <input 
      matInput 
      ${placeholder}
      ${required}
      formControlName="input"
      ${ariaAttributes}
      (input)="onInputChange($event)"
    >
    ${hint ? `<mat-hint>${hint}</mat-hint>` : ''}
    <mat-error *ngIf="form.get('input')?.hasError('required')">
      This field is required
    </mat-error>
  </mat-form-field>
</div>`;
  } else {
    return `<mat-form-field appearance="${appearance}">
  <mat-label>${label}</mat-label>
  <input 
    matInput 
    ${placeholder}
    ${required}
    [(ngModel)]="value"
    ${ariaAttributes}
    (input)="onInputChange($event)"
  >
  ${hint ? `<mat-hint>${hint}</mat-hint>` : ''}
</mat-form-field>`;
  }
}

/**
 * Generate card template
 */
function generateCardTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  const title = component.properties?.title;
  const subtitle = component.properties?.subtitle;
  const content = component.properties?.content || 'Card content goes here';
  const hasActions = component.properties?.actions;
  
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  return `<mat-card ${ariaAttributes}>
  ${title ? `<mat-card-header>
    <mat-card-title>{{title}}</mat-card-title>
    ${subtitle ? `<mat-card-subtitle>{{subtitle}}</mat-card-subtitle>` : ''}
  </mat-card-header>` : ''}
  
  <mat-card-content>
    <p>{{content}}</p>
  </mat-card-content>
  
  ${hasActions ? `<mat-card-actions>
    <button mat-button (click)="onAction('action1')">{{actionLabels.action1}}</button>
    <button mat-button (click)="onAction('action2')">{{actionLabels.action2}}</button>
  </mat-card-actions>` : ''}
</mat-card>`;
}

/**
 * Generate select template
 */
function generateSelectTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  const appearance = component.properties?.appearance || 'outline';
  const label = component.properties?.label || 'Select an option';
  const required = component.properties?.required ? 'required' : '';
  
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  // Determine if we should use reactive forms
  if (needsReactiveForms(component)) {
    return `<div [formGroup]="form">
  <mat-form-field appearance="${appearance}">
    <mat-label>${label}</mat-label>
    <mat-select 
      formControlName="select"
      ${required}
      ${ariaAttributes}
      (selectionChange)="onSelectionChange($event)"
    >
      <mat-option *ngFor="let option of options" [value]="option.value">
        {{option.label}}
      </mat-option>
    </mat-select>
    <mat-error *ngIf="form.get('select')?.hasError('required')">
      Please select an option
    </mat-error>
  </mat-form-field>
</div>`;
  } else {
    return `<mat-form-field appearance="${appearance}">
  <mat-label>${label}</mat-label>
  <mat-select 
    [(ngModel)]="selectedOption"
    ${required}
    ${ariaAttributes}
    (selectionChange)="onSelectionChange($event)"
  >
    <mat-option *ngFor="let option of options" [value]="option.value">
      {{option.label}}
    </mat-option>
  </mat-select>
</mat-form-field>`;
  }
}

/**
 * Generate checkbox template
 */
function generateCheckboxTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  const color = component.properties?.color || 'primary';
  const checked = component.properties?.checked ? '[checked]="checked"' : '';
  const label = component.properties?.label || 'Checkbox Label';
  
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  return `<mat-checkbox 
  color="${color}"
  ${checked}
  ${ariaAttributes}
  (change)="onCheckboxChange($event)"
>
  {{label}}
</mat-checkbox>`;
}

/**
 * Generate datepicker template
 */
function generateDatePickerTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  const appearance = component.properties?.appearance || 'outline';
  const label = component.properties?.label || 'Choose a date';
  const required = component.properties?.required ? 'required' : '';
  
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  // Determine if we should use reactive forms
  if (needsReactiveForms(component)) {
    return `<div [formGroup]="form">
  <mat-form-field appearance="${appearance}">
    <mat-label>${label}</mat-label>
    <input 
      matInput 
      [matDatepicker]="picker"
      formControlName="date"
      ${required}
      ${ariaAttributes}
    >
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
    <mat-error *ngIf="form.get('date')?.hasError('required')">
      Please select a date
    </mat-error>
  </mat-form-field>
</div>`;
  } else {
    return `<mat-form-field appearance="${appearance}">
  <mat-label>${label}</mat-label>
  <input 
    matInput 
    [matDatepicker]="picker"
    [(ngModel)]="selectedDate"
    ${required}
    ${ariaAttributes}
    (dateChange)="onDateChange($event)"
  >
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>`;
  }
}

/**
 * Generate tabs template
 */
function generateTabsTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  return `<mat-tab-group 
  ${ariaAttributes}
  (selectedTabChange)="onTabChange($event)"
>
  <mat-tab *ngFor="let tab of tabs" [label]="tab.label">
    <ng-template matTabContent>
      <div class="tab-content">
        {{tab.content}}
      </div>
    </ng-template>
  </mat-tab>
</mat-tab-group>`;
}

/**
 * Generate table template
 */
function generateTableTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  return `<div class="mat-mdc-table-container" ${ariaAttributes}>
  <table mat-table [dataSource]="dataSource" matSort>
    
    <!-- Generate columns dynamically -->
    <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
      <th mat-header-cell *matHeaderCellDef mat-sort-header> {{columnNames[column]}} </th>
      <td mat-cell *matCellDef="let element"> {{element[column]}} </td>
    </ng-container>
    
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>
  
  <mat-paginator 
    [pageSizeOptions]="[5, 10, 20]"
    showFirstLastButtons
  ></mat-paginator>
</div>`;
}

/**
 * Generate custom component template
 */
function generateCustomComponentTemplate(component: FigmaComponent, a11y: Record<string, string>): string {
  // Add aria attributes
  const ariaAttributes = Object.entries(a11y)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n  ');
  
  return `<!-- Custom component: ${component.name} -->
<div 
  class="${component.name.toLowerCase().replace(/\s+/g, '-')}"
  ${ariaAttributes}
>
  <h3>{{title}}</h3>
  <p>{{description}}</p>
  <div class="custom-content">
    <ng-content></ng-content>
  </div>
</div>`;
}

/**
 * Generate accessibility attributes for a component
 */
function generateAccessibilityAttributes(component: FigmaComponent): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  switch (component.type) {
    case 'Button':
      attributes['aria-label'] = `'${component.name}'`;
      break;
    case 'Input':
      attributes['aria-describedby'] = component.properties?.hint ? '"hint-text"' : '';
      break;
    case 'Card':
      attributes['aria-labelledby'] = component.properties?.title ? '"card-title"' : '';
      break;
    case 'Table':
      attributes['aria-label'] = `'Data table'`;
      break;
  }
  
  return attributes;
}

// Style generation functions

/**
 * Generate base styles from component
 */
function generateBaseStyles(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  // Extract dimensions if available
  if (component.styles?.width) {
    styles.push(`width: ${convertDimensionToCss(component.styles.width)};`);
  }
  
  if (component.styles?.height) {
    styles.push(`height: ${convertDimensionToCss(component.styles.height)};`);
  }
  
  // Extract border radius if available
  if (component.styles?.borderRadius) {
    styles.push(`border-radius: ${component.styles.borderRadius}px;`);
  }
  
  // Extract padding if available
  if (component.styles?.padding) {
    if (typeof component.styles.padding === 'object') {
      const { top, right, bottom, left } = component.styles.padding;
      styles.push(`padding: ${top}px ${right}px ${bottom}px ${left}px;`);
    } else {
      styles.push(`padding: ${component.styles.padding};`);
    }
  }
  
  // Extract margin if available
  if (component.styles?.margin) {
    styles.push(`margin: ${component.styles.margin};`);
  }
  
  // Extract typography styles if available
  if (component.styles?.typography) {
    const { fontSize, fontWeight, lineHeight, letterSpacing, textAlign } = component.styles.typography;
    
    if (fontSize) styles.push(`font-size: ${fontSize}px;`);
    if (fontWeight) styles.push(`font-weight: ${fontWeight};`);
    if (lineHeight) styles.push(`line-height: ${lineHeight};`);
    if (letterSpacing) styles.push(`letter-spacing: ${letterSpacing}px;`);
    if (textAlign) styles.push(`text-align: ${textAlign.toLowerCase()};`);
  }
  
  // Extract background color if available
  if (component.styles?.backgroundColor) {
    styles.push(`background-color: ${rgbToHex(component.styles.backgroundColor)};`);
  }
  
  // Extract border color if available
  if (component.styles?.borderColor) {
    styles.push(`border-color: ${rgbToHex(component.styles.borderColor)};`);
  }
  
  // Extract box shadow if available
  if (component.styles?.boxShadow) {
    const { offsetX, offsetY, radius, color } = component.styles.boxShadow;
    styles.push(`box-shadow: ${offsetX}px ${offsetY}px ${radius}px ${rgbaToHex(color)};`);
  }
  
  return styles;
}

/**
 * Convert dimension to CSS value
 */
function convertDimensionToCss(dimension: number): string {
  // For very small values, assume it's a percentage
  if (dimension < 1) {
    return `${dimension * 100}%`;
  }
  
  // For very large values, use 100% (likely a full-width element)
  if (dimension > 600) {
    return '100%';
  }
  
  // Otherwise, use pixels
  return `${dimension}px`;
}

/**
 * Convert RGB object to hex color
 */
function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (value: number) => {
    const hex = Math.round(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGBA object to hex color with alpha
 */
function rgbaToHex(rgba: { r: number; g: number; b: number; a: number }): string {
  const rgb = rgbToHex({ r: rgba.r, g: rgba.g, b: rgba.b });
  
  // If fully opaque, just return the RGB value
  if (rgba.a === 1 || rgba.a === undefined) {
    return rgb;
  }
  
  // Convert alpha to hex
  const alpha = Math.round(rgba.a * 255).toString(16);
  const alphaHex = alpha.length === 1 ? '0' + alpha : alpha;
  
  return `${rgb}${alphaHex}`;
}

/**
 * Generate theme variables for custom theming
 */
function generateThemeVariables(component: FigmaComponent): string {
  return `// Custom theme variables
$primary-color: var(--primary-color, #3f51b5);
$accent-color: var(--accent-color, #ff4081);
$warn-color: var(--warn-color, #f44336);
$background-color: var(--background-color, #fafafa);
$text-color: var(--text-color, rgba(0, 0, 0, 0.87));

// Typography
$font-family: var(--font-family, 'Roboto, "Helvetica Neue", sans-serif');
$font-size: var(--font-size, 14px);
$line-height: var(--line-height, 1.5);
`;
}

/**
 * Generate button-specific styles
 */
function generateButtonSpecificStyles(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  // Add additional button-specific styles
  styles.push('font-weight: 500;');
  styles.push('text-transform: uppercase;');
  styles.push('letter-spacing: 0.5px;');
  
  return styles;
}

/**
 * Generate button Material overrides
 */
function generateButtonMaterialOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Button');
  
  // Determine button type for specific overrides
  if (component.properties?.variant === 'raised') {
    styles.push('box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);');
  } else if (component.properties?.variant === 'stroked') {
    styles.push('border-width: 1px;');
  }
  
  return styles;
}

/**
 * Generate input-specific styles
 */
function generateInputSpecificStyles(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  // Add additional input-specific styles
  styles.push('width: 100%;');
  
  return styles;
}

/**
 * Generate input Material overrides
 */
function generateInputMaterialOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Input');
  styles.push('font-family: inherit;');
  
  return styles;
}

/**
 * Generate card-specific styles
 */
function generateCardSpecificStyles(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  // Add additional card-specific styles
  styles.push('overflow: hidden;');
  
  return styles;
}

/**
 * Generate card header styles
 */
function generateCardHeaderStyles(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  // Add additional card header styles
  styles.push('padding: 16px 16px 0;');
  
  return styles;
}

/**
 * Generate card content styles
 */
function generateCardContentStyles(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  // Add additional card content styles
  styles.push('padding: 16px;');
  
  return styles;
}

/**
 * Generate card actions styles
 */
function generateCardActionsStyles(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  // Add additional card actions styles
  styles.push('padding: 8px;');
  styles.push('display: flex;');
  styles.push('justify-content: flex-end;');
  
  return styles;
}

/**
 * Generate select Material overrides
 */
function generateSelectMaterialOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Select');
  
  return styles;
}

/**
 * Generate select panel overrides
 */
function generateSelectPanelOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Select Panel');
  styles.push('max-height: 280px;');
  
  return styles;
}

/**
 * Generate checkbox Material overrides
 */
function generateCheckboxMaterialOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Checkbox');
  
  return styles;
}

/**
 * Generate datepicker toggle overrides
 */
function generateDatepickerToggleOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Datepicker Toggle');
  
  return styles;
}

/**
 * Generate calendar overrides
 */
function generateCalendarOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Calendar');
  
  return styles;
}

/**
 * Generate tab Material overrides
 */
function generateTabMaterialOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Tabs');
  
  return styles;
}

/**
 * Generate tab header overrides
 */
function generateTabHeaderOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Tab Header');
  
  return styles;
}

/**
 * Generate table Material overrides
 */
function generateTableMaterialOverrides(component: FigmaComponent): string[] {
  const styles: string[] = [];
  
  styles.push('// Custom overrides for Material Table');
  
  return styles;
}

// Animation generation functions

/**
 * Generate button animations
 */
function generateButtonAnimations(): string {
  return `// Button animation
.mat-button-ripple {
  transition: transform 0.3s, opacity 0.2s;
}

button:hover .mat-button-ripple {
  opacity: 0.1;
}`;
}

/**
 * Generate input animations
 */
function generateInputAnimations(): string {
  return `// Input animation
::ng-deep .mat-form-field-outline {
  transition: color 0.3s;
}`;
}

/**
 * Generate card animations
 */
function generateCardAnimations(): string {
  return `// Card animation
mat-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

mat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}`;
}

/**
 * Generate select animations
 */
function generateSelectAnimations(): string {
  return `// Select animation
::ng-deep .mat-select-arrow {
  transition: transform 0.3s;
}

::ng-deep .mat-select-panel {
  transform-origin: top;
  animation: selectOpen 0.2s;
}

@keyframes selectOpen {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}`;
}

/**
 * Generate checkbox animations
 */
function generateCheckboxAnimations(): string {
  return `// Checkbox animation
::ng-deep .mat-checkbox-frame {
  transition: border-color 0.3s;
}`;
}

/**
 * Generate datepicker animations
 */
function generateDatepickerAnimations(): string {
  return `// Datepicker animation
::ng-deep .mat-datepicker-content {
  transform-origin: top;
  animation: datepickerOpen 0.2s;
}

@keyframes datepickerOpen {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}`;
}

/**
 * Generate tabs animations
 */
function generateTabsAnimations(): string {
  return `// Tabs animation
::ng-deep .mat-ink-bar {
  transition: left 0.3s cubic-bezier(0.35, 0, 0.25, 1), width 0.3s cubic-bezier(0.35, 0, 0.25, 1);
}`;
}

/**
 * Generate table animations
 */
function generateTableAnimations(): string {
  return `// Table animation
::ng-deep .mat-row {
  transition: background-color 0.2s;
}`;
}

/**
 * Generate custom component animations
 */
function generateCustomComponentAnimations(component: FigmaComponent): string {
  return `// Custom component animation
.${component.name.toLowerCase().replace(/\s+/g, '-')} {
  transition: transform 0.3s, box-shadow 0.3s;
}

.${component.name.toLowerCase().replace(/\s+/g, '-')}:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}`;
}

// Component property and method generation

/**
 * Generate component properties based on type
 */
function generateComponentProperties(component: FigmaComponent, options: CodeGenerationOptions): string {
  let props = [];
  
  switch(component.type) {
    case 'Button':
      props.push('  // Button properties');
      props.push('  @Input() text = \'' + (component.name || 'Button') + '\';');
      props.push('  @Input() color = \'' + (component.properties?.color || 'primary') + '\';');
      props.push('  @Input() disabled = ' + (component.properties?.disabled ? 'true' : 'false') + ';');
      
      if (component.properties?.icon) {
        props.push('  @Input() icon = \'add\'; // Material icon name');
      }
      
      props.push('  @Output() buttonClick = new EventEmitter<void>();');
      break;
      
    case 'Input':
      props.push('  // Input properties');
      props.push('  @Input() label = \'' + (component.properties?.label || 'Label') + '\';');
      props.push('  @Input() placeholder = \'' + (component.properties?.placeholder || '') + '\';');
      props.push('  @Input() required = ' + (component.properties?.required ? 'true' : 'false') + ';');
      
      if (needsReactiveForms(component)) {
        props.push('  form!: FormGroup;');
        props.push('  @Output() valueChange = new EventEmitter<string>();');
      } else {
        props.push('  @Input() value = \'\';');
        props.push('  @Output() valueChange = new EventEmitter<string>();');
      }
      break;
      
    case 'Card':
      props.push('  // Card properties');
      props.push('  @Input() title = \'' + (component.properties?.title || 'Card Title') + '\';');
      
      if (component.properties?.subtitle) {
        props.push('  @Input() subtitle = \'' + component.properties.subtitle + '\';');
      }
      
      props.push('  @Input() content = \'' + (component.properties?.content || 'Card content goes here') + '\';');
      
      if (component.properties?.actions) {
        props.push('  @Input() actionLabels = {');
        props.push('    action1: \'ACTION 1\',');
        props.push('    action2: \'ACTION 2\'');
        props.push('  };');
        props.push('  @Output() action = new EventEmitter<string>();');
      }
      break;
      
    case 'Select':
      props.push('  // Select properties');
      props.push('  @Input() label = \'' + (component.properties?.label || 'Select an option') + '\';');
      props.push('  @Input() required = ' + (component.properties?.required ? 'true' : 'false') + ';');
      
      // Generate options array
      props.push('  @Input() options = [');
      if (component.properties?.options && Array.isArray(component.properties.options)) {
        component.properties.options.forEach((option, index) => {
          props.push(`    { value: 'option${index + 1}', label: '${option}' },`);
        });
      } else {
        props.push('    { value: \'option1\', label: \'Option 1\' },');
        props.push('    { value: \'option2\', label: \'Option 2\' },');
        props.push('    { value: \'option3\', label: \'Option 3\' }');
      }
      props.push('  ];');
      
      if (needsReactiveForms(component)) {
        props.push('  form!: FormGroup;');
        props.push('  @Output() selectionChange = new EventEmitter<any>();');
      } else {
        props.push('  @Input() selectedOption = \'\';');
        props.push('  @Output() selectionChange = new EventEmitter<any>();');
      }
      break;
      
    case 'Checkbox':
      props.push('  // Checkbox properties');
      props.push('  @Input() label = \'' + (component.properties?.label || 'Checkbox Label') + '\';');
      props.push('  @Input() checked = ' + (component.properties?.checked ? 'true' : 'false') + ';');
      props.push('  @Input() color = \'' + (component.properties?.color || 'primary') + '\';');
      props.push('  @Output() checkedChange = new EventEmitter<boolean>();');
      break;
      
    case 'DatePicker':
      props.push('  // DatePicker properties');
      props.push('  @Input() label = \'' + (component.properties?.label || 'Choose a date') + '\';');
      props.push('  @Input() required = ' + (component.properties?.required ? 'true' : 'false') + ';');
      
      if (needsReactiveForms(component)) {
        props.push('  form!: FormGroup;');
        props.push('  @Output() dateChange = new EventEmitter<Date>();');
      } else {
        props.push('  @Input() selectedDate = new Date();');
        props.push('  @Output() dateChange = new EventEmitter<Date>();');
      }
      break;
      
    case 'Tabs':
      props.push('  // Tabs properties');
      props.push('  @Input() tabs = [');
      props.push('    { label: \'Tab 1\', content: \'Content for Tab 1\' },');
      props.push('    { label: \'Tab 2\', content: \'Content for Tab 2\' },');
      props.push('    { label: \'Tab 3\', content: \'Content for Tab 3\' }');
      props.push('  ];');
      props.push('  @Input() selectedIndex = 0;');
      props.push('  @Output() tabChange = new EventEmitter<number>();');
      break;
      
    case 'Table':
      props.push('  // Table properties');
      props.push('  displayedColumns: string[] = [\'id\', \'name\', \'description\'];');
      props.push('  columnNames: Record<string, string> = {');
      props.push('    id: \'ID\',');
      props.push('    name: \'Name\',');
      props.push('    description: \'Description\'');
      props.push('  };');
      props.push('  dataSource = new MatTableDataSource<any>([]);');
      props.push('  @Input() set data(data: any[]) {');
      props.push('    this.dataSource.data = data;');
      props.push('  }');
      props.push('  @ViewChild(MatSort) sort!: MatSort;');
      props.push('  @ViewChild(MatPaginator) paginator!: MatPaginator;');
      break;
      
    default:
      props.push('  // Custom component properties');
      props.push('  @Input() title = \'' + (component.name || 'Custom Component') + '\';');
      props.push('  @Input() description = \'Custom component description\';');
      break;
  }
  
  return props.join('\n');
}

/**
 * Generate lifecycle hooks based on component type
 */
function generateLifecycleHooks(component: FigmaComponent, options: CodeGenerationOptions): string {
  let hooks = [];
  
  if (needsLifecycleHooks(component, options)) {
    hooks.push('  // Lifecycle hooks');
    hooks.push('  ngOnInit() {');
    
    switch(component.type) {
      case 'Input':
      case 'Select':
      case 'DatePicker':
        if (needsReactiveForms(component)) {
          hooks.push('    this.initForm();');
        }
        break;
        
      case 'Table':
        hooks.push('    // Initialize table with mock data if no data is provided');
        hooks.push('    if (this.dataSource.data.length === 0) {');
        hooks.push('      this.dataSource.data = [');
        hooks.push('        { id: 1, name: \'Item 1\', description: \'Description 1\' },');
        hooks.push('        { id: 2, name: \'Item 2\', description: \'Description 2\' },');
        hooks.push('        { id: 3, name: \'Item 3\', description: \'Description 3\' }');
        hooks.push('      ];');
        hooks.push('    }');
        break;
    }
    
    hooks.push('  }');
    
    // Add ngAfterViewInit for components that need it
    if (needsViewChild(component, options)) {
      hooks.push('');
      hooks.push('  ngAfterViewInit() {');
      
      switch(component.type) {
        case 'Table':
          hooks.push('    this.dataSource.sort = this.sort;');
          hooks.push('    this.dataSource.paginator = this.paginator;');
          break;
      }
      
      hooks.push('  }');
    }
  }
  
  return hooks.join('\n');
}

/**
 * Generate event handlers based on component type
 */
function generateEventHandlers(component: FigmaComponent): string {
  let handlers = [];
  
  handlers.push('  // Event handlers');
  
  switch(component.type) {
    case 'Button':
      handlers.push('  onClick() {');
      handlers.push('    if (!this.disabled) {');
      handlers.push('      this.buttonClick.emit();');
      handlers.push('    }');
      handlers.push('  }');
      break;
      
    case 'Input':
      handlers.push('  onInputChange(event: any) {');
      
      if (needsReactiveForms(component)) {
        handlers.push('    const value = this.form.get(\'input\')?.value;');
        handlers.push('    this.valueChange.emit(value);');
      } else {
        handlers.push('    this.value = event.target.value;');
        handlers.push('    this.valueChange.emit(this.value);');
      }
      
      handlers.push('  }');
      break;
      
    case 'Card':
      if (component.properties?.actions) {
        handlers.push('  onAction(action: string) {');
        handlers.push('    this.action.emit(action);');
        handlers.push('  }');
      }
      break;
      
    case 'Select':
      handlers.push('  onSelectionChange(event: any) {');
      
      if (needsReactiveForms(component)) {
        handlers.push('    const value = this.form.get(\'select\')?.value;');
        handlers.push('    this.selectionChange.emit(value);');
      } else {
        handlers.push('    this.selectionChange.emit(event.value);');
      }
      
      handlers.push('  }');
      break;
      
    case 'Checkbox':
      handlers.push('  onCheckboxChange(event: any) {');
      handlers.push('    this.checked = event.checked;');
      handlers.push('    this.checkedChange.emit(this.checked);');
      handlers.push('  }');
      break;
      
    case 'DatePicker':
      handlers.push('  onDateChange(event: any) {');
      
      if (needsReactiveForms(component)) {
        handlers.push('    const value = this.form.get(\'date\')?.value;');
        handlers.push('    this.dateChange.emit(value);');
      } else {
        handlers.push('    this.selectedDate = event.value;');
        handlers.push('    this.dateChange.emit(this.selectedDate);');
      }
      
      handlers.push('  }');
      break;
      
    case 'Tabs':
      handlers.push('  onTabChange(event: any) {');
      handlers.push('    this.selectedIndex = event.index;');
      handlers.push('    this.tabChange.emit(this.selectedIndex);');
      handlers.push('  }');
      break;
      
    default:
      // No specific handlers for other component types
      return '';
  }
  
  return handlers.join('\n');
}

/**
 * Generate helper methods based on component type
 */
function generateHelperMethods(component: FigmaComponent, options: CodeGenerationOptions): string {
  let methods = [];
  
  // Add reactive form initialization if needed
  if (needsReactiveForms(component)) {
    methods.push('  // Helper methods');
    methods.push('  private initForm() {');
    methods.push('    this.form = new FormBuilder().group({');
    
    switch(component.type) {
      case 'Input':
        methods.push('      input: [\'\', ' + (component.properties?.required ? '[Validators.required]' : '[]') + ']');
        break;
        
      case 'Select':
        methods.push('      select: [\'\', ' + (component.properties?.required ? '[Validators.required]' : '[]') + ']');
        break;
        
      case 'DatePicker':
        methods.push('      date: [new Date(), ' + (component.properties?.required ? '[Validators.required]' : '[]') + ']');
        break;
    }
    
    methods.push('    });');
    methods.push('  }');
  }
  
  // Add component-specific helper methods
  switch(component.type) {
    case 'Table':
      methods.push(methods.length ? '' : '  // Helper methods');
      methods.push('  applyFilter(filterValue: string) {');
      methods.push('    this.dataSource.filter = filterValue.trim().toLowerCase();');
      methods.push('  }');
      break;
  }
  
  return methods.join('\n');
}
