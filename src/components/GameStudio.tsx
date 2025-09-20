import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GameCanvas } from './GameCanvas';
import { AssetPanel } from './AssetPanel';
import { GameTemplates } from './GameTemplates';
import { 
  Sparkles, 
  Play, 
  Download, 
  Share, 
  Settings, 
  Cpu, 
  Gamepad2,
  Zap,
  Code
} from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

export const GameStudio = () => {
  const [gameDescription, setGameDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('platformer');
  const [generationStep, setGenerationStep] = useState('');

  const handleGenerateGame = async () => {
    if (!gameDescription.trim()) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const steps = [
      'Analyzing game concept...',
      'Generating sprites with DALL-E 3...',
      'Composing soundtrack with MusicGen...',
      'Creating game mechanics with GPT-4...',
      'Optimizing performance...',
      'Finalizing game build...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      setGenerationProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsGenerating(false);
    setGenerationStep('Game generated successfully!');
  };

  const suggestedPrompts = [
    'Cyberpunk ninja platformer with hacking mechanics',
    'Fantasy action RPG with spell crafting',
    'Space tower defense with orbital mechanics',
    'Retro arcade racing with neon aesthetics',
    'Puzzle adventure with time manipulation'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Game Development</span>
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Create Games with AI
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your ideas into professional-quality games using advanced AI. 
              Generate sprites, music, and complete game mechanics in minutes.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-gaming-tech/20 text-gaming-tech border-gaming-tech/30">
                <Cpu className="w-3 h-3 mr-1" />
                GPT-4 Turbo
              </Badge>
              <Badge variant="secondary" className="bg-gaming-glow/20 text-gaming-glow border-gaming-glow/30">
                <Sparkles className="w-3 h-3 mr-1" />
                DALL-E 3
              </Badge>
              <Badge variant="secondary" className="bg-gaming-energy/20 text-gaming-energy border-gaming-energy/30">
                <Gamepad2 className="w-3 h-3 mr-1" />
                Phaser.js
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Interface */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Game Generation */}
          <div className="space-y-6">
            <Card className="tech-panel border-primary/30">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  AI Game Generator
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Description</label>
                    <Textarea
                      placeholder="Describe your dream game..."
                      value={gameDescription}
                      onChange={(e) => setGameDescription(e.target.value)}
                      className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quick Suggestions</label>
                    <div className="flex flex-wrap gap-2">
                      {suggestedPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs border-primary/20 hover:border-primary hover:bg-primary/10"
                          onClick={() => setGameDescription(prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{generationStep}</span>
                        <span className="text-sm font-medium text-primary">{Math.round(generationProgress)}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  )}

                  <Button 
                    onClick={handleGenerateGame}
                    disabled={!gameDescription.trim() || isGenerating}
                    className="w-full bg-gradient-primary hover:opacity-90 text-background font-medium py-6"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Game
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <GameTemplates onSelectTemplate={setSelectedTemplate} />
          </div>

          {/* Center Panel - Game Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <GameCanvas gameType={selectedTemplate} isGenerating={isGenerating} />
            
            {/* Game Controls */}
            <Card className="tech-panel border-primary/30">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="default" className="bg-gradient-primary">
                    <Play className="w-4 h-4 mr-2" />
                    Play Game
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Code className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Panel - Asset Management */}
        <div className="mt-8">
          <AssetPanel />
        </div>
      </div>
    </div>
  );
};