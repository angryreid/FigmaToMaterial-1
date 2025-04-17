import { useConversion } from '@/context/ConversionContext';

export default function StepIndicator() {
  const { currentStep } = useConversion();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {/* Import Step */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${currentStep === 'import' ? 'bg-primary text-white' : 
                currentStep === 'analyze' || currentStep === 'convert' || currentStep === 'export' 
                ? 'bg-primary text-white' : 'bg-neutral-300 text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className={`text-sm mt-2 font-medium ${currentStep === 'import' ? 'text-primary' : 'text-neutral-500'}`}>Import</span>
        </div>

        {/* Line 1 */}
        <div 
          className={`flex-1 h-1 mx-2 ${currentStep === 'analyze' || currentStep === 'convert' || currentStep === 'export' 
            ? 'bg-primary' : 'bg-neutral-300'}`}
        ></div>

        {/* Analyze Step */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${currentStep === 'analyze' ? 'bg-primary text-white' : 
                currentStep === 'convert' || currentStep === 'export' 
                ? 'bg-primary text-white' : 'bg-neutral-300 text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className={`text-sm mt-2 font-medium ${currentStep === 'analyze' ? 'text-primary' : 'text-neutral-500'}`}>Analyze</span>
        </div>

        {/* Line 2 */}
        <div 
          className={`flex-1 h-1 mx-2 ${currentStep === 'convert' || currentStep === 'export' 
            ? 'bg-primary' : 'bg-neutral-300'}`}
        ></div>

        {/* Convert Step */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${currentStep === 'convert' ? 'bg-primary text-white' : 
                currentStep === 'export' 
                ? 'bg-primary text-white' : 'bg-neutral-300 text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className={`text-sm mt-2 font-medium ${currentStep === 'convert' ? 'text-primary' : 'text-neutral-500'}`}>Convert</span>
        </div>

        {/* Line 3 */}
        <div 
          className={`flex-1 h-1 mx-2 ${currentStep === 'export' ? 'bg-primary' : 'bg-neutral-300'}`}
        ></div>

        {/* Export Step */}
        <div className="flex flex-col items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${currentStep === 'export' ? 'bg-primary text-white' : 'bg-neutral-300 text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <span className={`text-sm mt-2 font-medium ${currentStep === 'export' ? 'text-primary' : 'text-neutral-500'}`}>Export</span>
        </div>
      </div>
    </div>
  );
}
