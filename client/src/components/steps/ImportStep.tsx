import { useState, useRef } from 'react';
import { useConversion } from '@/context/ConversionContext';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ImportStep() {
  const { 
    figmaUrl, 
    setFigmaUrl, 
    uploadMethod, 
    setUploadMethod, 
    setCurrentStep, 
    setDesign,
    setIsProcessing 
  } = useConversion();
  
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFigmaUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFigmaUrl(e.target.value);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('figmaFile', file);
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/figma/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload Figma file');
        }
        
        const data = await response.json();
        setDesign(data);
        setCurrentStep('analyze');
      } catch (error) {
        toast({
          title: 'Error uploading file',
          description: error instanceof Error ? error.message : 'Unknown error occurred',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImportClick = async () => {
    if (!figmaUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a Figma share URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsProcessing(true);
      
      const response = await apiRequest('POST', '/api/figma/import', { url: figmaUrl });
      const data = await response.json();
      
      setDesign(data);
      setCurrentStep('analyze');
    } catch (error) {
      toast({
        title: 'Import Error',
        description: error instanceof Error ? error.message : 'Failed to import Figma design',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleDemoClick = async () => {
    try {
      setIsLoading(true);
      setIsProcessing(true);
      
      const response = await apiRequest('GET', '/api/figma/demo');
      const data = await response.json();
      
      setDesign(data);
      setCurrentStep('analyze');
    } catch (error) {
      toast({
        title: 'Demo Error',
        description: error instanceof Error ? error.message : 'Failed to load demo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-white rounded-lg shadow-md mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-medium mb-6">Import Figma Design</h2>
        
        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <Button
              variant={uploadMethod === 'link' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setUploadMethod('link')}
            >
              Use Figma URL
            </Button>
            <Button
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setUploadMethod('file')}
            >
              Upload File
            </Button>
          </div>

          {uploadMethod === 'link' && (
            <div className="mb-6">
              <label htmlFor="figma-url" className="block text-sm font-medium text-neutral-500 mb-2">
                Figma Share URL
              </label>
              <div className="flex">
                <Input
                  id="figma-url"
                  type="text"
                  placeholder="https://www.figma.com/file/..."
                  value={figmaUrl}
                  onChange={handleFigmaUrlChange}
                  className="rounded-r-none"
                />
                <Button 
                  onClick={handleImportClick}
                  disabled={isLoading}
                  className="rounded-l-none"
                >
                  {isLoading ? 'Importing...' : 'Import'}
                </Button>
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                Enter a public Figma share link or a link to a file you have access to
              </p>
            </div>
          )}

          {uploadMethod === 'file' && (
            <div className="border-t border-neutral-200 my-6 pt-6">
              <h3 className="text-lg font-medium mb-4">Upload Figma Export File</h3>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center bg-neutral-50">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-4 text-neutral-600">Drag and drop your Figma export file or click to browse</p>
                  <Button
                    variant="outline"
                    onClick={handleBrowseClick}
                    disabled={isLoading}
                  >
                    Browse Files
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".fig,.json"
                    onChange={handleFileInputChange}
                  />
                  <p className="text-xs text-neutral-500 mt-4">Supports .fig and exported JSON files</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between border-t border-neutral-200 pt-6">
          <div></div>
          <Button
            variant="outline"
            onClick={handleDemoClick}
            disabled={isLoading}
          >
            Try Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
