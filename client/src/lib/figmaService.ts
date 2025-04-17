import { apiRequest } from './queryClient';
import { FigmaFileResponse } from '@shared/schema';

export async function importFigmaDesign(url: string): Promise<FigmaFileResponse> {
  const response = await apiRequest('POST', '/api/figma/import', { url });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to import Figma design');
  }
  
  return response.json();
}

export async function uploadFigmaFile(file: File): Promise<FigmaFileResponse> {
  const formData = new FormData();
  formData.append('figmaFile', file);
  
  const response = await fetch('/api/figma/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to upload Figma file');
  }
  
  return response.json();
}

export async function getDemoFigmaDesign(): Promise<FigmaFileResponse> {
  const response = await apiRequest('GET', '/api/figma/demo');
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to load demo design');
  }
  
  return response.json();
}

export async function convertFigmaComponents(fileKey: string): Promise<void> {
  const response = await apiRequest('POST', '/api/figma/convert', { fileKey });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to convert components');
  }
}

export async function getComponentCode(fileKey: string, componentId: string): Promise<{ html: string; ts: string; scss: string }> {
  const response = await apiRequest('GET', `/api/figma/component/${fileKey}/${componentId}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch component code');
  }
  
  return response.json();
}

export async function downloadComponent(fileKey: string, componentId: string): Promise<Blob> {
  const response = await fetch(`/api/figma/download/${fileKey}/${componentId}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to download component');
  }
  
  return response.blob();
}

export async function downloadAllComponents(fileKey: string): Promise<Blob> {
  const response = await fetch(`/api/figma/download-all/${fileKey}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to download all components');
  }
  
  return response.blob();
}
