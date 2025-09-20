import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Image, 
  Music, 
  Volume2, 
  Download, 
  RefreshCw, 
  Sparkles,
  Palette,
  Activity,
  FileImage,
  Plus
} from 'lucide-react';

export const AssetPanel = () => {
  const [generatingAssets, setGeneratingAssets] = useState<{ [key: string]: boolean }>({});
  
  const handleGenerateAsset = (type: string, name: string) => {
    const key = `${type}-${name}`;
    setGeneratingAssets(prev => ({ ...prev, [key]: true }));
    
    setTimeout(() => {
      setGeneratingAssets(prev => ({ ...prev, [key]: false }));
    }, 3000);
  };

  const sprites = [
    { name: 'Cyber Hero', type: 'character', size: '64x64', status: 'ready' },
    { name: 'Neon Platform', type: 'environment', size: '128x32', status: 'ready' },
    { name: 'Energy Orb', type: 'collectible', size: '32x32', status: 'ready' },
    { name: 'Plasma Blast', type: 'effect', size: '48x48', status: 'generating' },
  ];

  const sounds = [
    { name: 'Cyberpunk Ambient', type: 'background', duration: '2:43', status: 'ready' },
    { name: 'Jump SFX', type: 'effect', duration: '0:01', status: 'ready' },
    { name: 'Coin Collect', type: 'effect', duration: '0:02', status: 'ready' },
    { name: 'Boss Theme', type: 'background', duration: '3:21', status: 'generating' },
  ];

  const effects = [
    { name: 'Particle Explosion', type: 'particle', complexity: 'High', status: 'ready' },
    { name: 'Energy Trail', type: 'particle', complexity: 'Medium', status: 'ready' },
    { name: 'Screen Shake', type: 'camera', complexity: 'Low', status: 'ready' },
    { name: 'Slow Motion', type: 'time', complexity: 'Medium', status: 'generating' },
  ];

  const AssetCard = ({ asset, type, onGenerate }: any) => {
    const isGenerating = generatingAssets[`${type}-${asset.name}`];
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'ready': return 'success';
        case 'generating': return 'warning';
        default: return 'secondary';
      }
    };

    return (
      <Card className="p-4 border-secondary/30 hover:border-primary/30 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {asset.name}
          </h4>
          <Badge 
            variant="outline" 
            className={`text-xs border-${getStatusColor(asset.status)}/30 text-${getStatusColor(asset.status)}`}
          >
            {isGenerating ? 'Generating...' : asset.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Type: {asset.type}</span>
            <span>
              {type === 'sprites' && asset.size}
              {type === 'sounds' && asset.duration}
              {type === 'effects' && asset.complexity}
            </span>
          </div>
          
          {isGenerating && (
            <Progress value={66} className="h-1" />
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            disabled={asset.status === 'generating' || isGenerating}
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onGenerate(type, asset.name)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <Card className="tech-panel border-primary/30">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6 text-gaming-energy" />
            Asset Library
          </h2>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>

        <Tabs defaultValue="sprites" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
            <TabsTrigger value="sprites" className="flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Sprites
            </TabsTrigger>
            <TabsTrigger value="sounds" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Effects
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sprites" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sprites.map((sprite, index) => (
                <AssetCard 
                  key={index} 
                  asset={sprite} 
                  type="sprites"
                  onGenerate={handleGenerateAsset}
                />
              ))}
              
              <Card className="p-4 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group flex items-center justify-center">
                <div className="text-center">
                  <Plus className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-primary">Generate Sprite</p>
                  <p className="text-xs text-muted-foreground">DALL-E 3</p>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sounds" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sounds.map((sound, index) => (
                <AssetCard 
                  key={index} 
                  asset={sound} 
                  type="sounds"
                  onGenerate={handleGenerateAsset}
                />
              ))}
              
              <Card className="p-4 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-primary">Generate Audio</p>
                  <p className="text-xs text-muted-foreground">MusicGen</p>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="effects" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {effects.map((effect, index) => (
                <AssetCard 
                  key={index} 
                  asset={effect} 
                  type="effects"
                  onGenerate={handleGenerateAsset}
                />
              ))}
              
              <Card className="p-4 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-primary">Generate Effect</p>
                  <p className="text-xs text-muted-foreground">AI Engine</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};