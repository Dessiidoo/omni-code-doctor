import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Zap, Shield, Cpu } from 'lucide-react';
import heroImage from '@/assets/hero-code-ai.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered Code Analysis
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Fix Any Code
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Instantly</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Enterprise-grade AI that analyzes, debugs, and repairs code in any language. 
                Transform broken code into production-ready solutions in seconds.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={onGetStarted}
                className="text-base px-8"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Fixing Code
              </Button>
              
              <Button variant="outline" size="lg" className="text-base px-8">
                <Shield className="w-5 h-5 mr-2" />
                Enterprise Demo
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Multi-Language</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Support for 20+ programming languages
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="font-medium text-sm">Enterprise Security</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  SOC2 compliant with on-premise options
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="AI Code Analysis Interface"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 animate-pulse-slow">
              <Badge className="bg-success text-success-foreground shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                99.7% Accuracy
              </Badge>
            </div>
            
            <div className="absolute -bottom-4 -left-4 animate-pulse-slow">
              <Badge variant="secondary" className="shadow-lg">
                <Cpu className="w-3 h-3 mr-1" />
                Real-time Analysis
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onGetStarted}
            className="animate-bounce"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}