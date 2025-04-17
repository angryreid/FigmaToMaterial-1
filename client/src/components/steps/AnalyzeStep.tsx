import { useEffect, useState } from 'react';
import { useConversion } from '@/context/ConversionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function AnalyzeStep() {
  const { design, setCurrentStep, isProcessing, setIsProcessing } = useConversion();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Starting analysis...');
  const { toast } = useToast();

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + 5, 95);
          
          // Update status message based on progress
          if (newProgress > 30 && newProgress < 60) {
            setStatusMessage('Identifying components and styles...');
          } else if (newProgress >= 60 && newProgress < 80) {
            setStatusMessage('Mapping to Angular Material components...');
          } else if (newProgress >= 80) {
            setStatusMessage('Finalizing analysis...');
          }
          
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setStatusMessage('Analysis complete!');
    }
  }, [isProcessing]);

  const handleBackClick = () => {
    setCurrentStep('import');
  };

  const handleContinueClick = () => {
    if (design) {
      setCurrentStep('convert');
    } else {
      toast({
        title: "Error",
        description: "No design data available. Please go back and import a design.",
        variant: "destructive",
      });
    }
  };

  if (!design) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-medium mb-6">Analyzing Design</h2>
          <p>No design data available. Please go back and import a design.</p>
          <div className="flex justify-between border-t border-neutral-200 pt-6 mt-6">
            <Button variant="outline" onClick={handleBackClick}>Back</Button>
            <Button disabled>Continue</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-medium mb-6">Analyzing Design</h2>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-full mr-2">
              <Progress value={progress} className="h-2 w-full" />
            </div>
            <span className="text-sm text-neutral-500 whitespace-nowrap">{progress}%</span>
          </div>
          
          <div className="text-sm text-neutral-500">
            <p className="mb-2">{statusMessage}</p>
          </div>
        </div>
        
        <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 mb-6">
          <h3 className="text-lg font-medium mb-3">Design Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded border border-neutral-200">
              <p className="text-sm text-neutral-500">Frames</p>
              <p className="text-xl font-medium">{design.stats.frames}</p>
            </div>
            <div className="p-3 bg-white rounded border border-neutral-200">
              <p className="text-sm text-neutral-500">Components</p>
              <p className="text-xl font-medium">{design.stats.totalComponents}</p>
            </div>
            <div className="p-3 bg-white rounded border border-neutral-200">
              <p className="text-sm text-neutral-500">Styles</p>
              <p className="text-xl font-medium">{8}</p> {/* Placeholder value, would come from API */}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between border-t border-neutral-200 pt-6">
          <Button variant="outline" onClick={handleBackClick}>
            Back
          </Button>
          <Button 
            onClick={handleContinueClick}
            disabled={isProcessing || !design}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
