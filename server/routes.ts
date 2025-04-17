import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { figmaFileResponseSchema } from "@shared/schema";
import { z } from "zod";
import { importFigmaFile, analyzeFigmaComponents, convertToAngularMaterial, getDemoFigmaData } from "./figmaApi";
import archiver from "archiver";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // API routes - prefix with /api
  app.post('/api/figma/import', async (req, res) => {
    try {
      const schema = z.object({
        url: z.string().url(),
      });
      
      const { url } = schema.parse(req.body);
      
      // Import Figma design
      const figmaData = await importFigmaFile(url);
      
      // Analyze components from imported data
      const analysisResult = await analyzeFigmaComponents(figmaData);
      
      // Validate response schema
      const validatedResponse = figmaFileResponseSchema.parse(analysisResult);
      
      return res.json(validatedResponse);
    } catch (error) {
      console.error("Error importing Figma design:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to import Figma design"
      });
    }
  });

  // Upload Figma file
  app.post('/api/figma/upload', upload.single('figmaFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Process the uploaded file
      const figmaData = JSON.parse(req.file.buffer.toString());
      
      // Analyze components from file
      const analysisResult = await analyzeFigmaComponents(figmaData);
      
      // Validate response schema
      const validatedResponse = figmaFileResponseSchema.parse(analysisResult);
      
      return res.json(validatedResponse);
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to process uploaded file"
      });
    }
  });

  // Get demo Figma data
  app.get('/api/figma/demo', async (req, res) => {
    try {
      // Get demo Figma data
      const demoData = await getDemoFigmaData();
      
      // Validate response schema
      const validatedResponse = figmaFileResponseSchema.parse(demoData);
      
      return res.json(validatedResponse);
    } catch (error) {
      console.error("Error loading demo data:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to load demo data"
      });
    }
  });

  // Convert Figma components to Angular Material
  app.post('/api/figma/convert', async (req, res) => {
    try {
      const schema = z.object({
        fileKey: z.string(),
      });
      
      const { fileKey } = schema.parse(req.body);
      
      // Convert components
      await convertToAngularMaterial(fileKey);
      
      return res.json({ message: "Components converted successfully" });
    } catch (error) {
      console.error("Error converting components:", error);
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to convert components"
      });
    }
  });

  // Get specific component code
  app.get('/api/figma/component/:fileKey/:componentId', async (req, res) => {
    try {
      const { fileKey, componentId } = req.params;
      
      // In a real-world scenario, we would get the component code from a database
      // For now, just return mock code
      
      const html = `<button mat-raised-button color="primary">
  Primary Button
</button>`;

      const ts = `import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
})
export class PrimaryButtonComponent {
  // Component logic here
}`;

      const scss = `button {
  margin: 8px;
  font-weight: 500;
}`;
      
      return res.json({ html, ts, scss });
    } catch (error) {
      console.error("Error fetching component code:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch component code"
      });
    }
  });

  // Download component as zip
  app.get('/api/figma/download/:fileKey/:componentId', async (req, res) => {
    try {
      const { fileKey, componentId } = req.params;
      
      // Set up response for zip download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="component-${componentId}.zip"`);
      
      // Create a zip archive
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      
      // Pipe archive to response
      archive.pipe(res);
      
      // Example files to include - in real implementation, we'd use actual generated code
      const html = `<button mat-raised-button color="primary">
  Primary Button
</button>`;

      const ts = `import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
})
export class PrimaryButtonComponent {
  // Component logic here
}`;

      const scss = `button {
  margin: 8px;
  font-weight: 500;
}`;
      
      // Add files to the archive
      archive.append(html, { name: 'primary-button.component.html' });
      archive.append(ts, { name: 'primary-button.component.ts' });
      archive.append(scss, { name: 'primary-button.component.scss' });
      
      // Finalize archive
      await archive.finalize();
    } catch (error) {
      console.error("Error downloading component:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to download component"
      });
    }
  });

  // Download all components as zip
  app.get('/api/figma/download-all/:fileKey', async (req, res) => {
    try {
      const { fileKey } = req.params;
      
      // Set up response for zip download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="angular-material-components.zip"');
      
      // Create a zip archive
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      
      // Pipe archive to response
      archive.pipe(res);
      
      // Example components to include - in real implementation, we'd use actual generated code
      const components = [
        {
          name: 'primary-button',
          html: '<button mat-raised-button color="primary">Primary Button</button>',
          ts: `import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
})
export class PrimaryButtonComponent {
  // Component logic here
}`,
          scss: 'button { margin: 8px; font-weight: 500; }'
        },
        {
          name: 'input-field',
          html: `<mat-form-field appearance="outline">
  <mat-label>Input Label</mat-label>
  <input matInput placeholder="Enter text">
</mat-form-field>`,
          ts: `import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule]
})
export class InputFieldComponent {
  // Component logic here
}`,
          scss: 'mat-form-field { width: 100%; }'
        }
      ];
      
      // Create a directory structure
      components.forEach(comp => {
        archive.append(comp.html, { name: `components/${comp.name}/${comp.name}.component.html` });
        archive.append(comp.ts, { name: `components/${comp.name}/${comp.name}.component.ts` });
        archive.append(comp.scss, { name: `components/${comp.name}/${comp.name}.component.scss` });
      });
      
      // Add a material module file
      const materialModule = `import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  exports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule
  ]
})
export class MaterialModule { }`;

      archive.append(materialModule, { name: 'material.module.ts' });
      
      // Add a theme file
      const themeFile = `@use '@angular/material' as mat;

// Define custom theme
$my-primary: mat.define-palette(mat.$indigo-palette);
$my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$my-warn: mat.define-palette(mat.$red-palette);

$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

// Include theme styles
@include mat.core();
@include mat.all-component-themes($my-theme);`;

      archive.append(themeFile, { name: 'assets/styles/material-theme.scss' });
      
      // Finalize archive
      await archive.finalize();
    } catch (error) {
      console.error("Error downloading all components:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to download all components"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
