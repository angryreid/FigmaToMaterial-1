import { useConversion } from "@/context/ConversionContext";
import StepIndicator from "@/components/StepIndicator";
import ImportStep from "@/components/steps/ImportStep";
import AnalyzeStep from "@/components/steps/AnalyzeStep";
import ConvertStep from "@/components/steps/ConvertStep";
import ExportStep from "@/components/steps/ExportStep";
import InfoPanel from "@/components/InfoPanel";

export default function HomePage() {
  const { currentStep } = useConversion();
  
  return (
    <div className="bg-neutral-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Figma to Angular Material
          </h1>
          <div>
            <a href="#" className="text-white hover:text-neutral-100 px-3 py-2 rounded-md text-sm font-medium">Documentation</a>
            <a href="#" className="text-white hover:text-neutral-100 px-3 py-2 rounded-md text-sm font-medium">GitHub</a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Step Indicator */}
          <StepIndicator />
          
          {/* Step Content */}
          {currentStep === 'import' && <ImportStep />}
          {currentStep === 'analyze' && <AnalyzeStep />}
          {currentStep === 'convert' && <ConvertStep />}
          {currentStep === 'export' && <ExportStep />}
          
          {/* Info Panel */}
          <InfoPanel />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium mb-2">Figma to Angular Material</h3>
              <p className="text-neutral-400 text-sm">Convert Figma designs to Angular Material components with ease</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-6 pt-6 text-center md:text-left">
            <p className="text-neutral-500 text-sm">&copy; 2023 Figma to Angular Material Converter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
