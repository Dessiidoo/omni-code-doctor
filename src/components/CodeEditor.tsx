import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, Play, Zap, CheckCircle, XCircle, Github } from 'lucide-react';
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
  const [githubUrl, setGithubUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);

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

  const fetchFromGithub = async () => {
    if (!githubUrl.trim()) {
      toast.error('Please enter a GitHub URL');
      return;
    }

    setIsFetching(true);
    try {
      // Parse GitHub URL
      const urlMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/blob\/[^\/]+)?(?:\/(.+))?/);
      if (!urlMatch) {
        throw new Error('Invalid GitHub URL format');
      }

      const [, owner, repo, filePath] = urlMatch;
      
      if (filePath) {
        // Fetch specific file
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('Failed to fetch file');
        
        const data = await response.json();
        const content = atob(data.content);
        setCode(content);
        
        // Auto-detect language from file extension
        const ext = filePath.split('.').pop()?.toLowerCase();
        const langMap: Record<string, string> = {
          'js': 'javascript', 'ts': 'typescript', 'py': 'python',
          'java': 'java', 'cpp': 'cpp', 'c': 'cpp', 'go': 'go', 'rs': 'rust'
        };
        if (ext && langMap[ext]) setLanguage(langMap[ext]);
        
        toast.success('Code fetched from GitHub');
      } else {
        // Fetch repository file list
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('Failed to fetch repository');
        
        const files = await response.json();
        const codeFiles = files.filter((f: any) => 
          f.type === 'file' && /\.(js|ts|py|java|cpp|c|go|rs)$/i.test(f.name)
        );
        
        if (codeFiles.length === 0) {
          throw new Error('No code files found in repository');
        }
        
        // Fetch first code file
        const firstFile = codeFiles[0];
        const fileResponse = await fetch(firstFile.download_url);
        const content = await fileResponse.text();
        setCode(content);
        
        toast.success(`Fetched ${firstFile.name} from repository`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch from GitHub');
    } finally {
      setIsFetching(false);
    }
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

        {/* GitHub URL Input */}
        <div className="mb-4 space-y-2">
          <div className="flex gap-2">
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo or https://github.com/user/repo/blob/main/file.js"
              className="flex-1"
            />
            <Button
              onClick={fetchFromGithub}
              disabled={isFetching || !githubUrl.trim()}
              variant="outline"
              size="sm"
            >
              {isFetching ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Github className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste GitHub repo URL or direct file link to fetch code automatically
          </p>
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