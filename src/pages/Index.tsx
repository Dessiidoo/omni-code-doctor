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

  const analyzeCode = async (code: string) => {
    setIsAnalyzing(true);
    setFixedCode('');
    setIssues([]);
    
    try {
      // Use free AI code analysis via Galaxy.ai
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (window.prompt('Please enter your OpenAI API key (get free credits at platform.openai.com):') || '')
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert code analyzer. Analyze the given code and return a JSON response with: 1) "issues" array containing objects with type ("error"|"warning"|"info"), message, and line number, 2) "fixedCode" with the corrected version, 3) "summary" with changes made. Be concise and practical.'
            },
            {
              role: 'user',
              content: `Analyze and fix this code:\n\n${code}`
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Try to parse JSON response, fallback to text analysis
      let analysisResult;
      try {
        analysisResult = JSON.parse(aiResponse);
      } catch {
        // Fallback: simple text-based analysis
        analysisResult = {
          issues: [
            { type: 'info' as const, message: 'AI analysis completed', line: 1 }
          ],
          fixedCode: aiResponse,
          summary: 'Code has been analyzed and improved by AI'
        };
      }

      setIssues(analysisResult.issues || []);
      setFixedCode(analysisResult.fixedCode || aiResponse);
      
      toast.success(`Analysis complete! ${analysisResult.summary || 'Code has been processed.'}`);
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Fallback to local analysis
      const localAnalysis = analyzeLocally(code);
      setIssues(localAnalysis.issues);
      setFixedCode(localAnalysis.fixedCode);
      
      toast.error('AI service unavailable, using local analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeLocally = (code: string) => {
    const issues = [];
    const lines = code.split('\n');
    
    // Basic local analysis
    lines.forEach((line, index) => {
      if (line.includes('var ')) {
        issues.push({ type: 'warning' as const, message: 'Consider using const/let instead of var', line: index + 1 });
      }
      if (line.includes('console.log') && !line.includes('//')) {
        issues.push({ type: 'info' as const, message: 'Remove console.log in production', line: index + 1 });
      }
      if (line.includes('==') && !line.includes('===')) {
        issues.push({ type: 'warning' as const, message: 'Use === instead of ==', line: index + 1 });
      }
    });

    const fixedCode = code
      .replace(/var /g, 'const ')
      .replace(/==/g, '===')
      .replace(/console\.log\(/g, '// console.log(')
      + '\n\n// Local Analysis Applied:\n// - Replaced var with const\n// - Fixed equality operators\n// - Commented out console.log statements';

    return { issues, fixedCode };
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
                onAnalyze={analyzeCode}
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
