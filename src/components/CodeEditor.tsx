import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, Play, Zap, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  onAnalyze: (code: string) => void;
  isAnalyzing?: boolean;
  fixedCode?: string;
  issues?: Array<{ type: 'error' | 'warning' | 'info'; message: string; line?: number }>;
}

export function CodeEditor({ onAnalyze, isAnalyzing = false, fixedCode, issues = [] }: CodeEditorProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }
    onAnalyze(code);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard');
  };

  const downloadCode = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section */}
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Input Code</h3>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm border border-border"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
        </div>
        
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="flex-1 min-h-[400px] font-mono text-sm bg-code-bg border-code-border resize-none"
        />
        
        <div className="flex items-center gap-3 mt-4">
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !code.trim()}
            variant="hero"
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze & Fix
              </>
            )}
          </Button>
          
          {code && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(code)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>

      {/* Output Section */}
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Fixed Code</h3>
          {fixedCode && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-success text-success-foreground">
                <CheckCircle className="w-3 h-3 mr-1" />
                Fixed
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(fixedCode)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => downloadCode(fixedCode, `fixed-code.${language}`)}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Issues Summary */}
        {issues.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Issues Found:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 text-xs p-2 rounded ${
                    issue.type === 'error' 
                      ? 'bg-destructive/10 text-destructive' 
                      : issue.type === 'warning'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {issue.type === 'error' ? (
                    <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    {issue.line && <span className="font-mono">Line {issue.line}: </span>}
                    {issue.message}
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
          </div>
        )}
        
        <Textarea
          value={fixedCode || ''}
          readOnly
          placeholder={isAnalyzing ? 'Analyzing your code...' : 'Fixed code will appear here...'}
          className="flex-1 min-h-[400px] font-mono text-sm bg-code-bg border-code-border resize-none"
        />
      </Card>
    </div>
  );
}