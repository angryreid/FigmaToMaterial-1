import { useState, useEffect } from 'react';
import { useConversion } from '@/context/ConversionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import CodePreview from '@/components/CodePreview';
import { FigmaComponent } from '@/types';

export default function ExportStep() {
  const { design, setCurrentStep, activeTab, setActiveTab } = useConversion();
  const [selectedComponentId, setSelectedComponentId] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<FigmaComponent | null>(null);
  const [generatedCode, setGeneratedCode] = useState<{ html: string; ts: string; scss: string } | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (design && design.components.length > 0 && !selectedComponentId) {
      // Initialize with the first component
      setSelectedComponentId(design.components[0].figmaId);
    }
  }, [design, selectedComponentId]);
  
  useEffect(() => {
    if (selectedComponentId && design) {
      const component = design.components.find(c => c.figmaId === selectedComponentId);
      if (component) {
        setSelectedComponent(component);
        fetchComponentCode(component.figmaId);
      }
    }
  }, [selectedComponentId, design]);
  
  const fetchComponentCode = async (componentId: string) => {
    if (!design) return;
    
    try {
      const response = await apiRequest('GET', `/api/figma/component/${design.fileKey}/${componentId}`);
      const data = await response.json();
      setGeneratedCode(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch component code",
        variant: "destructive",
      });
    }
  };
  
  const handleBackClick = () => {
    setCurrentStep('convert');
  };
  
  const handleDownloadComponent = async () => {
    if (!selectedComponent) return;
    
    try {
      const response = await apiRequest('GET', `/api/figma/download/${design!.fileKey}/${selectedComponent.figmaId}`);
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${selectedComponent.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download component",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadAll = async () => {
    if (!design) return;
    
    try {
      const response = await apiRequest('GET', `/api/figma/download-all/${design.fileKey}`);
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'angular-material-components.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download all components",
        variant: "destructive",
      });
    }
  };
  
  if (!design) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-medium mb-6">Export Angular Components</h2>
          <p>No design data available. Please go back and import a design.</p>
          <div className="flex justify-between border-t border-neutral-200 pt-6 mt-6">
            <Button variant="outline" onClick={handleBackClick}>Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white rounded-lg shadow-md mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-medium mb-6">Export Angular Components</h2>
        
        <div className="mb-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Generated Components</h3>
            <div>
              <Button 
                onClick={handleDownloadAll}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex border-b border-neutral-300">
              <button 
                className={`py-2 px-4 ${activeTab === 'preview' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600'}`}
                onClick={() => setActiveTab('preview')}
              >
                Component Preview
              </button>
              <button 
                className={`py-2 px-4 ${activeTab === 'html' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600'}`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button 
                className={`py-2 px-4 ${activeTab === 'typescript' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600'}`}
                onClick={() => setActiveTab('typescript')}
              >
                TypeScript
              </button>
              <button 
                className={`py-2 px-4 ${activeTab === 'scss' ? 'border-b-2 border-primary text-primary font-medium' : 'text-neutral-600'}`}
                onClick={() => setActiveTab('scss')}
              >
                SCSS
              </button>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="component-select" className="block text-sm font-medium text-neutral-700">Select Component</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary flex items-center"
                  onClick={handleDownloadComponent}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </Button>
              </div>
              
              <Select 
                value={selectedComponentId} 
                onValueChange={setSelectedComponentId}
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select Component" />
                </SelectTrigger>
                <SelectContent>
                  {design.components.map(component => (
                    <SelectItem 
                      key={component.figmaId} 
                      value={component.figmaId}
                    >
                      {component.name} ({component.angularComponent || 'HTML'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedComponent && (
                <div className="mb-4 p-4 border border-neutral-200 rounded-lg bg-white">
                  {activeTab === 'preview' && (
                    <>
                      <div className="p-6 flex justify-center items-center bg-neutral-100 rounded mb-4">
                        {/* This would be a rendered preview if possible */}
                        <div className="text-center">
                          <p className="text-sm text-neutral-500 mb-2">Component Preview</p>
                          <div className="rounded p-2 inline-block bg-white border border-neutral-200">
                            {selectedComponent.type === 'Button' ? (
                              <Button>{selectedComponent.name}</Button>
                            ) : selectedComponent.type === 'Card' ? (
                              <Card className="w-64">
                                <CardContent className="p-4">
                                  <h4 className="font-medium">{selectedComponent.name}</h4>
                                  <p className="text-sm text-neutral-500">Card content</p>
                                </CardContent>
                              </Card>
                            ) : (
                              <div className="p-4 border border-dashed border-neutral-300">
                                {selectedComponent.name} Preview
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {generatedCode && (
                        <>
                          <h4 className="text-sm font-medium text-neutral-700 mb-2">HTML Template</h4>
                          <CodePreview 
                            code={generatedCode.html} 
                            language="html" 
                            className="mb-4"
                          />
                          
                          <h4 className="text-sm font-medium text-neutral-700 mb-2">TypeScript</h4>
                          <CodePreview 
                            code={generatedCode.ts} 
                            language="typescript" 
                            className="mb-4"
                          />
                          
                          <h4 className="text-sm font-medium text-neutral-700 mb-2">SCSS</h4>
                          <CodePreview 
                            code={generatedCode.scss} 
                            language="scss"
                          />
                        </>
                      )}
                    </>
                  )}
                  
                  {activeTab === 'html' && generatedCode && (
                    <CodePreview 
                      code={generatedCode.html} 
                      language="html" 
                    />
                  )}
                  
                  {activeTab === 'typescript' && generatedCode && (
                    <CodePreview 
                      code={generatedCode.ts} 
                      language="typescript" 
                    />
                  )}
                  
                  {activeTab === 'scss' && generatedCode && (
                    <CodePreview 
                      code={generatedCode.scss} 
                      language="scss" 
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Project Structure</h3>
            <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
              <pre className="text-sm bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-auto">
                {`src/
├── app/
│   ├── components/
${design.components.map(c => `│   │   ├── ${c.name.toLowerCase().replace(/\s+/g, '-')}/
│   │   │   ├── ${c.name.toLowerCase().replace(/\s+/g, '-')}.component.ts
│   │   │   ├── ${c.name.toLowerCase().replace(/\s+/g, '-')}.component.html
│   │   │   └── ${c.name.toLowerCase().replace(/\s+/g, '-')}.component.scss`).join('\n')}
│   └── material.module.ts
└── assets/
    └── styles/
        └── material-theme.scss`}
              </pre>
            </div>
          </div>
          
          <div className="p-4 bg-green-500 bg-opacity-10 rounded border border-green-500 border-opacity-20 flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-neutral-800">Components successfully generated!</p>
              <p className="text-sm text-neutral-700">{design.components.length} Angular Material components are ready for download</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between border-t border-neutral-200 pt-6">
          <Button variant="outline" onClick={handleBackClick}>
            Back
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center"
            onClick={handleDownloadAll}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
