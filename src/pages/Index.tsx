import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CodeEditor } from '@/components/CodeEditor';
import { toast } from 'sonner';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fixedCode, setFixedCode] = useState<string>('');
  const [issues, setIssues] = useState<Array<{ type: 'error' | 'warning' | 'info'; message: string; line?: number }>>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateAnalysis = async (code: string) => {
    setIsAnalyzing(true);
    setFixedCode('');
    setIssues([]);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const mockIssues = [
      { type: 'error' as const, message: 'Undefined variable detected', line: 5 },
      { type: 'warning' as const, message: 'Potential memory leak in loop', line: 12 },
      { type: 'info' as const, message: 'Consider using const instead of let', line: 3 }
    ];
    
    // Mock fixed code (simplified example)
    const mockFixedCode = code
      .replace(/var /g, 'const ')
      .replace(/let /g, 'const ')
      .replace(/console\.log\(/g, '// Fixed: console.log(')
      + '\n\n// AI Fixed:\n// - Replaced var/let with const where appropriate\n// - Added error handling\n// - Optimized performance';
    
    setIssues(mockIssues);
    setFixedCode(mockFixedCode);
    setIsAnalyzing(false);
    
    toast.success('Code analysis complete! Found and fixed 3 issues.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection onGetStarted={scrollToEditor} />
        
        <section ref={editorRef} className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">AI-Powered Code Analysis</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Paste your code below and let our AI analyze, debug, and fix it instantly. 
                Supports all major programming languages with enterprise-grade accuracy.
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <CodeEditor
                onAnalyze={simulateAnalysis}
                isAnalyzing={isAnalyzing}
                fixedCode={fixedCode}
                issues={issues}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
