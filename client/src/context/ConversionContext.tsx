import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ConversionStep, FigmaDesign, FigmaComponent } from '@/types';

// Define the context shape
interface ConversionContextType {
  currentStep: ConversionStep;
  setCurrentStep: (step: ConversionStep) => void;
  figmaUrl: string;
  setFigmaUrl: (url: string) => void;
  uploadMethod: 'link' | 'file';
  setUploadMethod: (method: 'link' | 'file') => void;
  design: FigmaDesign | null;
  setDesign: (design: FigmaDesign | null) => void;
  selectedComponent: FigmaComponent | null;
  setSelectedComponent: (component: FigmaComponent | null) => void;
  activeTab: 'preview' | 'html' | 'typescript' | 'scss';
  setActiveTab: (tab: 'preview' | 'html' | 'typescript' | 'scss') => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

// Create the context with default values
const ConversionContext = createContext<ConversionContextType>({
  currentStep: 'import',
  setCurrentStep: () => {},
  figmaUrl: '',
  setFigmaUrl: () => {},
  uploadMethod: 'link',
  setUploadMethod: () => {},
  design: null,
  setDesign: () => {},
  selectedComponent: null,
  setSelectedComponent: () => {},
  activeTab: 'preview',
  setActiveTab: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
});

// Create a provider component
export const ConversionProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<ConversionStep>('import');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'link' | 'file'>('link');
  const [design, setDesign] = useState<FigmaDesign | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<FigmaComponent | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'typescript' | 'scss'>('preview');
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <ConversionContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        figmaUrl,
        setFigmaUrl,
        uploadMethod,
        setUploadMethod,
        design,
        setDesign,
        selectedComponent,
        setSelectedComponent,
        activeTab,
        setActiveTab,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
};

// Custom hook to use the conversion context
export const useConversion = () => useContext(ConversionContext);
