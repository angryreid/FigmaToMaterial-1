import { useConversion } from '@/context/ConversionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function ConvertStep() {
  const { design, setCurrentStep, setIsProcessing } = useConversion();
  const { toast } = useToast();
  
  const handleBackClick = () => {
    setCurrentStep('analyze');
  };

  const handleConvertClick = async () => {
    if (!design) {
      toast({
        title: "Error",
        description: "No design data available. Please go back and import a design.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const response = await apiRequest('POST', '/api/figma/convert', { 
        fileKey: design.fileKey 
      });
      
      if (!response.ok) {
        throw new Error('Failed to convert components');
      }
      
      setCurrentStep('export');
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: error instanceof Error ? error.message : "Failed to convert components",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!design) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-medium mb-6">Convert Components</h2>
          <p>No design data available. Please go back and import a design.</p>
          <div className="flex justify-between border-t border-neutral-200 pt-6 mt-6">
            <Button variant="outline" onClick={handleBackClick}>Back</Button>
            <Button disabled>Convert Components</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    supported: design.components.filter(c => c.supportStatus === 'supported').length,
    partial: design.components.filter(c => c.supportStatus === 'partial').length,
    unsupported: design.components.filter(c => c.supportStatus === 'unsupported').length,
  };

  return (
    <Card className="bg-white rounded-lg shadow-md mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-medium mb-6">Convert Components</h2>
        
        <div className="mb-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Detected Components</h3>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {design.components.length} found
            </span>
          </div>
          
          <div className="border border-neutral-200 rounded-lg overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Angular Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {design.components.map((component) => (
                  <tr key={component.figmaId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-neutral-100 rounded mr-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {component.type === 'Button' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            ) : component.type === 'Input' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            ) : component.type === 'Card' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{component.name}</div>
                          <div className="text-sm text-neutral-500">id: {component.figmaId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-900">{component.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-900">{component.angularComponent || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${
                        component.supportStatus === 'supported' ? 'bg-green-500' :
                        component.supportStatus === 'partial' ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        {component.supportStatus === 'supported' ? 'Supported' :
                         component.supportStatus === 'partial' ? 'Partial' : 'Unsupported'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-500 bg-opacity-10 rounded border border-green-500 border-opacity-20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium">Supported</p>
                <p className="text-lg font-bold">{stats.supported}</p>
              </div>
            </div>
            <div className="p-4 bg-orange-500 bg-opacity-10 rounded border border-orange-500 border-opacity-20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium">Partial Support</p>
                <p className="text-lg font-bold">{stats.partial}</p>
              </div>
            </div>
            <div className="p-4 bg-red-500 bg-opacity-10 rounded border border-red-500 border-opacity-20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium">Unsupported</p>
                <p className="text-lg font-bold">{stats.unsupported}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-500 bg-opacity-10 rounded border border-blue-500 border-opacity-20 flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-neutral-700">
              Unsupported components will be generated as placeholder HTML elements with styling approximated from the design.
            </p>
          </div>
        </div>
        
        <div className="flex justify-between border-t border-neutral-200 pt-6">
          <Button variant="outline" onClick={handleBackClick}>
            Back
          </Button>
          <Button onClick={handleConvertClick}>
            Convert Components
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
