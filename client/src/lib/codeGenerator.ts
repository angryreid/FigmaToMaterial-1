import { FigmaComponent } from '@/types';

interface CodeGenerationOptions {
  selector?: string;
  standalone?: boolean;
  useSass?: boolean;
}

/**
 * Generate Angular Material TypeScript file content
 */
export function generateTypeScript(component: FigmaComponent, options: CodeGenerationOptions = {}): string {
  const selector = options.selector || `app-${component.name.toLowerCase().replace(/\s+/g, '-')}`;
  const standalone = options.standalone !== undefined ? options.standalone : true;
  
  let imports = ['Component'];
  let importModules: string[] = [];
  
  switch(component.type) {
    case 'Button':
      imports.push('Input');
      importModules.push('import { MatButtonModule } from \'@angular/material/button\';');
      break;
    case 'Input':
      imports.push('Input');
      importModules.push('import { MatInputModule } from \'@angular/material/input\';');
      importModules.push('import { MatFormFieldModule } from \'@angular/material/form-field\';');
      importModules.push('import { FormsModule, ReactiveFormsModule } from \'@angular/forms\';');
      break;
    case 'Card':
      importModules.push('import { MatCardModule } from \'@angular/material/card\';');
      break;
    case 'Select':
      imports.push('Input');
      importModules.push('import { MatFormFieldModule } from \'@angular/material/form-field\';');
      importModules.push('import { MatSelectModule } from \'@angular/material/select\';');
      importModules.push('import { FormsModule, ReactiveFormsModule } from \'@angular/forms\';');
      break;
    case 'Checkbox':
      importModules.push('import { MatCheckboxModule } from \'@angular/material/checkbox\';');
      importModules.push('import { FormsModule } from \'@angular/forms\';');
      break;
    case 'DatePicker':
      imports.push('Input');
      importModules.push('import { MatDatepickerModule } from \'@angular/material/datepicker\';');
      importModules.push('import { MatFormFieldModule } from \'@angular/material/form-field\';');
      importModules.push('import { MatNativeDateModule } from \'@angular/material/core\';');
      importModules.push('import { FormsModule, ReactiveFormsModule } from \'@angular/forms\';');
      break;
    default:
      break;
  }
  
  const importsStr = imports.join(', ');
  const moduleImports = standalone ? 
    `  imports: [${importModules.map(im => im.match(/import \{ ([^}]+) \} from/)?.[1] || '').join(', ')}]` : '';
  
  return `import { ${importsStr} } from '@angular/core';
${importModules.join('\n')}

@Component({
  selector: '${selector}',
  templateUrl: './${selector.replace('app-', '')}.component.html',
  styleUrls: ['./${selector.replace('app-', '')}.component.scss'],${standalone ? `
  standalone: true,
${moduleImports}` : ''}
})
export class ${component.name.replace(/\s+/g, '')}Component {
  // Add properties and methods as needed
${generateComponentProperties(component)}
}
`;
}

/**
 * Generate HTML template for Angular Material component
 */
export function generateHtml(component: FigmaComponent): string {
  switch(component.type) {
    case 'Button':
      return `<button mat-${component.properties?.variant || 'raised'}-button 
        color="${component.properties?.color || 'primary'}"
        ${component.properties?.disabled ? 'disabled' : ''}>
  ${component.name}
</button>`;
    
    case 'Input':
      return `<mat-form-field appearance="${component.properties?.appearance || 'outline'}">
  <mat-label>${component.properties?.label || 'Label'}</mat-label>
  <input matInput ${component.properties?.placeholder ? `placeholder="${component.properties.placeholder}"` : ''}>
  ${component.properties?.hint ? `<mat-hint>${component.properties.hint}</mat-hint>` : ''}
</mat-form-field>`;
    
    case 'Card':
      return `<mat-card>
  ${component.properties?.title ? `<mat-card-header>
    <mat-card-title>${component.properties.title}</mat-card-title>
    ${component.properties?.subtitle ? `<mat-card-subtitle>${component.properties.subtitle}</mat-card-subtitle>` : ''}
  </mat-card-header>` : ''}
  
  <mat-card-content>
    ${component.properties?.content || 'Card content goes here'}
  </mat-card-content>
  
  ${component.properties?.actions ? `<mat-card-actions>
    <button mat-button>ACTION 1</button>
    <button mat-button>ACTION 2</button>
  </mat-card-actions>` : ''}
</mat-card>`;
    
    case 'Select':
      return `<mat-form-field appearance="${component.properties?.appearance || 'outline'}">
  <mat-label>${component.properties?.label || 'Select an option'}</mat-label>
  <mat-select>
    <mat-option value="option1">Option 1</mat-option>
    <mat-option value="option2">Option 2</mat-option>
    <mat-option value="option3">Option 3</mat-option>
  </mat-select>
</mat-form-field>`;
    
    case 'Checkbox':
      return `<mat-checkbox color="${component.properties?.color || 'primary'}"
  ${component.properties?.checked ? 'checked' : ''}>
  ${component.properties?.label || 'Checkbox Label'}
</mat-checkbox>`;
    
    case 'DatePicker':
      return `<mat-form-field appearance="${component.properties?.appearance || 'outline'}">
  <mat-label>${component.properties?.label || 'Choose a date'}</mat-label>
  <input matInput [matDatepicker]="picker">
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>`;
    
    default:
      return `<!-- Custom component: ${component.name} -->
<div class="${component.name.toLowerCase().replace(/\s+/g, '-')}">
  <p>Custom ${component.name} Component</p>
</div>`;
  }
}

/**
 * Generate SCSS styles for Angular Material component
 */
export function generateScss(component: FigmaComponent): string {
  const baseStyles = [];
  
  if (component.styles?.width) {
    baseStyles.push(`width: ${component.styles.width};`);
  }
  
  if (component.styles?.height) {
    baseStyles.push(`height: ${component.styles.height};`);
  }
  
  if (component.styles?.margin) {
    baseStyles.push(`margin: ${component.styles.margin};`);
  }
  
  if (component.styles?.padding) {
    baseStyles.push(`padding: ${component.styles.padding};`);
  }
  
  switch(component.type) {
    case 'Button':
      return `button {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-button {
  // Add custom styles here
}`;
    
    case 'Input':
      return `mat-form-field {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-form-field {
  // Add custom styles here
}`;
    
    case 'Card':
      return `mat-card {
  ${baseStyles.join('\n  ')}
}

mat-card-content {
  // Add custom styles for content
}

mat-card-actions {
  // Add custom styles for actions
}`;
    
    case 'Select':
      return `mat-form-field {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-select {
  // Add custom styles here
}`;
    
    case 'Checkbox':
      return `mat-checkbox {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-mdc-checkbox {
  // Add custom styles here
}`;
    
    case 'DatePicker':
      return `mat-form-field {
  ${baseStyles.join('\n  ')}
}

// To override Angular Material styles, use ::ng-deep
::ng-deep .mat-datepicker-toggle {
  // Add custom styles here
}`;
    
    default:
      return `.${component.name.toLowerCase().replace(/\s+/g, '-')} {
  ${baseStyles.join('\n  ')}
  display: block;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}`;
  }
}

// Helper to generate component properties based on type
function generateComponentProperties(component: FigmaComponent): string {
  switch(component.type) {
    case 'Button':
      return `  // Button properties
  onClick() {
    console.log('Button clicked');
  }`;
    
    case 'Input':
      return `  // Input properties
  value = '';
  
  onInputChange(event: any) {
    this.value = event.target.value;
  }`;
    
    case 'Select':
      return `  // Select properties
  options = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption = '';
  
  onSelectionChange(event: any) {
    this.selectedOption = event.value;
  }`;
    
    case 'Checkbox':
      return `  // Checkbox properties
  checked = ${component.properties?.checked ? 'true' : 'false'};
  
  onCheckboxChange(event: any) {
    this.checked = event.checked;
  }`;
    
    case 'DatePicker':
      return `  // DatePicker properties
  selectedDate = new Date();
  
  onDateChange(event: any) {
    this.selectedDate = event.value;
  }`;
    
    default:
      return '';
  }
}
