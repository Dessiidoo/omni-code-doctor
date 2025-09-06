import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, Github, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CodeFixer AI</h1>
              <p className="text-xs text-muted-foreground">Enterprise Code Analysis & Repair</p>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              <Sparkles className="w-3 h-3 mr-1" />
              Enterprise Ready
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Github className="w-4 h-4 mr-2" />
              GitHub Integration
            </Button>
            <Button variant="outline" size="sm">
              API Access
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}